interface EventBinding {
    event: Event;
    handler: Function;
}

export enum Event {
    PLAY_CLICKED,
    STOP_CLICKED,

    GAME_STARTED,
    GAME_STOPPED,

    PLAYER_WON,
    PLAYER_KILLED,

    LANGUAGE_ERROR,
    LANGUAGE_WARNING,
    
    LEVEL_LOADED,
    LEVEL_SELECTED
}

export class EventBus {
    private static listeners: EventBinding[] = [];

    public static subscribe(event: Event, handler: Function): void {
        this.listeners.push({ event, handler });
    }

    public static dispatch(event: Event, ...args: any[]): void {
        this.listeners
            .filter((binding) => binding.event === event)
            .map((binding) => binding.handler(...args));
    }
}
