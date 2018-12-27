import {Scheduler, Observable, interval, timer, fromEvent} from 'rxjs';
import {repeat, takeWhile, map, pluck, filter, throttleTime} from 'rxjs/operators';
import Ship from './Ship';
import Ball from './Ball';
import Pill from './Pill';
import now from './../helpers/now';
import bricksArr from './../fixtures/bricks';
import shuffle from './../helpers/shuffle';

import {
  EFFECT_SHIP_WIDEN,
  EFFECT_SHIP_SHRINK,
  EFFECT_BALL_ENLARGE,
  EFFECT_BALL_SHRINK,
  EFFECT_BALL_THROUGH,
  EFFECT_FAST_SPEED,
  EFFECT_SLOW_SPEED
} from './../constants';

class Game {

  constructor(draw) {
    this.draw = draw || (() => {});

    this.hasWon = false;
    this.hasLost = false;
    this.isStarted = false;
    this.isPaused = false;

    this.level = 1;
    this.score = 0;
    this.startedTime = 0;
    this.pausedTime = 0;
    this.wonTime = 0;
    this.effectStartedAt = 0;
    this.effect = null;

    this.ship = new Ship();
    this.ball = new Ball();

    this.setBricks();

    this.pills = [];

    this.init();
  }

  setBricks() {
    this.bricks = bricksArr[this.level - 1].slice();
    const breakableBricks = this.bricks.filter(brick => brick.isBreakable);
    const indices = Array.from({length: breakableBricks.length}, (_, i) => i);

    // make 5% of bricks to contain pills
    const length = Math.ceil(breakableBricks.length * 0.05, 10);
    const shuffledIndices = shuffle(indices);
    shuffledIndices.length = length;
    this.bricks = this.bricks.map((brick, index) => {
      if (shuffledIndices.includes(index)) {
        brick.hasPill = true;
      }
      return brick;
    });
  }

  start() {
    this.isStarted = true;
    this.startedTime = now();
  }

  getDuration() {
    if (this.hasLost) {
      return this.lostTime - this.startedTime;
    }
    if (this.hasWon) {
      return this.wonTime - this.startedTime;
    }
    if (this.isPaused) {
      return this.pausedTime - this.startedTime;
    }
    if (this.startedTime !== 0) {
      return now() - this.startedTime;
    }
    return 0;
  }

  init() {

    this.animation$ = interval(0, Scheduler.animationFrame)
      .subscribe(() => this.draw(this));

    this.mousedown$ = fromEvent(document, 'keydown')
      .pipe(throttleTime(10), pluck('key'));

    this.esc$ = this.mousedown$.pipe(filter(key => key === 'Escape'))
      .subscribe(() => {
        if (this.hasWon) {
          return;
        }
        if (! this.isStarted) {
          return;
        }
        return this.isPaused ? this.resume() : this.pause();
      });

    this.space$ = this.mousedown$.pipe(filter(key => key === ' '))
      .subscribe(() => {
        if (! this.isStarted) {
          this.start();
          this.ship.release()
        }
      });

    this.left$ = this.mousedown$.pipe(filter(key => key === 'ArrowLeft'))
      .subscribe(() => {
        if (this.isPaused) {
          return;
        }
        const {ship} = this;
        ship.goLeft();

        if (ship.power < 0) {
          ship.power = 0;
        }
        ship.power += 4;
        ship.power = Math.min(ship.power, 30);
      });

    this.right$ = this.mousedown$.pipe(filter(key => key === 'ArrowRight'))
      .subscribe(() => {
        if (this.isPaused) {
          return;
        }
        const {ship} = this;
        ship.goRight();

        if (ship.power > 0) {
          ship.power = 0;
        }
        ship.power -= 4;
        ship.power = Math.max(ship.power, -30);
      });
  }

  resume() {
    const delta = now() - this.pausedTime;
    this.startedTime += delta;
    this.pausedTime = 0;

    this.isPaused = false;
  }

  pause() {
    this.pausedTime = now();
    this.isPaused = true;
  }

  win() {
    this.hasWon = true;
    this.wonTime = now();
  }

  clearBricks(indices) {

    indices.forEach(i => {
      const brick = this.bricks[i];

      if (brick.isBreakable) {
        this.bricks.splice(i, 1)
        this.score += 40;

        if (brick.hasPill) {
          const {x, y} = brick;
          this.pills.push(new Pill(x, y + (brick.height / 2)));
        }
      }
    });
  }

  check(canvasHeight) {
    if (this.hasWon || this.hasLost) {
      return;
    }
    if (this.ball.pos.y > (canvasHeight + 20)) {
      return this.lose();
    }
    const bricksRemain = this.bricks.filter(brick => brick.isBreakable).length;
    if (bricksRemain === 0) {
      this.win();
    }
  }

  lose() {
    this.hasLost = true;
    this.lostTime = now();
  }

  hasNextLevel() {
    return typeof bricksArr[this.level] !== 'undefined';
  }

  toNextLevel() {
    this.isStarted = false;
    this.hasWon = false;
    this.startedTime = 0;
    this.wonTime = 0;
    this.level += 1;
    this.setBricks();
  }

  reset() {
    this.score = 0;
    this.isStarted = false;
    this.hasWon = false;
    this.hasLost = false;
    this.startedTime = 0;
    this.wonTime = 0;
    this.lostTime = 0;
    this.level = 1;
    this.ship.isBallSticked = true;
    this.pills.length = 0;
    this.setBricks();
  }

  clearEffect() {
    this.effect = null;
    this.effectStartedAt = 0;
    this.ship.restoreToDefaultWidth();
    this.ball.restoreToDefaultRadius();
  }

  clearEffectIfNeeded() {
    if ((now() - this.effectStartedAt) > 15) {
      this.clearEffect();
    }
  }

  applyPillEffect() {

    this.clearEffect();

    const effects = [
      EFFECT_SHIP_WIDEN,
      EFFECT_SHIP_SHRINK,
      EFFECT_BALL_ENLARGE,
      EFFECT_BALL_SHRINK,
      EFFECT_BALL_THROUGH,
      EFFECT_FAST_SPEED,
      EFFECT_SLOW_SPEED
    ];

    this.effect = shuffle(effects)[0];
    this.effectStartedAt = now();

    if (this.effect === EFFECT_SHIP_WIDEN) {
      this.ship.width = this.ship.width * 2.5;
    }
    if (this.effect === EFFECT_SHIP_SHRINK) {
      this.ship.width = this.ship.width * 0.5;
    }
    if (this.effect === EFFECT_BALL_ENLARGE) {
      this.ball.radius = this.ball.radius * 1.5;
    }
    if (this.effect === EFFECT_BALL_SHRINK) {
      this.ball.radius = this.ball.radius * 0.5;
    }
  }
}

export default Game;
