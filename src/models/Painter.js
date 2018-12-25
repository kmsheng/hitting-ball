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

  rect(rect, style = 'black') {
    const {x, y, width, height} = rect;
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

  showGameTip(text, x, y) {
    const {ctx} = this;
    ctx.font = '11pt Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text.toUpperCase(), x, y);
  }

  showScore(score, x, y) {
    const {ctx} = this;
    ctx.font = '11pt Arial';
    ctx.textAlign = 'right';
    ctx.fillText(score, x, y);
  }

  showTime(seconds, x, y) {

    const {ctx} = this;
    ctx.font = '11pt Arial';
    ctx.textAlign = 'left';

    const hours = parseInt(seconds / 3600, 10);
    const mins = parseInt((seconds - (hours * 3600)) / 60, 10);
    const secs = parseInt(seconds - (hours * 3600) - (mins * 60), 10);

    const hh = String(hours).padStart(2, '0');
    const mm = String(mins).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');

    ctx.fillText(`${hh}:${mm}:${ss}`, x, y);
  }
}

export default Painter;
