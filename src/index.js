import isEqual from 'lodash.isequal';
import {PIXEL_RATIO} from './constants';
import createHiDpiCanvas from './helpers/createHiDpiCanvas';
import Game from './models/Game';
import Rect from './models/Rect';
import Painter from './models/Painter';
import detectRectCollision from './helpers/detectRectCollision';

require('normalize.css/normalize.css');
require('../assets/scss/index.scss');

const canvas = createHiDpiCanvas(document.getElementById('canvas'), 400, 500, PIXEL_RATIO);
const canvasWidth = canvas.width / PIXEL_RATIO;
const canvasHeight = canvas.height / PIXEL_RATIO;
const ctx = canvas.getContext('2d');

const painter = new Painter(ctx);

let lastCollisions = null;

const draw = game => {

  const {ship, ball} = game;
  ship.setCanvasSize(canvasWidth, canvasHeight);
  const shipRect = ship.getRect();

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  painter.fillRect(shipRect.x, shipRect.y, shipRect.width, shipRect.height);

  game.bricks.forEach(brick => {
    painter.fillRect(brick.x, brick.y, brick.width, brick.height, brick.color);
    painter.rect(brick.x, brick.y, brick.width, brick.height);
  });

  if (ship.isBallSticked) {
    ball.setPos(shipRect.x + parseInt(shipRect.width / 2), shipRect.y - ball.radius);
  }
  painter.drawCircle(ball.pos.x, ball.pos.y, ball.radius);

  if (! ship.isBallSticked) {
    ball.setNextPos();
  }

  const items = [
    new Rect({x: 0, y: -1, width: canvasWidth, height: 1}),
    new Rect({x: -1, y: 0, width: 1, height: canvasHeight}),
    new Rect({x: 0, y: canvasHeight, width: canvasWidth, height: 1}),
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

  brickCollisionIndices.forEach(i => game.bricks.splice(i, 1));

  if (brickCollisions.length > 0) {
    collisions = collisions.concat(brickCollisions);
  }

  if (collisions.length > 0 && (! isEqual(collisions, lastCollisions))) {
    ball.setDegreeByCollisions(collisions);

    if (shipCollision === 'BOTTOM') {
      let newDegree = ball.degree + game.ballDegreeDelta;

      if (newDegree < 5) {
        newDegree = 20;
      }
      if (newDegree > 175) {
        newDegree = 160;
      }
      ball.setDegree(newDegree);
      game.ballDegreeDelta = 0;
    }
    lastCollisions = collisions;
  }
};

const game = new Game(draw);

game.ball.setPos(canvasWidth / 2, canvasHeight / 2);

game.start();
