export default function detectRectCollision(ball, rect) {

  const {x, y} = ball.pos;
  const {radius} = ball;

  const ballLeft = x - radius;
  const ballRight = x + radius;
  const ballTop = y - radius;
  const ballBottom = y + radius;

  const rectTop = rect.y;
  const rectBottom = rect.y + rect.height;
  const rectLeft = rect.x;
  const rectRight = rect.x + rect.width;

  if ((ballTop <= rectBottom) && (ballTop >= rectTop) &&
    (ballLeft >= rectLeft) && (ballRight <= rectRight)) {
    return 'TOP';
  }

  if ((ballLeft <= rectRight) && (ballLeft >= rectLeft) &&
    (ballTop >= rectTop) && (ballBottom <= rectBottom)) {
    return 'LEFT';
  }

  if ((ballBottom <= rectBottom) && (ballBottom >= rectTop) &&
    (ballLeft >= rectLeft) && (ballRight <= rectRight)) {
    return 'BOTTOM';
  }

  if ((ballRight >= rectLeft) && (ballRight <= rectRight) &&
    (ballTop >= rectTop) && (ballBottom <= rectBottom)) {
    return 'RIGHT';
  }
  return '';
}
