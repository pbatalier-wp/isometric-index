export function buildChainClipPath(
  width: number,
  leadEnd: number,
  bridgeWidth: number,
  height: number,
): string {
  const r = height / 2;
  const waistStart = leadEnd;
  const waistMid = leadEnd + bridgeWidth / 2;
  const waistEnd = leadEnd + bridgeWidth;
  const waistY = r * 0.522;
  const navEnd = width - r;

  const path = [
    `M 0 ${r}`,
    `C 0 ${r * 0.447} ${r * 0.447} 0 ${r} 0`,
    `L ${waistStart} 0`,
    `C ${waistStart + bridgeWidth * 0.35} 0 ${waistStart + bridgeWidth * 0.29} ${waistY} ${waistMid} ${waistY}`,
    `C ${waistStart + bridgeWidth * 0.71} ${waistY} ${waistStart + bridgeWidth * 0.65} 0 ${waistEnd} 0`,
    `L ${navEnd} 0`,
    `C ${width - r * 0.447} 0 ${width} ${r * 0.447} ${width} ${r}`,
    `L ${width} ${r}`,
    `C ${width} ${height - r * 0.447} ${width - r * 0.447} ${height} ${navEnd} ${height}`,
    `L ${waistEnd} ${height}`,
    `C ${waistStart + bridgeWidth * 0.65} ${height} ${waistStart + bridgeWidth * 0.71} ${height - waistY} ${waistMid} ${height - waistY}`,
    `C ${waistStart + bridgeWidth * 0.29} ${height - waistY} ${waistStart + bridgeWidth * 0.35} ${height} ${waistStart} ${height}`,
    `L ${r} ${height}`,
    `C ${r * 0.447} ${height} 0 ${height - r * 0.447} 0 ${r}`,
    "Z",
  ].join(" ");

  return `path("${path}")`;
}

export function bridgeWidthForHeight(height: number): number {
  return Math.round(height * 0.56);
}
