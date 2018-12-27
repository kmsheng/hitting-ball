import Pos from './Pos';

const DEFAULT_PILL_WIDTH = 30;
const DEFAULT_PILL_HEIGHT = 10;

class Pill {

  constructor(x, y) {
    this.pos = new Pos(x, y);
    this.width = DEFAULT_PILL_WIDTH;
    this.height = DEFAULT_PILL_HEIGHT;
  }

  setNextPos() {
    this.pos.y += 0.2;
  }
}

export default Pill;
