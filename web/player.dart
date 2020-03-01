import 'game_event.dart';
import 'input.dart';
import 'math.dart';
import 'vector.dart';

const playerSpeed = 500;
const playerSize = 50;
const playerMovementStiffness = 10;

class Player implements GameEventHandler {
  var position = vec(50, 50);
  final PlayerInput _input;

  Player(this._input);

  @override
  void handleGameEvent(GameEvent event) {
    _input.handleGameEvent(event);

    if (event is UpdateEvent) {
      position += vec(_input.currentMovement * playerSpeed * event.delta, 0);
    }

    if (event is DrawEvent) {
      event.context2d
        ..fillStyle = 'white'
        ..fillRect(position.x, position.y, playerSize, playerSize);
    }
  }
}

class PlayerInput implements GameEventHandler {
  final Input _axisInput;

  num currentMovement = 0;

  PlayerInput(this._axisInput);

  @override
  void handleGameEvent(GameEvent event) {
    _axisInput.handleGameEvent(event);

    if (event is UpdateEvent) {
      currentMovement = lerp(currentMovement, _axisInput.value,
          event.delta * playerMovementStiffness);
    }
  }
}
