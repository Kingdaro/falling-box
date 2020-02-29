import 'dart:html';

import 'canvas.dart';

class GameState {
  num playerX = 0;
  num playerY = 0;
}

class Game {
  final _state = GameState();

  void update(num delta) {
    _state.playerX += 100 * delta;
  }

  void draw(CanvasRenderingContext2D context2d) {
    context2d
      ..fillStyle = 'white'
      ..fillRect(_state.playerX, _state.playerY, 100, 100);
  }
}

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
