import * as PIXI from 'pixi.js';
import { TEXTURE_ATLAS, MAP_ATLAS } from '../config';
import { Audio } from '../audio';

export default class AssetLoader {
    private static maps: PIXI.ITextureDictionary;
    private static tiles: PIXI.ITextureDictionary;
    private static audio: Map<string, HTMLAudioElement>;

    public static load(loader: PIXI.Loader): Promise<void> {
        return new Promise((resolve): void => {
            // Queue all of the required data
            this.queueResources(loader);

            // Start loading the queued resources
            loader.load((_, resources) => {
                // Extract the texture dictionaries from the atlases
                const tiles = resources[TEXTURE_ATLAS] as PIXI.LoaderResource;
                this.tiles = tiles.textures as PIXI.ITextureDictionary;

                const maps = resources[MAP_ATLAS] as PIXI.LoaderResource;
                this.maps = maps.textures as PIXI.ITextureDictionary;

                // Store each sound file individually
                this.audio = new Map();
                Object.values(Audio).forEach((url) => {
                    const audio = resources[url] as PIXI.LoaderResource;
                    this.audio.set(url, audio.data);
                });

                // Settle this `load` Promise
                resolve();
            });
        });
    }

    private static queueResources(loader: PIXI.Loader): void {
        // Queue the texture atlases
        loader.add(MAP_ATLAS);
        loader.add(TEXTURE_ATLAS);
        
        // Queue each sound file individually
        Object.values(Audio).forEach((url) => loader.add(url));
    }
    
    public static getMap(mapNumber: number): PIXI.Texture {
        return this.maps[`${mapNumber}.png`];
    }

    public static getTile(tileName: string): PIXI.Texture {
        return this.tiles[`${tileName}.png`];
    }

    public static getAudio(url: Audio): HTMLAudioElement {
        return this.audio.get(url) as HTMLAudioElement;
    }
}
