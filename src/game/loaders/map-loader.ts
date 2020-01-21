import * as Color from 'color';
import { COLOR_MAP, PLAYER_COLOR, GOAL_COLOR } from '../config';
import { AssetLoader } from './index'
import { Map } from '../models';

export default class MapLoader {
    public static load(mapNumber: number): Map {
        // Get the map texture from its atlas
        const texture = AssetLoader.getMap(mapNumber);

        // Look up the image's frame and the underlying texture
        const frame = texture.frame;
        const baseTexture = texture.baseTexture;

        // Get a reference to the source `img` tag
        const resource = baseTexture.resource as PIXI.resources.ImageResource;
        const img = resource.source as HTMLImageElement;

        // Create a new canvas context and draw the texture into it
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        context.drawImage(img, -frame.x, -frame.y);

        // Create a new Map model and populate it with the image data
        const map = new Map(frame.width, frame.height);

        for (let x = 0; x < frame.width; x++) {
            for (let y = 0; y < frame.height; y++) {
                this.addTile(x, y, context, map);
            }
        }

        return map;
    }

    private static addTile(x: number, y: number, context: CanvasRenderingContext2D, map: Map): void {
        const color = this.getColor(x, y, context);
        const tile = COLOR_MAP.get(color);

        if (tile != undefined) {
            map.setTile(x, y, tile);
        } else if (color === PLAYER_COLOR) {
            map.setStart(x, y);
        } else if (color === GOAL_COLOR) {
            map.setGoal(x, y);
        }
    }

    private static getColor(x: number, y: number, context: CanvasRenderingContext2D): number {
        const imageData = context.getImageData(x, y, 1, 1);
        const pixelValues = imageData.data;
        const color = Color.rgb(pixelValues[0], pixelValues[1], pixelValues[2]);
        return color.rgbNumber();
    }
}
