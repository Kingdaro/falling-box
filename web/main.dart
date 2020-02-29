import 'dart:html';

import 'canvas.dart';

void main() {
  final canvas = createCanvas();
  document.body.append(canvas);

  canvas.context2D
    ..fillStyle = 'white'
    ..fillRect(10, 10, 100, 100);
}
