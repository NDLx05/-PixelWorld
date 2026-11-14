const DIRECTIONS = Object.freeze([
  { name: "up", key: "ArrowUp", x: 0, y: -1 },
  { name: "down", key: "ArrowDown", x: 0, y: 1 },
  { name: "left", key: "ArrowLeft", x: -1, y: 0 },
  { name: "right", key: "ArrowRight", x: 1, y: 0 }
]);

export function joystickDirections(dx, dy, radius, threshold = 0.22) {
  const safeRadius = Math.max(1, radius);
  const length = Math.hypot(dx, dy);
  const scale = length > safeRadius ? safeRadius / length : 1;
  const nx = dx * scale / safeRadius;
  const ny = dy * scale / safeRadius;
  return DIRECTIONS.filter(direction =>
    (direction.x < 0 && nx < -threshold) ||
    (direction.x > 0 && nx > threshold) ||
    (direction.y < 0 && ny < -threshold) ||
    (direction.y > 0 && ny > threshold)
  );
}

export function joystickPointerKey(pointerId, direction) {
  return "joystick:" + pointerId + ":" + direction;
}
