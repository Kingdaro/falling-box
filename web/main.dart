import 'dart:html';

import 'canvas.dart';
import 'game.dart';

Future main() async {
  final canvas = createCanvas();
  document.body.append(canvas);

  final game = Game();

  num lastFrameTime = 0;
  while (true) {
    final currentFrameTime = await window.animationFrame;
    final delta = currentFrameTime - lastFrameTime;
    lastFrameTime = currentFrameTime;

    game.update(delta / 1000);

    canvas.context2D.clearRect(0, 0, canvas.width, canvas.height);
    game.draw(canvas.context2D);
  }
}
