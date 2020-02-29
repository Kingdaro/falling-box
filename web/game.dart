import 'dart:html';

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
