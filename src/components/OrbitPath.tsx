import { getOrbitRingRadii } from "../utils/clusterLayout";

interface OrbitPathProps {
  width: number;
  height: number;
  radius: number;
  ringGap: number;
  opacity: number;
}

export function OrbitPath({ width, height, radius, ringGap, opacity }: OrbitPathProps) {
  const centerX = width / 2;
  const centerY = height / 2;
  const rings = getOrbitRingRadii(radius, ringGap);

  return (
    <svg
      width={width}
      height={height}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {rings.map((ringRadius) => (
        <circle
          key={ringRadius}
          cx={centerX}
          cy={centerY}
          r={ringRadius}
          fill="none"
          stroke="rgba(41, 41, 41, 0.2)"
          strokeWidth={1}
          strokeDasharray="4 6"
          opacity={opacity}
        />
      ))}
    </svg>
  );
}
