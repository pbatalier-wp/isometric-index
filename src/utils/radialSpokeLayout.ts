export interface RadialSpokeLayoutInput {
  centerX: number;
  centerY: number;
  cardWidth: number;
  cardHeight: number;
  count: number;
  seed: string;
  viewportWidth: number;
  viewportHeight: number;
  radius?: number;
  padding?: number;
}

export interface RadialSpokeLayoutNode {
  x: number;
  y: number;
  angle: number;
  lineStartX: number;
  lineStartY: number;
  pathD: string;
}

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function intersectCardEdge(
  centerX: number,
  centerY: number,
  cardWidth: number,
  cardHeight: number,
  angle: number,
): { x: number; y: number } {
  const halfW = cardWidth / 2;
  const halfH = cardHeight / 2;
  const dx = Math.cos(angle);
  const dy = Math.sin(angle);

  const scaleX = dx !== 0 ? halfW / Math.abs(dx) : Infinity;
  const scaleY = dy !== 0 ? halfH / Math.abs(dy) : Infinity;
  const scale = Math.min(scaleX, scaleY);

  return {
    x: centerX + dx * scale,
    y: centerY + dy * scale,
  };
}

function clampToViewport(
  x: number,
  y: number,
  viewportWidth: number,
  viewportHeight: number,
  padding: number,
): { x: number; y: number } {
  return {
    x: Math.min(viewportWidth - padding, Math.max(padding, x)),
    y: Math.min(viewportHeight - padding, Math.max(padding, y)),
  };
}

function buildCurvedPath(
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  angle: number,
): string {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const bulge = 18;
  const controlX = midX - Math.sin(angle) * bulge;
  const controlY = midY + Math.cos(angle) * bulge;
  return `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;
}

const LABEL_WIDTH = 166;
const LABEL_HEIGHT = 72;
const LABEL_GAP = 28;

function computeMinRadius(cardWidth: number, cardHeight: number): number {
  const cardReach = Math.hypot(cardWidth / 2, cardHeight / 2);
  const labelReach = Math.hypot(LABEL_WIDTH / 2, LABEL_HEIGHT / 2);
  return cardReach + labelReach + LABEL_GAP;
}

export function computeRadialSpokeLayout({
  centerX,
  centerY,
  cardWidth,
  cardHeight,
  count,
  seed,
  viewportWidth,
  viewportHeight,
  radius,
  padding = 24,
}: RadialSpokeLayoutInput): RadialSpokeLayoutNode[] {
  if (count === 0) return [];

  const minRadius = computeMinRadius(cardWidth, cardHeight);
  const spokeRadius = Math.max(radius ?? minRadius, minRadius);

  const baseAngle = Math.PI * 0.55;
  const step = (Math.PI * 1.35) / Math.max(count - 1, 1);
  const jitterSeed = hashSeed(seed);

  return Array.from({ length: count }, (_, index) => {
    const jitter = ((jitterSeed + index * 97) % 100) / 100 - 0.5;
    const angle = baseAngle + step * index + jitter * 0.12;
    const rawX = centerX + Math.cos(angle) * spokeRadius;
    const rawY = centerY + Math.sin(angle) * spokeRadius;
    const clamped = clampToViewport(rawX, rawY, viewportWidth, viewportHeight, padding);
    const start = intersectCardEdge(centerX, centerY, cardWidth, cardHeight, angle);

    return {
      x: clamped.x,
      y: clamped.y,
      angle,
      lineStartX: start.x,
      lineStartY: start.y,
      pathD: buildCurvedPath(start.x, start.y, clamped.x, clamped.y, angle),
    };
  });
}
