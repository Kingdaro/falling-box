import 'dart:html';

import 'game_event.dart';
import 'input.dart';
import 'math.dart';

class GameState {
  num playerX = 0;
  num playerY = 0;
}

class Game implements GameEventHandler {
  final _state = GameState();
  final _playerInput = PlayerInput();

  @override
  void handleGameEvent(GameEvent event) {
    _playerInput.handleGameEvent(event);

    if (event is UpdateEvent) {
      _state.playerX += _playerInput.currentMovement * 500 * event.delta;
    }

    if (event is DrawEvent) {
      event.context2d
        ..fillStyle = 'white'
        ..fillRect(_state.playerX, _state.playerY, 50, 50);
    }
  }
}

class PlayerInput implements GameEventHandler {
  final _left = KeyInput(KeyCode.LEFT);
  final _right = KeyInput(KeyCode.RIGHT);

  int get _targetMovement =>
      (_left.isPressed ? -1 : 0) + (_right.isPressed ? 1 : 0);

  num currentMovement = 0;

  @override
  void handleGameEvent(GameEvent event) {
    _left.handleGameEvent(event);
    _right.handleGameEvent(event);

    if (event is UpdateEvent) {
      currentMovement =
          lerp(currentMovement, _targetMovement, event.delta * 10);
    }
  }
}
