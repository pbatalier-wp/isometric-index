import type { MorphEndpoint } from "../../../components/AreaTransitionCards";
import { orbitCenterToMorph } from "../../../utils/transitionMorph";
import { H_CARD_H, H_CARD_W } from "../utils/horizontalScrollLayout";

export { orbitCenterToMorph };

export function horizontalToMorph(x: number, y: number): MorphEndpoint {
  return {
    left: x,
    top: y,
    width: H_CARD_W,
    height: H_CARD_H,
    rotateY: 0,
    borderRadius: 8,
  };
}
