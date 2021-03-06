import isEqual from 'lodash.isequal';
import {PIXEL_RATIO} from './constants';
import createHiDpiCanvas from './helpers/createHiDpiCanvas';
import Game from './models/Game';
import Rect from './models/Rect';
import Painter from './models/Painter';
import now from './helpers/now';
import randomColor from './helpers/randomColor';
import detectRectCollision from './helpers/detectRectCollision';
import {
  EFFECT_BALL_THROUGH,
  EFFECT_FAST_SPEED,
  EFFECT_SLOW_SPEED
} from './constants';

require('normalize.css/normalize.css');
require('../assets/scss/index.scss');

const canvas = createHiDpiCanvas(document.getElementById('canvas'), 400, 500, PIXEL_RATIO);
const canvasWidth = canvas.width / PIXEL_RATIO;
const canvasHeight = canvas.height / PIXEL_RATIO;
const ctx = canvas.getContext('2d');

const painter = new Painter(ctx);

let lastCollisions = null;

const draw = game => {

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  const {ship, ball} = game;
  ship.setCanvasSize(canvasWidth, canvasHeight);
  const shipRect = ship.getRect();


  if (ship.isBallSticked) {
    ball.setPos(shipRect.x + parseInt(shipRect.width / 2), shipRect.y - ball.radius);
  }

  if ((! ship.isBallSticked) && (! game.isPaused) && (! game.hasWon) && (! game.hasLost)) {
    ball.setNextPos();
  }

  const items = [
    new Rect({x: 0, y: -1, width: canvasWidth, height: 1}),
    new Rect({x: -1, y: 0, width: 1, height: canvasHeight}),

    // uncomment this for debug purpose
    // new Rect({x: 0, y: canvasHeight, width: canvasWidth, height: 1}),

    new Rect({x: canvasWidth, y: 0, width: 1, height: canvasHeight}),
  ];


  let collisions = items.map(item => detectRectCollision(ball, item))
    .filter(item => item);

  const shipCollision = detectRectCollision(ball, shipRect);

  if (shipCollision) {
    collisions.push(shipCollision);
  }

  const brickCollisionIndices = [];
  const brickCollisions = game.bricks.map(brick => detectRectCollision(ball, brick))
    .filter((brick, i) => {
      if (brick) {
        brickCollisionIndices.push(i);
      }
      return brick;
    });

  game.clearBricks(brickCollisionIndices);

  if ((brickCollisions.length > 0) && (game.effect !== EFFECT_BALL_THROUGH)) {
    collisions = collisions.concat(brickCollisions);
  }

  if (collisions.length > 0 && (! isEqual(collisions, lastCollisions))) {
    ball.setDegreeByCollisions(collisions);

    if (shipCollision === 'BOTTOM') {
      let newDegree = ball.degree + ship.power;

      if (newDegree < 30) {
        newDegree = 30;
      }
      if (newDegree > 150) {
        newDegree = 150;
      }
      ball.setDegree(newDegree);
      ship.power = 0;
    }
    lastCollisions = collisions;
  }

  painter.fillRect(shipRect);

  game.bricks.forEach(brick => {
    painter.fillRect(brick, brick.color);
    painter.rect(brick);
  });

  game.pills.forEach((pill, index) => {
    if ((! game.isPaused) && (! game.hasWon) && (! game.hasLost)) {
      pill.setNextPos();
    }
    painter.drawPill(pill.pos.x, pill.pos.y, pill.width, pill.height, randomColor());
  });

  game.pills.forEach((pill, index) => {
    // dropped outside
    if (pill.pos.y > (canvasHeight + 30)) {
      game.pills.splice(index, 1);
    }
    // eaten by ship
    const eaten = detectRectCollision(pill, shipRect);

    if (eaten) {
      game.pills.splice(index, 1);
      game.applyPillEffect();
    }
  });

  game.clearEffectIfNeeded();

  painter.drawCircle(ball.pos.x, ball.pos.y, ball.radius);

  painter.showScore(game.score, canvasWidth - 10, 20);

  painter.showLevel(game.level, canvasWidth / 2, 20);

  painter.showTime(game.getDuration(), 10, 20);

  game.check(canvasHeight);

  if (game.hasWon) {

      if (game.hasNextLevel()) {
        painter.showGameTip(`level ${game.level} cleared`, canvasWidth / 2, canvasHeight / 2 + 40);
        if ((now() - game.wonTime) > 2) {
          game.toNextLevel();
        }
      }
      else {
        painter.showGameTip('all level cleared !', canvasWidth / 2, canvasHeight / 2 + 40);
        painter.showGameTip('thanks for playing !', canvasWidth / 2, canvasHeight / 2 + 60);
      }
  }
  else if (game.hasLost) {
    painter.showGameTip('you lost', canvasWidth / 2, canvasHeight / 2 + 40);
    if ((now() - game.lostTime) > 2) {
      game.reset();
    }
  }

  if (! game.isStarted) {
    if (now() % 2 !== 0) {
      painter.showGameTip('press space key to start', canvasWidth / 2, canvasHeight / 2 + 40);
    }
  }

  if (game.isPaused) {
    if (now() % 2 !== 0) {
      painter.showGameTip('press esc key to resume', canvasWidth / 2, canvasHeight / 2 + 40);
    }
  }
};

const game = new Game((game) => {

  if (game.effect === EFFECT_SLOW_SPEED) {
    if (+new Date() % 3 === 0) {
      draw(game);
    }
    return;
  }

  draw(game);

  if (game.effect === EFFECT_FAST_SPEED) {
    if (+new Date() % 2 === 0) {
      draw(game);
    }
  }
});
