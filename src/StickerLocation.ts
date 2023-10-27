import * as THREE from "three";
import { CubeSide, cubeSideToMatrix4 } from "./CubeSide";

export type StickerLocation = [number, number, number];

export function stickerLocationsOnCubeSide(
  cubeSide: CubeSide
): StickerLocation[] {
  const stickerLocations = [];
  const rotationMatrix = cubeSideToMatrix4(cubeSide);
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      const frontStickerLocation = [x, y, 2];
      const stickerLocation = new THREE.Vector3()
        .fromArray(frontStickerLocation)
        .applyMatrix4(rotationMatrix)
        .toArray() as StickerLocation;
      stickerLocations.push(stickerLocation);
    }
  }
  return stickerLocations;
}
