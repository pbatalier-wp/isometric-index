import { TILE_SIZE } from "../components/ArticleTile";
import { CARD_H, CARD_W } from "./isometricLayout";
import type { MorphEndpoint } from "../components/AreaTransitionCards";

export function orbitCenterToMorph(x: number, y: number): MorphEndpoint {
  return {
    left: x - TILE_SIZE / 2,
    top: y - TILE_SIZE / 2,
    width: TILE_SIZE,
    height: TILE_SIZE,
    rotateY: 0,
    borderRadius: 6.4,
  };
}

export function isometricToMorph(x: number, y: number): MorphEndpoint {
  return {
    left: x,
    top: y,
    width: CARD_W,
    height: CARD_H,
    rotateY: -15,
    borderRadius: 4,
  };
}
