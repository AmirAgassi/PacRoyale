use dojo_starter::models::{Direction, Position, Vec2, PlayerCount};
use dojo_starter::map::{is_walkable, MAP_WIDTH, MAP_HEIGHT};

// define the interface
#[starknet::interface]
trait IActions<T> {
    fn spawn(ref self: T);
    fn move(ref self: T, direction: Direction);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use super::{IActions, Direction, Position, next_position, PlayerCount};
    use starknet::{ContractAddress, get_caller_address};
    use dojo_starter::models::{Vec2, Moves, DirectionsAvailable};

    use dojo::model::{ModelStorage, ModelValueStorage};
    use dojo::event::EventStorage;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct Moved {
        #[key]
        pub player: ContractAddress,
        pub direction: Direction,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(ref self: ContractState) {
            // Get the default world.
            let mut world = self.world_default();

            let world_key = 1; // Constant key for PlayerCount
            let mut player_count: PlayerCount = world.read_model(world_key);

            // Increment player count
            player_count.count += 1;
            if player_count.count > 4 {
                player_count.count = 1;
            }
            
            // Determine spawn position based on player number (0-based index)
            let (spawn_x, spawn_y) = match player_count.count - 1 {
                0 => (1, 1),     // Player 1: Top-left
                1 => (21, 1),    // Player 2: Top-right
                2 => (1, 21),    // Player 3: Bottom-left
                3 => (21, 21),   // Player 4: Bottom-right
                _ => panic_with_felt252('max players reached') // Optional: limit to 4 players
            };

            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();
            
            // Retrieve the player's current position from the world.
            let position: Position = world.read_model(player);

            // Update the world state with the new data.

            // 1. Move the player's position 10 units in both the x and y direction.
            // Create position at spawn point
            let new_position = Position {
                player,
                vec: Vec2 { x: spawn_x, y: spawn_y }
            };

            // Write the new position to the world.
            world.write_model(@new_position);

            // 2. Set the player's remaining moves to 100.
            let moves = Moves {
                player, remaining: 100, last_direction: Direction::None(()), can_move: true
            };

            // Write the new moves to the world.
            world.write_model(@moves);
            world.write_model(@player_count);
            world.write_model(@new_position);
        }

        // Implementation of the move function for the ContractState struct.
        fn move(ref self: ContractState, direction: Direction) {
            let mut world = self.world_default();
            let player = get_caller_address();
            
            let position: Position = world.read_model(player);
            let mut moves: Moves = world.read_model(player);

            // ensure player has moves remaining
            assert(moves.remaining > 0, 'no moves remaining');
            assert(moves.can_move, 'cannot move');

            // Calculate next position with wall detection
            match next_position(position, direction) {
                Option::Some(new_position) => {
                    // Valid move, update position
                    moves.remaining -= 1;
                    moves.last_direction = direction;
                    
                    world.write_model(@new_position);
                    world.write_model(@moves);
                    
                    let event = Moved { player, direction };
                    world.emit_event(@event);
                },
                Option::None => {
                    // Invalid move (wall collision), don't update anything
                    return;
                }
            }
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "dojo_starter". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}

// Define function like this:
fn next_position(position: Position, direction: Direction) -> Option<Position> {
    // calculate the next position
    let mut next = position;
    match direction {
        Direction::None => { return Option::Some(position); },
        Direction::Left => { 
            if next.vec.x == 0 { return Option::None; }
            next.vec.x -= 1; 
        },
        Direction::Right => { 
            next.vec.x += 1; 
        },
        Direction::Up => { 
            if next.vec.y == 0 { return Option::None; }
            next.vec.y -= 1; 
        },
        Direction::Down => { 
            next.vec.y += 1; 
        },
    };

    // check boundaries and walls
    if next.vec.x >= MAP_WIDTH || next.vec.y >= MAP_HEIGHT {
        return Option::None;
    }

    // check if the next position is walkable
    if !is_walkable(next.vec.x, next.vec.y) {
        return Option::None;
    }

    Option::Some(next)
}
