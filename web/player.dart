import 'dart:html';

import 'game_event.dart';
import 'input.dart';
import 'math.dart';

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
