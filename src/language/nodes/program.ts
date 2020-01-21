import Bridge from '../../game/bridge';
import Tokenizer from '../tokenizer';
import Node from './node';
import Rule from './rule';

export default class Program extends Node {
    private rules: Rule[] = [];

    constructor(tokenizer: Tokenizer) {
        super();

        while (!tokenizer.done()) {
            const rule = new Rule(tokenizer);
            this.rules.push(rule);
        }
    }

    public validate(): void {
        if (this.rules.length === 0) {
            this.warn(`You haven't defined any rules!`);
        } else {
            this.rules.forEach((rule) => rule.validate());
        }
    }

    public evaluate(bridge: Bridge): void {
        this.rules.forEach((rule) => rule.evaluate(bridge));
    }
}
