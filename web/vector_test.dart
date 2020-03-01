import 'package:test/test.dart';

import 'vector.dart';

void main() {
  test('length', () {
    expect(vec(3, 4).length, equals(5));
  });

  test('normalized', () {
    expect(vec(3, 4).normalized(), equals(vec(3 / 5, 4 / 5)));
    expect(vec(-3, -4).normalized(), equals(vec(3 / -5, 4 / -5)));
  });
}
