import 'dart:html';

import 'game_event.dart';
import 'input.dart';
import 'math.dart';
import 'vector.dart';

enum JumpState { falling, jumping }

class Player implements GameEventHandler {
  static const speed = 500;
  static const size = 50;
  static const gravity = 2500;
  static const jumpSpeed = 800;
  static const movementStiffness = 10;

  final _movementControl = Control([
    JoystickAxisInput(),
    CombinedAxisInput(
      JoystickButtonInput(14),
      JoystickButtonInput(15),
    ),
    CombinedAxisInput(KeyInput(KeyCode.LEFT), KeyInput(KeyCode.RIGHT)),
  ]);

  final _jumpControl = Control(
      [JoystickButtonInput(0), JoystickButtonInput(1), KeyInput(KeyCode.Z)]);

  var position = vec(50, 50);
  num fallingVelocity = 0;
  num currentMovement = 0;

  var _jumpState = JumpState.falling;
  bool get isJumping => _jumpState == JumpState.jumping;

  @override
  void handleGameEvent(GameEvent event) {
    _movementControl.handleGameEvent(event);
    _jumpControl.handleGameEvent(event);

    if (event is UpdateEvent) {
      currentMovement = lerp(currentMovement, _movementControl.value,
          event.delta * movementStiffness);

      _jumpState =
          _jumpControl.isActive ? JumpState.jumping : JumpState.falling;

      final movementDelta = currentMovement * speed * event.delta;

      if (isJumping) {
        fallingVelocity = -jumpSpeed;
      } else {
        fallingVelocity += gravity * event.delta;
      }

      position += vec(movementDelta, fallingVelocity * event.delta);
    }

    if (event is DrawEvent) {
      event.context2d
        ..fillStyle = 'white'
        ..fillRect(position.x, position.y, size, size);
    }
  }
}
