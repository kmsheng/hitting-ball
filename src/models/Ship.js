import Rect from './Rect';

const DEFAULT_SHIP_WIDTH = 80;
const DEFAULT_SHIP_HEIGHT = 4;
const DEFAULT_SHIP_SPEED = 10;
const PADDING_BOTTOM = 20;

class Ship {

  constructor() {

    this.horizontalDelta = 0;

    this.height = DEFAULT_SHIP_HEIGHT;
    this.width = DEFAULT_SHIP_WIDTH;
    this.paddingBottom = PADDING_BOTTOM;
    this.speed = DEFAULT_SHIP_SPEED;

    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.isBallSticked = true;
  }

  setCanvasSize(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  getRect() {
    return new Rect({
      x: parseInt(this.canvasWidth / 2, 10) + this.horizontalDelta - parseInt(this.width / 2, 10),
      y: this.canvasHeight - this.paddingBottom,
      width: this.width,
      height: this.height
    });
  }

  goLeft() {
    const {x} = this.getRect();
    if ((x - this.speed) < 0) {
      return;
    }
    this.horizontalDelta -= this.speed;
  }

  goRight() {
    const {x, width} = this.getRect();
    if ((x + width + this.speed) > this.canvasWidth) {
      return;
    }
    this.horizontalDelta += this.speed;
  }

  release() {
    this.isBallSticked = false;
  }
}

export default Ship;
