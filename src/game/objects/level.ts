import * as PIXI from 'pixi.js';
import { TILE_MAP, TILE_SIZE } from '../config';
import { AssetLoader } from '../loaders';
import { Map } from '../models';
import { Goal } from './index';

export default class Level extends PIXI.Container {
    constructor(map: Map) {
        super();

        for (let x = 0; x < map.width; x++) {
            for (let y = 0; y < map.height; y++) {
                this.placeTile(x, y, map);
            }
        }

        const goal = new Goal(map);
        this.addChild(goal);
    }

    private placeTile(x: number, y: number, map: Map): void {
        // Look up the tile and its definition
        const tile = map.getTile(x, y);
        const definition = TILE_MAP.get(tile);

        // Empty tiles don't have any definition
        if (definition !== undefined) {
            // Get the full tile name by appending the bitmask value if necessary
            const name = definition.name + (definition.bitmask ? `-${map.getBitmask(x, y)}` : '');
            
            // Find the texture in the tile atlas
            let texture = AssetLoader.getTile(name);

            // If we can't find a texture (ie. bitmasking problems), use the
            // stone tile as a fallback
            if (texture === undefined) {
                console.warn(`Undefined texture "${name}" at (${x},${y})`);
                texture = AssetLoader.getTile('stone');
            }

            // Construct a new Sprite for this tile and add it to this container
            const sprite = PIXI.Sprite.from(texture);
            sprite.x = x * TILE_SIZE;
            sprite.y = y * TILE_SIZE;
            sprite.width = TILE_SIZE;
            sprite.height = TILE_SIZE;
            this.addChild(sprite);
        }
    }
}
