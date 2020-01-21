import * as Monaco from 'monaco-editor';
import { PLACEHOLDER_TEXT } from './config';
import { DataType, DataStorage } from '../utils/data';
import { EventBus, Event } from '../utils/events';
import Game from 'src/game';

// A simple debounce utility
function debounce(fn: () => void, delay = 250) {
    let tid: any;
    return () => {
        clearTimeout(tid);
        tid = setTimeout(() => fn(), delay);
    };
}

export default class Editor {
    private monaco: Monaco.editor.IStandaloneCodeEditor;
    private game: Game;

    constructor(root: HTMLElement, game: Game) {
        this.game = game;

        // Mount a new Monaco instance on the root element
        this.monaco = Monaco.editor.create(root, {
            language: 'javascript',
            minimap: {
                enabled: false
            },
            theme: 'vs-dark',
            value: DataStorage.loadSolution(this.game.currentLevel, PLACEHOLDER_TEXT)
        });

        // When the editor text is changed, save it to local storage
        this.monaco.onDidChangeModelContent(debounce(() => {
            DataStorage.saveSolution(this.game.currentLevel, this.value);
        }));

        // When the user hits Ctrl+Enter, run the program
        this.monaco.addAction({
            id: 'run-program',
            label: 'Run Program',
            keybindings: [
                Monaco.KeyMod.CtrlCmd | Monaco.KeyCode.Enter
            ],
            run: () => {
                EventBus.dispatch(Event.STOP_CLICKED);
                EventBus.dispatch(Event.PLAY_CLICKED);
            }
        });

        // When the window resizes, re-layout the editor
        window.addEventListener('resize', debounce(() => {
            this.monaco.layout();
        }));

        EventBus.subscribe(Event.LEVEL_LOADED, this.levelChangedHandler.bind(this));
    }

    private levelChangedHandler() {
        const editorText = DataStorage.loadSolution(this.game.currentLevel, "// Your solution goes here.");
        this.monaco.setValue(editorText);
    }

    get value(): string {
        return this.monaco.getValue();
    }
}
