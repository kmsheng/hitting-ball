import Pos from './Pos';
import shuffle from './../helpers/shuffle';

const DEFAULT_BALL_RADIUS = 5;

class Ball {

  constructor() {
    this.pos = new Pos(0, 0);
    this.degree = 0;
    this.radius = DEFAULT_BALL_RADIUS;

    this.setRandomDegree(85, 95);
  }

  setPos(x, y) {
    this.pos.x = x;
    this.pos.y = y;
  }

  setDegree(degree) {
    this.degree = degree;
  }

  setRandomDegree(min, max) {
    const arr = Array.from({length: max - min + 1}, (_, i) => i + min);
    this.setDegree(shuffle(arr)[0]);
  }

  setRandomDeltaDegree(min, max) {
    const arr = Array.from({length: max - min + 1}, (_, i) => i + min);
    this.setDegree(this.degree + shuffle(arr)[0]);
    if (this.degree < 5) {
      this.setDegree(5);
    }
    if (this.degree > 175) {
      this.setDegree(175);
    }
  }

  getNextPos() {
    // sin theta = height / hypotenuse
    // cos theta = bottom / hypotenuse
    const h = 1;
    const radian = this.degree * (Math.PI / 180);
    const height = h * Math.sin(radian);
    const bottom = h * Math.cos(radian);

    const {x, y} = this.pos;

    return {
      x: x + bottom,
      y: y - height
    };
  }

  setNextPos() {
    const pos = this.getNextPos();
    this.setPos(pos.x, pos.y);
  }

  setDegreeByCollisions(collisions) {


    const isTop = collisions.includes('TOP');
    const isLeft = collisions.includes('LEFT');
    const isBottom = collisions.includes('BOTTOM');
    const isRight = collisions.includes('RIGHT');

    const {degree} = this;

    const firstQuadrant = (0 <= degree) && (degree <= 90);
    const secondQuadrant = (90 <= degree) && (degree <= 180);
    const thirdQuadrant = (180 <= degree) && (degree <= 270);
    const fourthQuadrant = (270 <= degree) && (degree <= 360);

    if ((isLeft || isRight) && ((degree === 0) || degree === 180)) {
      return this.setDegree(Math.abs(degree - 180));
    }

    if ((isTop || isBottom) && ((degree === 90) || degree === 270)) {
      return this.setDegree(360 - degree);
    }

    if (firstQuadrant && isRight) {
      return this.setDegree(180 - degree);
    }

    if (firstQuadrant && isTop) {
      return this.setDegree(360 - degree);
    }

    if (firstQuadrant && isTop && isRight) {
      return this.setDegree(270 - degree);
    }

    if (secondQuadrant && isTop) {
      return this.setDegree(360 - degree);
    }

    if (secondQuadrant && isLeft) {
      return this.setDegree(180 - degree);
    }

    if (secondQuadrant && isTop && isLeft) {
      return this.setDegree(450 - degree);
    }

    if (thirdQuadrant && isLeft) {
      return this.setDegree(540 - degree);
    }

    if (thirdQuadrant && isBottom) {
      return this.setDegree(360 - degree);
    }

    if (thirdQuadrant && isBottom && isLeft) {
      return this.setDegree(270 - degree);
    }

    if (fourthQuadrant && isRight) {
      return this.setDegree(540 - degree);
    }

    if (fourthQuadrant && isBottom) {
      return this.setDegree(360 - degree);
    }

    if (fourthQuadrant && isBottom && isRight) {
      return this.setDegree(450 - degree);
    }
  }
}

export default Ball;
