import 'dart:html';

CanvasElement createCanvas() {
  final canvas = document.createElement('canvas');

  canvas.setAttribute('width', '1280');
  canvas.setAttribute('height', '720');

  canvas.style.display = 'block';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.backgroundColor = 'black';
  canvas.style.objectFit = 'contain';

  return canvas;
}
