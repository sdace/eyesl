import * as PIXI from 'pixi.js';
import { GAME_SCALE, GAME_WIDTH, GAME_HEIGHT } from './config';
import { Grid, Level, Player } from './objects';
import { AssetLoader, MapLoader } from './loaders';
import { EventBus, Event } from '../utils/events';
import { DataType, DataStorage } from '../utils/data';

import Program from '../language/nodes/program';

// Set the global scale mode for PixiJS
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

export default class Game {
    private app: PIXI.Application;
    private grid: Grid;
    private level: Level | undefined;
    private player: Player | undefined;

    private playing = false;

    // Load the current/maximum levels from storage
    public currentLevel = parseInt(DataStorage.load(DataType.CURRENT_LEVEL, '1'));
    private maximumLevel = parseInt(DataStorage.load(DataType.MAXIMUM_LEVEL, '1'));

    constructor(root: HTMLElement) {
        // Create the PixiJS application and add it to the root HTML node
        this.app = new PIXI.Application({ backgroundColor: 0x004058, width: GAME_WIDTH, height: GAME_HEIGHT });
        this.app.stage.scale.set(GAME_SCALE, GAME_SCALE);
        root.appendChild(this.app.view);

        // Create the grid overlay
        this.grid = new Grid(this.app.renderer);
        this.app.stage.addChild(this.grid);

        // Load all of the required assets, then load the current level
        AssetLoader.load(this.app.loader).then(() => {
            this.loadLevel(this.currentLevel);
        });

        // Start updating on each tick
        this.app.ticker.add(() => {
            this.update();
        });

        // When the player wins or is killed, stop the game
        EventBus.subscribe(Event.PLAYER_WON, () => this.loadLevel(this.currentLevel + 1));
        EventBus.subscribe(Event.PLAYER_KILLED, this.stop.bind(this));

        // When a level is selected, load it
        EventBus.subscribe(Event.LEVEL_SELECTED, this.loadLevel.bind(this));
    }

    public play(program: Program): void {
        if (this.player !== undefined) {
            // Pass the new program to the player
            this.player.setProgram(program);
        }

        this.playing = true;
        EventBus.dispatch(Event.GAME_STARTED);
    }

    public stop(): void {
        this.playing = false;
        EventBus.dispatch(Event.GAME_STOPPED);
    }

    private loadLevel(mapNumber: number): void {
        this.stop();

        // Clear any currently-loaded level
        if (this.level != undefined) {
            this.app.stage.removeChildren(0, 2);
        }

        // Record the current level and update the maximum level loaded
        this.currentLevel = mapNumber;
        this.maximumLevel = Math.max(mapNumber, this.maximumLevel);
        DataStorage.save(DataType.CURRENT_LEVEL, this.currentLevel.toString());
        DataStorage.save(DataType.MAXIMUM_LEVEL, this.maximumLevel.toString());

        // Parse the corresponding map data
        const map = MapLoader.load(mapNumber);

        // Add the Level to the stage
        this.level = new Level(map);
        this.app.stage.addChildAt(this.level, 0);

        // Add the Player to the stage
        this.player = new Player(map);
        this.app.stage.addChildAt(this.player, 1);

        // Inform other components that we've loaded this level
        EventBus.dispatch(Event.LEVEL_LOADED, this.currentLevel, this.maximumLevel);
    }

    private update(): void {
        if (this.playing && this.player !== undefined) {
            this.player.update();
        }
    }
}
