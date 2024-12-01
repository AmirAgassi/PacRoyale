// game direction enum matching the cairo contract
export enum Direction {
    None = 0,
    Left = 1,
    Right = 2,
    Up = 3,
    Down = 4
}

// position type matching the cairo contract
export interface Position {
    player: string;
    vec: Vec2;
}

// 2d vector type matching the cairo contract
export interface Vec2 {
    x: number;
    y: number;
}

// moves type matching the cairo contract
export interface Moves {
    player: string;
    remaining: number;
    last_direction: Direction;
    can_move: boolean;
} 