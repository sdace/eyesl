import Bridge from '../../game/bridge';
import Tokenizer from '../tokenizer';
import Node from './node';

export default class TurnAction extends Node {
    constructor(tokenizer: Tokenizer) {
        super();

        tokenizer.expect('turn');
    }

    public validate(): void {
        // Do nothing.
    }

    public evaluate(bridge: Bridge): void {
        bridge.turn();
    }
}
