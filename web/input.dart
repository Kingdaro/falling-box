import 'game_event.dart';

abstract class Input {
  num get value;
  bool get isPressed;
}

class KeyInput implements Input, GameEventHandler {
  final int keyCode;

  @override
  num value = 0;

  @override
  bool get isPressed => value >= 1;

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
