import 'dart:html';

import 'game_event.dart';

/// Core Input interface
abstract class Input implements GameEventHandler {
  /// The current state of the input
  ///
  /// For example, this will only ever be 0 or 1 for digital buttons.
  /// For analog buttons (like joystick triggers) it'll _range_ from 0 to 1.
  /// For axes, it can range from -1 to 1
  num get value;
}

extension InputExtension on Input {
  bool get isActive => value != 0;
}

/// Use this as a default no-op input for places that need it
class EmptyInput implements Input {
  @override
  num get value => 0;

  @override
  void handleGameEvent(GameEvent event) {}
}

/// Use this to combine two 0-1 inputs into a single -1 to 1 axis input.
///
/// For example: we have an input for the left arrow key and the right arrow key,
/// both going from 0 to 1. We can create a `new CombinedAxisInput(left, right)`
/// to make a single axis input that goes from -1 to 1 for both buttons.
/// Can make some math easier ¯\\\_(ツ)\_/¯
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

/// Use this to track keyboard input.
/// Accepts a `KeyCode` constant for the key to track, value can be 0 or 1
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

/// Tracks joystick buttons, 0 or 1.
/// Currently only tracks the first gamepad
class JoystickButtonInput implements Input {
  final int _buttonIndex;

  JoystickButtonInput(this._buttonIndex);

  @override
  num get value =>
      window.navigator
          .getGamepads()
          .first
          ?.buttons
          ?.elementAt(_buttonIndex)
          ?.value ??
      0;

  @override
  void handleGameEvent(GameEvent event) {}
}

/// Tracks joystick axes, -1 to 1.
/// Currently only tracks the first axis on the first gamepad
class JoystickAxisInput implements Input {
  static const deadzone = 0.3;

  @override
  num get value {
    var axisValue = window.navigator.getGamepads().first?.axes?.first ?? 0;
    return axisValue.abs() > deadzone ? axisValue : 0;
  }

  @override
  void handleGameEvent(GameEvent event) {}
}

/// Combine multiple inputs into a single input.
/// It finds the first active input (whichever one has a non-zero value),
/// then returns the value for that input.
///
/// Put higher priority inputs higher in the list (e.g. if you want joystick to have
/// higher priority than keyboard, put joystick before keyboard in the list)
class Control implements GameEventHandler {
  final List<Input> _inputs;

  Control(this._inputs);

  num get value {
    final activeInput = _inputs.firstWhere((input) => input.isActive,
        orElse: () => EmptyInput());

    return activeInput.value;
  }

  @override
  void handleGameEvent(GameEvent event) {
    _inputs.forEach((input) => input.handleGameEvent(event));
  }
}
