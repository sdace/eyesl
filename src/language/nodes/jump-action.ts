import {MAX_JUMP_HEIGHT, MAX_JUMP_DISTANCE} from '../../game/config';
import Bridge from '../../game/bridge';
import Tokenizer from '../tokenizer';
import Node from './node';
import Offset from './offset';

export default class JumpAction extends Node {
    private height = 1;
    private offset: Offset | undefined;

    constructor(tokenizer: Tokenizer) {
        super();

        tokenizer.expect('jump');

        const next = tokenizer.peek();
        if (next === '(') {
            // Assume we're given an offset
            this.offset = new Offset(tokenizer);
        } else if (!isNaN(parseFloat(next))) {
            // Use the number as the jump height
            this.height = parseFloat(next);
            tokenizer.pop();
        }
    }

    public validate(): void {
        const jumpHeight = this.offset !== undefined ? this.offset.y : this.height;
        if (jumpHeight <= 0) {
            this.warn(`Jumping ${jumpHeight} tiles high will have no effect!`);
        } else if (jumpHeight > MAX_JUMP_HEIGHT) {
            this.warn(`The player can only jump ${MAX_JUMP_HEIGHT} tiles high. ${jumpHeight} is too high!`);
        }

        if (this.offset !== undefined) {
            this.offset.validate();

            const jumpDistance = Math.abs(this.offset.x);
            if (jumpDistance > MAX_JUMP_DISTANCE) {
                this.warn(`The player can only jump ${MAX_JUMP_DISTANCE} tiles long. ${jumpDistance} is too long!`);
            }
        }
    }

    public evaluate(bridge: Bridge): void {
        if (this.offset !== undefined) {
            const offset = this.offset.evaluate();
            bridge.jump(offset.y, offset.x);
        } else {
            bridge.jump(this.height);
        }
    }
}
