import * as PIXI from 'pixi.js';
import { TILE_SIZE } from '../config';
import { AssetLoader } from '../loaders';
import { Map } from '../models';

export default class Goal extends PIXI.Sprite {
    constructor(map: Map) {
        super();
        
        this.texture = AssetLoader.getTile('flag');
        this.anchor.set(0, 0.5);

        const position = map.getGoal();
        this.position.set(position.x * TILE_SIZE, position.y * TILE_SIZE);
    }
}
