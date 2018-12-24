export default function createHiDpiCanvas(canvas, w, h, ratio) {
  canvas.width = w * ratio;
  canvas.height = h * ratio;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  canvas.getContext('2d')
    .setTransform(ratio, 0, 0, ratio, 0, 0);
  return canvas;
}
