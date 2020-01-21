import { TileType } from '../../game/models/tile';
import Node from './node';
import Tokenizer from '../tokenizer';

export default class Type extends Node {
    private tileType: TileType;

    constructor(tokenizer: Tokenizer) {
        super();

        const type = tokenizer.pop();
        switch (type) {
            case 'SOLID':
                this.tileType = TileType.SOLID;
                break;
            case 'EMPTY':
                this.tileType = TileType.EMPTY;
                break;
            case 'SPIKE':
                this.tileType = TileType.SPIKE;
                break;
            default:
                throw new Error(`Unknown tile type "${type}".`);
        }
    }

    public validate(): void {
        // Do nothing.
    }

    public evaluate(): TileType {
        return this.tileType;
    }
}
