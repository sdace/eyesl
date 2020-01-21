import { Event, EventBus } from '../utils/events';
import playIcon from '../assets/icons/play.svg';
import stopIcon from '../assets/icons/stop.svg';

function createElement(classes: string, tag = 'div'): HTMLElement {
    const el = document.createElement(tag);
    el.setAttribute('class', classes);
    return el;
}

function createButton(icon: string, color: string): HTMLElement {
    const classes = `toolbar--button toolbar--button__${color}`;

    const el = createElement(classes);
    el.innerHTML = icon;

    return el;
}

export default class Toolbar {
    private playButton: HTMLElement;
    private stopButton: HTMLElement;
    private levelDropdown: HTMLSelectElement;

    private errorsEl: HTMLElement;
    private warningsEl: HTMLElement;

    constructor(root: HTMLElement) {
        // Create a container for the two buttons
        const buttonsEl = createElement('toolbar--buttons');
        root.appendChild(buttonsEl);
        
        // Create the two buttons
        this.playButton = createButton(playIcon, 'green');
        this.stopButton = createButton(stopIcon, 'red');
        this.playButton.addEventListener('click', this.onPlayClicked.bind(this));
        this.stopButton.addEventListener('click', this.onStopClicked.bind(this));
        buttonsEl.appendChild(this.playButton);
        buttonsEl.appendChild(this.stopButton);

        // Create the level dropdown
        this.levelDropdown = createElement('toolbar--dropdown', 'select') as HTMLSelectElement;
        this.levelDropdown.addEventListener('change', this.onLevelChanged.bind(this));
        root.appendChild(this.levelDropdown);

        // Create a container for language output
        const outputEl = createElement('toolbar--output');
        root.appendChild(outputEl);

        // Create two containers for errors/warnings
        this.errorsEl = createElement('toolbar--output__errors');
        this.warningsEl = createElement('toolbar--output__warnings');
        outputEl.appendChild(this.errorsEl);
        outputEl.appendChild(this.warningsEl);

        // Hook up events
        EventBus.subscribe(Event.PLAY_CLICKED, this.clearLanguageOutput.bind(this));
        EventBus.subscribe(Event.LEVEL_LOADED, this.onLevelLoaded.bind(this));
        EventBus.subscribe(Event.GAME_STARTED, this.onGameStarted.bind(this));
        EventBus.subscribe(Event.GAME_STOPPED, this.onGameStopped.bind(this));
        EventBus.subscribe(Event.LANGUAGE_ERROR, this.onLanguageError.bind(this));
        EventBus.subscribe(Event.LANGUAGE_WARNING, this.onLanguageWarning.bind(this));
    }

    clearLanguageOutput(): void {
        this.errorsEl.innerHTML = '';
        this.warningsEl.innerHTML = '';
    }

    onLevelChanged(): void {
        const level = parseInt(this.levelDropdown.value);
        EventBus.dispatch(Event.LEVEL_SELECTED, level);
    }

    onLevelLoaded(currentLevel: number, maximumLevel: number): void {
        this.levelDropdown.innerHTML = '';

        for (let i = 1; i <= maximumLevel; i++) {
            const selected = i === currentLevel ? ' selected' : '';
            this.levelDropdown.innerHTML += `<option${selected} value="${i}">Level ${i}</option>`;
        }
    }

    onPlayClicked(): void {
        EventBus.dispatch(Event.PLAY_CLICKED);
    }

    onStopClicked(): void {
        EventBus.dispatch(Event.STOP_CLICKED);
    }

    onGameStarted(): void {
        this.playButton.setAttribute('disabled', '');
        this.stopButton.removeAttribute('disabled');
    }

    onGameStopped(): void {
        this.playButton.removeAttribute('disabled');
        this.stopButton.setAttribute('disabled', '');
    }

    onLanguageError(message: string): void {
        this.errorsEl.innerHTML += `<span>Error: ${message}</span>`;
    }

    onLanguageWarning(message: string): void {
        this.warningsEl.innerHTML += `<span>Warning: ${message}</span>`;
    }
}
