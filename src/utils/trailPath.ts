interface Point {
  x: number;
  y: number;
}

export interface TrailSegmentPath {
  d: string;
  labelX: number;
  labelY: number;
  length: number;
  curved: boolean;
}

const SHORT_TRAIL_THRESHOLD = 200;
const MAX_BULGE = 56;

function distance(from: Point, to: Point): number {
  return Math.hypot(to.x - from.x, to.y - from.y);
}

function quadraticPoint(p0: Point, control: Point, p2: Point, t: number): Point {
  const u = 1 - t;
  return {
    x: u * u * p0.x + 2 * u * t * control.x + t * t * p2.x,
    y: u * u * p0.y + 2 * u * t * control.y + t * t * p2.y,
  };
}

function buildCurvedTrailPath(from: Point, to: Point, length: number): TrailSegmentPath {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const normalX = -dy / length;
  const normalY = dx / length;
  const bulge = Math.min(length * 0.4, MAX_BULGE);
  const control = {
    x: midX + normalX * bulge,
    y: midY + normalY * bulge,
  };
  const label = quadraticPoint(from, control, to, 0.5);

  return {
    d: `M ${from.x} ${from.y} Q ${control.x} ${control.y} ${to.x} ${to.y}`,
    labelX: label.x,
    labelY: label.y,
    length,
    curved: true,
  };
}

export function buildTrailSegmentPath(from: Point, to: Point): TrailSegmentPath {
  const length = distance(from, to);

  if (length < SHORT_TRAIL_THRESHOLD) {
    return buildCurvedTrailPath(from, to, length);
  }

  return {
    d: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
    labelX: (from.x + to.x) / 2,
    labelY: (from.y + to.y) / 2,
    length,
    curved: false,
  };
}
