import 'dart:html';

class GameEvent {}

class KeyboardGameEvent implements GameEvent {
  int keyCode;
  bool wasPressed;
  KeyboardGameEvent(this.keyCode, this.wasPressed);
}

class WindowFocusEvent implements GameEvent {
  bool hasFocus;
  WindowFocusEvent(this.hasFocus);
}

class UpdateEvent implements GameEvent {
  num delta;
  UpdateEvent(this.delta);
}

class DrawEvent implements GameEvent {
  CanvasRenderingContext2D context2d;
  DrawEvent(this.context2d);
}

abstract class GameEventHandler {
  void handleGameEvent(GameEvent event);
}
