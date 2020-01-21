import { MOVE_SPEED, GRAVITY, TILE_SIZE, JUMP_FORCE, MAX_JUMP_HEIGHT, GAME_HEIGHT, ARC_TIME, MAX_JUMP_DISTANCE } from "../config";
import * as PIXI from 'pixi.js';
import { AssetLoader } from '../loaders';
import { Coordinate, Map, TileType } from '../models';
import { EventBus, Event } from "../../utils/events";
import { AudioManager, Audio } from '../audio';
import Bridge from '../bridge';
import Program from '../../language/nodes/program';

export enum FacingDirection {
    LEFT = -1,
    RIGHT = 1
}

enum Axis {
    HORIZONTAL,
    VERTICAL
}

enum State {
    PLAYING,
    DEAD,
    CLEARED
}

export default class Player extends PIXI.Sprite {
    private dx = 0;
    private dy = 0;
    private onGround = true;
    private state: State = State.PLAYING;
    public facing: FacingDirection = FacingDirection.RIGHT;

    private map: Map;
    private bridge: Bridge;
    private program: Program | undefined;

    constructor(map: Map) {
        super();

        // Store the Map and create a new Bridge interface for the player's programs
        this.map = map;
        this.bridge = new Bridge(map, this);

        // Set up this Sprite's properties
        this.texture = AssetLoader.getTile('player');
        this.anchor.set(0.5, 0.5);
        this.reset();

        EventBus.subscribe(Event.GAME_STOPPED, () => this.reset());
    }

    public reset(): void {
        const start: Coordinate = this.map.getStart();
        const startX = (start.x * TILE_SIZE) + this.width / 2;
        const startY = (start.y * TILE_SIZE) + this.height / 2;
        this.position.set(startX, startY);
        this.dx = 0;
        this.dy = 0;
        this.facing = FacingDirection.RIGHT;
        this.onGround = true;
        this.state = State.PLAYING;

        this.draw();
    }

    public update(): void {
        switch (this.state) {
            case State.PLAYING:
                // Calculate how much we should move on this frame
                this.calculateMovement();

                // Evaluate the program
                if (this.program !== undefined) {
                    this.program.evaluate(this.bridge);
                }

                // Adjust velocity to account for solid tiles, while checking for other overlapping tiles
                const overlappingTile = this.collide();

                this.move();
                this.draw();

                if (overlappingTile === TileType.SPIKE) {
                    this.kill();
                }
                else if (this.map.isTouchingGoal(this.x, this.y)) {
                    this.levelClear();
                }
                break;

            case State.DEAD:
                this.calculateMovement();
                this.move();
                this.draw();
                break;

            case State.CLEARED:
                break;

            default:
                break;
        }

        // Kill player if he reaches the bottom of the screen
        if (this.y > GAME_HEIGHT) {
            EventBus.dispatch(Event.PLAYER_KILLED);
        }
    }

    public setProgram(program: Program): void {
        this.program = program;
    }

    private calculateMovement(): void {
        if (this.state != State.DEAD && this.onGround) {
            this.dx = MOVE_SPEED * this.facing;
        }

        this.dy += GRAVITY;
    }

    private collide(): TileType {
        const halfWidth = this.width / 2;
        const halfHeight = this.height / 2;

        const dx = this.calculateCollision(this.x, this.y, halfWidth, halfHeight, this.dx, Axis.HORIZONTAL);
        this.dx = dx;

        const dy = this.calculateCollision(this.y, this.x + dx, halfHeight, halfWidth, this.dy, Axis.VERTICAL);
        const onGround = ((this.dy - dy) > Number.MIN_VALUE);
        this.dy = dy;

        // Play a landing sound effect when we touch the ground
        if (!this.onGround && onGround) {
            AudioManager.play(Audio.LAND);
        }
        this.onGround = onGround;

        // Return the tile we're overlapping THE MOST at the moment
        const currentTileX = Math.floor(this.x / TILE_SIZE);
        const currentTileY = Math.floor(this.y / TILE_SIZE);
        return this.map.getTile(currentTileX, currentTileY);
    }

