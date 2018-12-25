import {Scheduler, Observable, interval, timer, fromEvent} from 'rxjs';
import {repeat, takeWhile, map, pluck, filter, throttleTime} from 'rxjs/operators';
import Ship from './Ship';
import Ball from './Ball';
import now from './../helpers/now';
import bricksArr from './../fixtures/bricks';

class Game {

  constructor(draw) {
    this.ship = new Ship();
    this.ball = new Ball();
    this.draw = draw || (() => {});
    this.isStarted = false;
    this.isPaused = false;
    this.level = 1;
    this.score = 0;
    this.bricks = bricksArr[this.level - 1];

    this.init();

    this.startedTime = 0;
    this.pausedTime = 0;
  }

  startAnimation() {
    this.animation$ = interval(0, Scheduler.animationFrame)
      .subscribe(() => this.draw(this));
  }

  start() {
    this.isStarted = true;
    this.startedTime = now();
  }

  getDuration() {
    if (this.startedTime !== 0) {
      return now() - this.startedTime;
    }
    return 0;
  }

  init() {

    this.startAnimation();

    this.mousedown$ = fromEvent(document, 'keydown')
      .pipe(throttleTime(10), pluck('key'));

    this.esc$ = this.mousedown$.pipe(filter(key => key === 'Escape'))
      .subscribe(() => {
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
    this.startAnimation();
  }

  pause() {
    this.pausedTime = now();
    this.isPaused = true;
    this.animation$.unsubscribe();
  }

  clearBricks(indices) {
    indices.forEach(i => {
      this.bricks.splice(i, 1)
      this.score += 40;
    });
  }
}

export default Game;
