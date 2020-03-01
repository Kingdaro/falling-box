import 'dart:html';

import 'game_event.dart';
import 'input.dart';
import 'math.dart';

const playerSpeed = 500;
const playerSize = 50;
const playerMovementStiffness = 10;

class Player implements GameEventHandler {
  num x = 0;
  num y = 0;
  final _input = PlayerInput();

  @override
  void handleGameEvent(GameEvent event) {
    _input.handleGameEvent(event);

    if (event is UpdateEvent) {
      x += _input.currentMovement * playerSpeed * event.delta;
    }

    if (event is DrawEvent) {
      event.context2d
        ..fillStyle = 'white'
        ..fillRect(x, y, playerSize, playerSize);
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
      currentMovement = lerp(currentMovement, _targetMovement,
          event.delta * playerMovementStiffness);
    }
  }
}
