import Bridge from '../../game/bridge';
import Node from './node';
import AreaCondition from './area-condition';
import PointCondition from './point-condition';
import Tokenizer from '../tokenizer';

export default class Condition extends Node {
    private condition: Node;

    constructor(tokenizer: Tokenizer) {
        super();

        if (tokenizer.peekAt(5) === 'to') {
            this.condition = new AreaCondition(tokenizer);
        } else {
            this.condition = new PointCondition(tokenizer);
        }
    }

    public validate(): void {
        this.condition.validate();
    }

    public evaluate(bridge: Bridge): boolean {
        return this.condition.evaluate(bridge);
    }
}
