import { Event, EventBus } from './utils/events';

// Import our critical dependencies
import Game from './game';
import Editor from './editor';
import Toolbar from './toolbar';
import Language from './language';

// Import the application's styles
import './index.scss';

// Get references to the root elements that we'll mount everything onto
const gameEl = document.getElementById("game") as HTMLElement;
const editorEl = document.getElementById("editor") as HTMLElement;
const toolbarEl = document.getElementById("toolbar") as HTMLElement;

// Instantiate the core UI elements
const game = new Game(gameEl);
const editor = new Editor(editorEl, game);
const toolbar = new Toolbar(toolbarEl);

// Dispatch the initial state
EventBus.dispatch(Event.GAME_STOPPED);

// When the play button is clicked, parse the user's program and start the game
EventBus.subscribe(Event.PLAY_CLICKED, () => {
    try {
        const program = Language.parse(editor.value);
        program.validate();
        game.play(program);
    } catch (e) {
        EventBus.dispatch(Event.LANGUAGE_ERROR, e.message);
    }
});

// When the stop button is clicked, stop the game
EventBus.subscribe(Event.STOP_CLICKED, () => {
    game.stop();
});
