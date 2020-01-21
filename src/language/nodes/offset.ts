import { Coordinate } from '../../game/models';
import Tokenizer from '../tokenizer';
import Node from './node';

export default class Offset extends Node {
    public x: number;
    public y: number;

    constructor(tokenizer: Tokenizer) {
        super();

        tokenizer.expect('(');
        const x = tokenizer.pop();
        tokenizer.expect(',');
        const y = tokenizer.pop();
        tokenizer.expect(')');

        // Parse both coordinates as floats; if this fails, they'll be NaN
        this.x = parseFloat(x);
        this.y = parseFloat(y);

        if (isNaN(this.x)) {
            throw new Error(`Invalid offset coordinate "${x}".`);
        }

        if (isNaN(this.y)) {
            throw new Error(`Invalid offset coordinate "${y}".`);
        }
    }

    public validate(): void {
        // Do nothing.
    }

    public evaluate(): Coordinate {
        return { x: this.x, y: this.y };
    }
}
