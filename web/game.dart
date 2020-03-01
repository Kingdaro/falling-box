import 'game_event.dart';
import 'player.dart';

class GameState {
  num playerX = 0;
  num playerY = 0;
}

class Game implements GameEventHandler {
  final _player = Player();

  @override
  void handleGameEvent(GameEvent event) {
    _player.handleGameEvent(event);
  }
}
