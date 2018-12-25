import {Scheduler, Observable, interval, timer, fromEvent} from 'rxjs';
import {repeat, takeWhile, map, pluck, filter, throttleTime} from 'rxjs/operators';
import Ship from './Ship';
import Ball from './Ball';
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
  }

  startAnimation() {
    this.animation$ = interval(0, Scheduler.animationFrame)
      .subscribe(() => this.draw(this));
  }

  start() {
    this.isStarted = true;
  }

  init() {

    this.startAnimation();

    this.mousedown$ = fromEvent(document, 'keydown')
      .pipe(throttleTime(10), pluck('key'));

    this.esc$ = this.mousedown$.pipe(filter(key => key === 'Escape'))
      .subscribe(() => this.isPaused ? this.resume() : this.pause());

    this.space$ = this.mousedown$.pipe(filter(key => key === ' '))
      .subscribe(() => {
        if (! this.isStarted) {
          this.isStarted = true;
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
    this.isPaused = false;
    this.startAnimation();
  }

  pause() {
    this.isPaused = true;
    this.animation$.unsubscribe();
  }
}

export default Game;
