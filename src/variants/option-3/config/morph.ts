import type { MorphEndpoint } from "../../../components/AreaTransitionCards";
import { orbitCenterToMorph } from "../../../utils/transitionMorph";
import { COLUMN_BORDER_RADIUS, COLUMN_CARD_SIZE } from "../utils/columnLayout";

export { orbitCenterToMorph };

export function columnToMorph(x: number, y: number): MorphEndpoint {
  return {
    left: x - COLUMN_CARD_SIZE / 2,
    top: y - COLUMN_CARD_SIZE / 2,
    width: COLUMN_CARD_SIZE,
    height: COLUMN_CARD_SIZE,
    rotateY: 0,
    borderRadius: COLUMN_BORDER_RADIUS,
  };
}
