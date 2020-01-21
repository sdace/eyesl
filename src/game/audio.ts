import { AssetLoader } from './loaders';

export enum Audio {
    JUMP = 'assets/sounds/jump.wav',
    LAND = 'assets/sounds/land.wav',
    DIE = 'assets/sounds/die.wav',
    WIN = 'assets/sounds/win.wav'
}

export class AudioManager {
    public static play(url: Audio): void {
        const audio = AssetLoader.getAudio(url);
        audio.play();
    }
}