    private move(): void {
        this.x += this.dx;
        this.y += this.dy;
    }

    public jump(height: number, length?: number): void {
        if (this.onGround && height > 0) {
            const jumpMultiplier = Math.min(height, MAX_JUMP_HEIGHT);
            this.dy = JUMP_FORCE * Math.sqrt(jumpMultiplier);

            if (length != undefined) {
                const timeOfFlight = ARC_TIME * Math.sqrt(jumpMultiplier);
                const actualLength = Math.min(Math.max(length, -MAX_JUMP_DISTANCE), MAX_JUMP_DISTANCE);
                this.dx = ((actualLength * TILE_SIZE) / timeOfFlight) * this.facing;
            } else {
                this.dx = MOVE_SPEED * this.facing;
            }

            this.onGround = false;
            AudioManager.play(Audio.JUMP);
        }
    }

    public turn(): void {
        this.facing = this.facing * -1;
    }

    private kill(): void {
        this.dy = JUMP_FORCE;
        this.dx = -this.dx;
        this.state = State.DEAD;
        AudioManager.play(Audio.DIE);
    }

    private levelClear(): void {
        this.state = State.CLEARED;
        AudioManager.play(Audio.WIN);
        EventBus.dispatch(Event.PLAYER_WON);
    }

    // Tile collision algorithm, as described by by Rodrigo Monteiro: http://higherorderfun.com/blog/2012/05/20/the-guide-to-implementing-2d-platformers/
    private calculateCollision(centerA: number, centerB: number, halfSizeA: number, halfSizeB: number, velocity: number, axis: Axis): number {

        // We divide these by TILE_SIZE in order to get the player's coordinates in the same "resolution" as the tile array
        centerA = centerA / TILE_SIZE;
        centerB = centerB / TILE_SIZE;
        halfSizeA = halfSizeA / TILE_SIZE;
        halfSizeB = halfSizeB / TILE_SIZE;
        velocity = velocity / TILE_SIZE

        const direction = (velocity > 0) ? 1 : -1;
        if (Math.abs(velocity) < Number.MIN_VALUE) return 0;

        const forwardEdge = centerA + (halfSizeA * direction);
        const tileCollisionOffset = (direction === 1) ? 0 : 1;
        const colliderMax = Math.ceil(centerB + halfSizeB - Number.MIN_VALUE) - 1;
        const colliderMin = Math.floor(centerB - halfSizeB + Number.MIN_VALUE);
        const colliderRow = (direction === 1) ? Math.ceil(forwardEdge - Number.MIN_VALUE) - 1 : Math.floor(forwardEdge + Number.MIN_VALUE);

        let distanceToNearestTile = (direction === 1) ? Infinity : -Infinity;
        const tilesToCheck = Math.ceil(Math.abs(velocity)) + 1;
        for (let i = colliderMin; i <= colliderMax; i++) {
            for (let j = 0; j < tilesToCheck; j++) {
                const currentTile = colliderRow + direction + (j * direction);

                const solidTile = (axis == Axis.HORIZONTAL) ?
                    (this.map.getTile(currentTile, i) == TileType.SOLID) :
                    (this.map.getTile(i, currentTile) == TileType.SOLID);
                if (solidTile) {
                    const distanceToTile = (currentTile + tileCollisionOffset) - forwardEdge;
                    distanceToNearestTile = (direction == 1) ?
                        Math.min(distanceToNearestTile, distanceToTile) :
                        Math.max(distanceToNearestTile, distanceToTile);
                }
            }
        }

        const movement = (direction == 1) ?
            Math.min(velocity, distanceToNearestTile) :
            Math.max(velocity, distanceToNearestTile);

        // We multiply the results of our collisions by TILE_SIZE to go back to our world "resolution"
        return movement * TILE_SIZE;
    }

    private draw(): void {
        this.scale.x = this.facing;
        this.scale.y = (this.state == State.DEAD) ? -1 : 1;
    }
}
