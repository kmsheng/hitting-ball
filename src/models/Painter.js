class Painter {

  constructor(ctx) {
    this.ctx = ctx;
  }

  fillRect(rect, style = 'black') {
    const {x, y, width, height} = rect;
    const {ctx} = this;
    ctx.fillStyle = style;
    ctx.fillRect(x, y, width, height);
  }

  rect(x, y, width, height, style = 'black') {
    const {ctx} = this;
    ctx.beginPath();
    ctx.strokeStyle = style;
    ctx.rect(x, y, width, height);
    ctx.stroke();
    ctx.closePath();
  }

  drawCircle(x, y, r, style = 'black') {
    const {ctx} = this;
    ctx.beginPath();
    ctx.fillStyle = style;
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }
}

export default Painter;
