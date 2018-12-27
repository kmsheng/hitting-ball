export default function detectRectCollision(item, rect) {

  const {x, y} = item.pos;
  const {radius} = item;

  const itemLeft = x - radius;
  const itemRight = x + radius;
  const itemTop = y - radius;
  const itemBottom = y + radius;

  const rectTop = rect.y;
  const rectBottom = rect.y + rect.height;
  const rectLeft = rect.x;
  const rectRight = rect.x + rect.width;

  if ((itemTop <= rectBottom) && (itemTop >= rectTop) &&
    (itemLeft >= rectLeft) && (itemRight <= rectRight)) {
    return 'TOP';
  }

  if ((itemLeft <= rectRight) && (itemLeft >= rectLeft) &&
    (itemTop >= rectTop) && (itemBottom <= rectBottom)) {
    return 'LEFT';
  }

  if ((itemBottom <= rectBottom) && (itemBottom >= rectTop) &&
    (itemLeft >= rectLeft) && (itemRight <= rectRight)) {
    return 'BOTTOM';
  }

  if ((itemRight >= rectLeft) && (itemRight <= rectRight) &&
    (itemTop >= rectTop) && (itemBottom <= rectBottom)) {
    return 'RIGHT';
  }
  return '';
}
