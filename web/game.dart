import 'game_event.dart';
import 'player.dart';

class Game implements GameEventHandler {
  final _player = Player();

  @override
  void handleGameEvent(GameEvent event) {
    _player.handleGameEvent(event);
  }
}
