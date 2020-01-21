import { TileType } from '../../game/models';
import Tokenizer from '../tokenizer';
import Node from './node';
import Type from './type';

interface Check {
    num: number;
    type: Type;
}

export default class PartialCheck extends Node {
    private checks: Check[] = [];

    constructor(tokenizer: Tokenizer) {
        super();

        tokenizer.expect('has');

        do {
            const num = parseInt(tokenizer.pop());
            const type = new Type(tokenizer);
            this.checks.push({ num, type });

            // Partial checks might be followed by separate conditions, so we
            // have to make sure this isn't before we try to parse the next
            // check.
        } while (tokenizer.peekAt(1) !== '(' &&
                 tokenizer.accept('and'));
    }

    public validate(numTiles: number): void {
        const totalTiles = this.checks.reduce((total, check) => total + check.num, 0);
        if (totalTiles > numTiles) {
            this.warn(`Area condition checks for ${totalTiles} tiles, but the bounding box only spans ${numTiles}!`);
        }

        this.checks.forEach((check) => check.type.validate());
    }

    public evaluate(tileTypes: TileType[]): boolean {
        return this.checks.every((check) => {
            // Make sure `tileTypes` contains at least `num` instances of the
            // expected tile type.
            const num = check.num;
            const expectedTileType = check.type.evaluate();
            return tileTypes.filter((tileType) => tileType === expectedTileType).length >= num;
        });
    }
}
