import Bridge from '../../game/bridge';
import Tokenizer from '../tokenizer';
import Node from './node';
import Offset from './offset';
import FullCheck from './full-check';

export default class PointCondition extends Node {
    private offset: Offset;
    private fullCheck: FullCheck;

    constructor(tokenizer: Tokenizer) {
        super();

        this.offset = new Offset(tokenizer);
        this.fullCheck = new FullCheck(tokenizer);
    }

    public validate(): void {
        this.offset.validate();
        this.fullCheck.validate();
    }

    public evaluate(bridge: Bridge): boolean {
        const offset = this.offset.evaluate();
        const tileType = bridge.getTileType(offset);
        return this.fullCheck.evaluate([ tileType ]);
    }
}
