import 'dart:math';

extension on num {
  num get squared => pow(this, 2);
}

class Vector {
  final num x;
  final num y;

  const Vector(this.x, this.y);

  static const origin = Vector(0, 0);

  num get length => sqrt(x * x + y * y);
  Vector normalized() => vec(x / length, y / length);

  Vector operator +(Vector other) => vec(x + other.x, y + other.y);
  Vector operator -(Vector other) => vec(x - other.x, y - other.y);
  Vector operator *(Vector other) => vec(x * other.x, y * other.y);
  Vector operator /(Vector other) => vec(x / other.x, y / other.y);

  @override
  bool operator ==(Object other) =>
      other is Vector ? x == other.x && y == other.y : false;
}

Vector vec(num x, num y) => Vector(x, y);
