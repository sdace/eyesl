import { Coordinate, Map, TileType } from "./models";
import { Player } from "./objects";
import { TILE_SIZE } from "./config";
import { FacingDirection } from "./objects/player";

export default class Bridge {
    private map: Map;
    private player: Player;

    constructor(map: Map, player: Player) {
        this.map = map;
        this.player = player;
    }

    public jump(height: number, length?: number): void {
        this.player.jump(height, length);
    }

    public turn(): void {
        this.player.turn();
    }

    public getTileType(offset: Coordinate): TileType {
        const facing = this.player.facing;
        const x = this.player.position.x + facing * offset.x * TILE_SIZE;
        const y = this.player.position.y - offset.y * TILE_SIZE;

        const tileX = (this.player.facing === FacingDirection.RIGHT) ?
            Math.floor(x / TILE_SIZE) :
            Math.ceil(x / TILE_SIZE) - 1;
        const tileY = Math.floor(y / TILE_SIZE);

        return this.map.getTile(tileX, tileY);
    }

    public getTileTypes(startOffset: Coordinate, endOffset: Coordinate): TileType[] {
        const facing = this.player.facing;
        const startX = this.player.position.x + facing * startOffset.x * TILE_SIZE;
        const startY = this.player.position.y - startOffset.y * TILE_SIZE;
        const endX = this.player.position.x + facing * endOffset.x * TILE_SIZE;
        const endY = this.player.position.y - endOffset.y * TILE_SIZE;

        const startTileX = Math.floor(startX / TILE_SIZE);
        const startTileY = Math.floor(startY / TILE_SIZE);
        const endTileX = Math.floor(endX / TILE_SIZE);
        const endTileY = Math.floor(endY / TILE_SIZE);

        const minTileX = Math.min(startTileX, endTileX);
        const minTileY = Math.min(startTileY, endTileY);
        const maxTileX = Math.max(startTileX, endTileX);
        const maxTileY = Math.max(startTileY, endTileY);

        const tileTypes: TileType[] = [];

        for (let x = minTileX; x <= maxTileX; x++) {
            for (let y = minTileY; y <= maxTileY; y++) {
                const tileType = this.map.getTile(x, y);
                tileTypes.push(tileType);
            }
        }

        return tileTypes;
    }
}
