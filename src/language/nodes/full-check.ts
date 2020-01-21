import { TileType } from '../../game/models';
import Tokenizer from '../tokenizer';
import Node from './node';
import Type from './type';

export default class FullCheck extends Node {
    private type: Type;

    constructor(tokenizer: Tokenizer) {
        super();

        tokenizer.expect('is');
        this.type = new Type(tokenizer);
    }

    public validate(): void {
        this.type.validate();
    }

    public evaluate(tileTypes: TileType[]): boolean {
        const expectedTileType = this.type.evaluate();
        return tileTypes.every((tileType) => tileType === expectedTileType);
    }
}
