import { WARNING_NUM_CONDITIONS, WARNING_NUM_ACTIONS } from '../config';
import Bridge from '../../game/bridge';
import Tokenizer from '../tokenizer';
import Action from './action';
import Condition from './condition';
import Node from './node';

export default class Rule extends Node {
    private conditions: Condition[] = [];
    private actions: Action[] = [];

    constructor(tokenizer: Tokenizer) {
        super();

        tokenizer.expect('when');

        do {
            const condition = new Condition(tokenizer);
            this.conditions.push(condition);
        } while (!tokenizer.done() && tokenizer.accept('and'));

        tokenizer.expect('->');

        do {
            const action = new Action(tokenizer);
            this.actions.push(action);
        } while (!tokenizer.done() && tokenizer.accept('and'));
    }

    public validate(): void {
        this.conditions.forEach((condition) => condition.validate());
        if (this.conditions.length >= WARNING_NUM_CONDITIONS) {
            this.warn('Complex conditions may hurt performance!');
        }

        this.actions.forEach((action) => action.validate());
        if (this.actions.length >= WARNING_NUM_ACTIONS) {
            this.warn('Compound actions are executed on the same frame. The player might behave strangely.');
        }
    }

    public evaluate(bridge: Bridge): void {
        const conditionsSatisfied = this.conditions.every((condition) => condition.evaluate(bridge));

        if (conditionsSatisfied) {
            this.actions.forEach((action) => {
                action.evaluate(bridge);
            });
        }
    }
}
