import Bridge from '../../game/bridge';
import Tokenizer from '../tokenizer';
import Node from './node';
import JumpAction from './jump-action';
import TurnAction from './turn-action';

export default class Action extends Node {
    private action: Node;

    constructor(tokenizer: Tokenizer) {
        super();

        const action = tokenizer.peek();
        switch (action) {
            case "jump":
                this.action = new JumpAction(tokenizer);
                break;
            case "turn":
                this.action = new TurnAction(tokenizer);
                break;
            default:
                throw new Error('Unknown action "' + action + '".');
        }
    }

    public validate(): void {
        this.action.validate();
    }

    public evaluate(bridge: Bridge): void {
        this.action.evaluate(bridge);
    }
}
