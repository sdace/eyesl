import { EventBus, Event } from '../../utils/events';

export default abstract class Node {
    public abstract validate(param?: any): void;
    public abstract evaluate(param?: any): any;

    protected warn(message: string): void {
        EventBus.dispatch(Event.LANGUAGE_WARNING, message);
    }
}
