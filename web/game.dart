import 'game_event.dart';
import 'player.dart';

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
