import 'game_event.dart';
import 'input.dart';
import 'math.dart';

const playerSpeed = 500;
const playerSize = 50;
const playerMovementStiffness = 10;

class Player implements GameEventHandler {
  num _x = 0;
  num _y = 0;
  final PlayerInput _input;

  Player(this._input);

  @override
  void handleGameEvent(GameEvent event) {
    _input.handleGameEvent(event);

    if (event is UpdateEvent) {
      _x += _input.currentMovement * playerSpeed * event.delta;
    }

    if (event is DrawEvent) {
      event.context2d
        ..fillStyle = 'white'
        ..fillRect(_x, _y, playerSize, playerSize);
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
