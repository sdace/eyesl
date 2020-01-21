import * as PIXI from 'pixi.js';
import { GRID_COLOR, GRID_ALPHA, GRID_SIZE, GRID_LINE_WIDTH } from '../config';

export default class Grid extends PIXI.Graphics {
    constructor(renderer: PIXI.Renderer) {
        super();
        
        for (let x = 0; x < renderer.width; x++) {
            this.beginFill(GRID_COLOR, GRID_ALPHA);
            this.drawRect(x * GRID_SIZE, 0, GRID_LINE_WIDTH, renderer.height);
        }

        for (let y = 0; y < renderer.height; y++) {
            this.beginFill(GRID_COLOR, GRID_ALPHA);
            this.drawRect(0, y * GRID_SIZE, renderer.width, GRID_LINE_WIDTH);
        }

    }
}
