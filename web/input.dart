import 'dart:html';

import 'game_event.dart';

abstract class Input implements GameEventHandler {
  num get value;
}

class CombinedAxisInput implements Input {
  final Input _left;
  final Input _right;

  @override
  num get value => (_left.value * -1) + _right.value;

  @override
  void handleGameEvent(GameEvent event) {
    _left.handleGameEvent(event);
    _right.handleGameEvent(event);
  }

  CombinedAxisInput(this._left, this._right);
}

class KeyInput implements Input, GameEventHandler {
  final int keyCode;

  @override
  num value = 0;

  KeyInput(this.keyCode);

  @override
  void handleGameEvent(GameEvent event) {
    if (event is KeyboardGameEvent && event.keyCode == keyCode) {
      value = event.wasPressed ? 1 : 0;
    }
    if (event is WindowFocusEvent && !event.hasFocus) {
      value = 0;
    }
  }
}

const joystickAxisDeadzone = 0.3;

class JoystickAxisInput implements Input {
  @override
  num get value {
    var axisValue = window.navigator.getGamepads().first?.axes?.first ?? 0;
    return axisValue.abs() > joystickAxisDeadzone ? axisValue : 0;
  }

  @override
  void handleGameEvent(GameEvent event) {}
}
