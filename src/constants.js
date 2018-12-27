export const PIXEL_RATIO = (function () {
  const ctx = document.createElement('canvas').getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const bsr = ctx.webkitBackingStorePixelRatio ||
    ctx.mozBackingStorePixelRatio ||
    ctx.msBackingStorePixelRatio ||
    ctx.oBackingStorePixelRatio ||
    ctx.backingStorePixelRatio || 1;
  return dpr / bsr;
})();

export const EFFECT_SHIP_WIDEN = Symbol();
export const EFFECT_SHIP_SHRINK = Symbol();
export const EFFECT_BALL_ENLARGE = Symbol();
export const EFFECT_BALL_SHRINK = Symbol();
export const EFFECT_BALL_THROUGH = Symbol();
export const EFFECT_FAST_SPEED = Symbol();
export const EFFECT_SLOW_SPEED = Symbol();
