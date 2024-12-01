use dojo_starter::models::{Direction, Position, GameState, GameStatus};

// update the interface
#[starknet::interface]
trait IActions<T> {
    fn spawn(ref self: T);
    fn move(ref self: T, direction: Direction);
    fn init_game(ref self: T, max_players: u32);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use super::{IActions, Direction, Position, GameState, GameStatus};
    use starknet::{ContractAddress, get_caller_address};
    use dojo_starter::models::{Vec2, Moves};
    use dojo::world::{IWorldDispatcher, IWorldDispatcherTrait};

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

            // Get the address of the current caller, possibly the player's address.
            let player = get_caller_address();
            // Retrieve the player's current position from the world.
            let position: Position = world.read_model(player);

            // Update the world state with the new data.

            // 1. Move the player's position 10 units in both the x and y direction.
            let new_position = Position {
                player, vec: Vec2 { x: position.vec.x + 10, y: position.vec.y + 10 }
            };

            // Write the new position to the world.
            world.write_model(@new_position);

            // 2. Set the player's remaining moves to 100.
            let moves = Moves {
                player, remaining: 100, last_direction: Direction::None(()), can_move: true
            };

            // Write the new moves to the world.
            world.write_model(@moves);
        }

        // Implementation of the move function for the ContractState struct.
        fn move(ref self: ContractState, direction: Direction) {
            // Get the address of the current caller, possibly the player's address.

            let mut world = self.world_default();

            let player = get_caller_address();

            // Retrieve the player's current position and moves data from the world.
            let position: Position = world.read_model(player);
            let mut moves: Moves = world.read_model(player);

            // Deduct one from the player's remaining moves.
            moves.remaining -= 1;

            // Update the last direction the player moved in.
            moves.last_direction = direction;

            // Calculate the player's next position based on the provided direction.
            let next = next_position(position, direction);

            // Write the new position to the world.
            world.write_model(@next);

            // Write the new moves to the world.
            world.write_model(@moves);

            // Emit an event to the world to notify about the player's move.
            world.emit_event(@Moved { player, direction });
        }

        fn init_game(ref self: ContractState, max_players: u32) {
            // Get the default world
            let mut world = self.world_default();
            
            // Create a new game with ID 1 (for now just supporting single game)
            world.write_model(
                @GameState {
                    game_id: 1, 
                    status: GameStatus::Lobby,
                    player_count: 0,
                    max_players: max_players
                }
            );
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

    // Helper function for move
    fn next_position(position: Position, direction: Direction) -> Position {
        let mut new_position = position;
        match direction {
            Direction::Left => {
                if position.vec.x > 0 {
                    new_position.vec.x -= 1;
                }
            },
            Direction::Right => {
                new_position.vec.x += 1;
            },
            Direction::Up => {
                if position.vec.y > 0 {
                    new_position.vec.y -= 1;
                }
            },
            Direction::Down => {
                new_position.vec.y += 1;
            },
            Direction::None => {},
        };
        new_position
    }
}
