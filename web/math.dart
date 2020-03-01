num lerp(num a, num b, num delta) => a + (b - a) * delta;

num lerpClamped(num a, num b, num delta) => lerp(a, b, delta.clamp(0, 1));
