import Bridge from '../../game/bridge';
import Tokenizer from '../tokenizer';
import Node from './node';
import Offset from './offset';
import FullCheck from './full-check';
import PartialCheck from './partial-check';

export default class AreaCondition extends Node {
    private startOffset: Offset;
    private endOffset: Offset;
    private check: Node;

    constructor(tokenizer: Tokenizer) {
        super();

        this.startOffset = new Offset(tokenizer);
        tokenizer.expect('to');
        this.endOffset = new Offset(tokenizer);

        if (tokenizer.peek() === 'is') {
            this.check = new FullCheck(tokenizer);
        } else {
            this.check = new PartialCheck(tokenizer);
        }
    }

    public validate(): void {
        // Count how many tiles we're checking
        const deltaX = Math.ceil(Math.abs(this.endOffset.x - this.startOffset.x) + 1);
        const deltaY = Math.ceil(Math.abs(this.endOffset.y - this.startOffset.y) + 1);
        const numTiles = deltaX * deltaY;

        this.startOffset.validate();
        this.endOffset.validate();
        this.check.validate(numTiles);
    }

    public evaluate(bridge: Bridge): boolean {
        const startOffset = this.startOffset.evaluate();
        const endOffset = this.endOffset.evaluate();
        const tileTypes = bridge.getTileTypes(startOffset, endOffset);
        return this.check.evaluate(tileTypes);
    }
}
