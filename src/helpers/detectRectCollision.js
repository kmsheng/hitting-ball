export default function detectRectCollision(item, rect) {

  const {x, y} = item.pos;

  let itemLeft;
  let itemRight;
  let itemTop;
  let itemBottom;

  if ('radius' in item) {
    const {radius} = item;
    itemLeft = x - radius;
    itemRight = x + radius;
    itemTop = y - radius;
    itemBottom = y + radius;
  }
  else {
    const {width, height} = item;
    itemLeft = x;
    itemRight = x + width;
    itemTop = y;
    itemBottom = y + height;
  }

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
