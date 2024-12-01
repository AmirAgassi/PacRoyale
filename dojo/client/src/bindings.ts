/**
 * Interface representing a player's movement capabilities and state.
 */
interface Moves {
    /** Order of fields in the model */
    fieldOrder: string[];
    /** Player identifier */
    player: string;
    /** Number of moves remaining */
    remaining: number;
    /** Last direction moved */
    last_direction: Direction;
    /** Whether the player can currently move */
    can_move: boolean;
}

/**
 * Interface representing available movement directions for a player.
 */
interface DirectionsAvailable {
    /** Order of fields in the model */
    fieldOrder: string[];
    /** Player identifier */
    player: string;
    /** List of available directions */
    directions: Direction[];
}

/**
 * Interface representing a player's position in the game world.
 */
interface Position {
    /** Order of fields in the model */
    fieldOrder: string[];
    /** Player identifier */
    player: string;
    /** 2D vector representing position */
    vec: Vec2;
}

/**
 * Enum representing possible movement directions.
 */
enum Direction {
    None = "0",
    Left = "1",
    Right = "2",
    Up = "3",
    Down = "4",
}

/**
 * Interface representing a 2D vector.
 */
interface Vec2 {
    /** X coordinate */
    x: number;
    /** Y coordinate */
    y: number;
}

/**
 * Enum representing possible game statuses.
 */
enum GameStatus {
    Lobby = "0",
    Playing = "1",
    Finished = "2"
}

/**
 * Interface representing the game state.
 */
interface GameState {
    /** Order of fields in the model */
    fieldOrder: string[];
    /** Game identifier */
    game_id: number;
    /** Game status */
    status: GameStatus;
    /** Number of players */
    player_count: number;
    /** Maximum number of players */
    max_players: number;
}

/**
 * Type representing the complete schema of game models.
 */
type Schema = {
    dojo_starter: {
        Moves: Moves;
        DirectionsAvailable: DirectionsAvailable;
        Position: Position;
        GameState: GameState;
    };
};

/**
 * Enum representing model identifiers in the format "namespace-modelName".
 */
enum Models {
    Moves = "dojo_starter-Moves",
    DirectionsAvailable = "dojo_starter-DirectionsAvailable",
    Position = "dojo_starter-Position",
    GameState = "dojo_starter-GameState"
}

const schema: Schema = {
    dojo_starter: {
        Moves: {
            fieldOrder: ["player", "remaining", "last_direction", "can_move"],
            player: "",
            remaining: 0,
            last_direction: Direction.None,
            can_move: false,
        },
        DirectionsAvailable: {
            fieldOrder: ["player", "directions"],
            player: "",
            directions: [],
        },
        Position: {
            fieldOrder: ["player", "vec"],
            player: "",
            vec: { x: 0, y: 0 },
        },
        GameState: {
            fieldOrder: ["game_id", "status", "player_count", "max_players"],
            game_id: 0,
            status: GameStatus.Lobby,
            player_count: 0,
            max_players: 4
        },
    },
};

export type { Schema, Moves, DirectionsAvailable, Position, Vec2 };
export { Direction, schema, Models, GameStatus };
