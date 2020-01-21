import { DIRECTION_MAP, TILE_SIZE } from '../config';
import { Coordinate, TileType } from './index';

export default class Map {
    public width: number;
    public height: number;

    private data: TileType[][];
    private start: { x: number; y: number };
    private goal: { x: number; y: number };

    constructor(width: number, height: number) {
        this.data = Array.from(Array(width), () => new Array(height));
        this.width = width;
        this.height = height;

        this.start = { x: 0, y: 0 };
        this.goal = { x: 0, y: 0 };

        // Zero-fill the mapData array
        for (let i = 0; i < width; i++) {
            this.data[i].fill(TileType.EMPTY);
        }
    }

    public setTile(x: number, y: number, tileType: TileType): void {
        this.data[x][y] = tileType;
    }

    public getTile(x: number, y: number): TileType {
        if ((x < 0) || (x >= this.width) || (y < 0) || (y > this.height)) {
            return TileType.EMPTY;
        } else {
            return this.data[x][y];
        }
    }

    public setStart(x: number, y: number): void {
        this.start.x = x;
        this.start.y = y;
    }

    public getStart(): Coordinate {
        return this.start;
    }

    public setGoal(x: number, y: number): void {
        this.goal.x = x;
        this.goal.y = y;
    }

    public getGoal(): Coordinate {
        return this.goal;
    }

    public isTouchingGoal(x: number, y: number): boolean {
        const currentTileX = Math.floor(x / TILE_SIZE);
        const currentTileY = Math.floor(y / TILE_SIZE);
        if (currentTileX === this.goal.x) {
            return ((currentTileY === this.goal.y) || (currentTileY === this.goal.y - 1));
        }
        else return false;
    }

    public getBitmask(x: number, y: number): number {
        const centerTile = this.getTile(x, y);
        let bitmask = 0;

        DIRECTION_MAP.forEach((offset, direction) => {
            const offsetTile = this.getTile(x + offset.x, y + offset.y);
            let setBit = offsetTile === centerTile;
            
            // If we're checking a corner tile, we also have to check for the
            // adjacent cardinal directions (to reduce redundancies)
            if (setBit && offset.x != 0 && offset.y != 0) {
                const offsetTileX = this.getTile(x + offset.x, y);
                const offsetTileY = this.getTile(x, y + offset.y);
                setBit = offsetTileX === centerTile && offsetTileY === centerTile;
            }
    
            // If the tiles match, set the corresponding bit in the bitmask.
            if (setBit) {
                bitmask |= 1 << direction;
            }
        });

        return bitmask;
    }
}
