import { Coordinate, Direction, TileType } from './models';

export const MAP_ATLAS = `assets/maps/index.json`;
export const TEXTURE_ATLAS = 'assets/tiles/index.json';

export const GAME_SCALE = 2;
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

export const COLOR_MAP: Map<number, TileType> = new Map([
    [0xFFFFFF, TileType.EMPTY],
    [0x000000, TileType.SOLID],
    [0xff0000, TileType.SPIKE]
]);

export const TILE_MAP: Map<number, { name: string; bitmask: boolean }> = new Map([
    [TileType.SOLID, { name: "ground", bitmask: true }],
    [TileType.SPIKE, { name: "spike", bitmask: false }]
]);

export const DIRECTION_MAP: Map<number, Coordinate> = new Map([
    [Direction.NORTH_WEST, { x: -1, y: -1 }],
    [Direction.NORTH, { x: 0, y: -1 }],
    [Direction.NORTH_EAST, { x: 1, y: -1 }],
    [Direction.WEST, { x: -1, y: 0 }],
    [Direction.EAST, { x: 1, y: 0 }],
    [Direction.SOUTH_WEST, { x: -1, y: 1}],
    [Direction.SOUTH, { x: 0, y: 1 }],
    [Direction.SOUTH_EAST, { x: 1, y: 1 }]
]);

export const PLAYER_COLOR = 0x00FF00; // green
export const GOAL_COLOR = 0X0000FF;   // blue

export const TILE_SIZE = 16;
export const GRID_SIZE = 16;
export const GRID_COLOR = 0x000000;
export const GRID_ALPHA = 0.4;
export const GRID_LINE_WIDTH = 1;

export const GRAVITY = 0.25;
export const MOVE_SPEED = 1;
export const JUMP_FORCE = -Math.sqrt(2 * GRAVITY * TILE_SIZE) - 0.3;
export const MAX_JUMP_HEIGHT = 3;
export const MAX_JUMP_DISTANCE = 4;
export const CELEBRATION_TIME = 4;
export const ARC_TIME = (2 * -JUMP_FORCE) / 0.25;
