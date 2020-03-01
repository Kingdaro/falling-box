import 'dart:html';

import 'game_event.dart';
import 'input.dart';
import 'player.dart';

class Game implements GameEventHandler {
  static final _keyboardInput = CombinedAxisInput(
    KeyInput(KeyCode.LEFT),
    KeyInput(KeyCode.RIGHT),
  );

  static final _joystickInput = JoystickAxisInput();

  final _player = Player(PlayerInput(_joystickInput));

  @override
  void handleGameEvent(GameEvent event) {
    _player.handleGameEvent(event);
  }
}
