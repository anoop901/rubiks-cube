import { CubeSide } from "./CubeSide";

export type StickerLocation = [number, number, number];

export function stickerLocationsOnCubeSide(
  cubeSide: CubeSide
): StickerLocation[] {
  const stickerLocations = [];
  const [cubeSideX, cubeSideY, cubeSideZ] = cubeSide;
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      const frontStickerLocation = [x, y, 2] as StickerLocation;
      const stickerLocation =
        cubeSideX > 0
          ? rotateStickerLocationRight(frontStickerLocation)
          : cubeSideX < 0
          ? rotateStickerLocationLeft(frontStickerLocation)
          : cubeSideY > 0
          ? rotateStickerLocationUp(frontStickerLocation)
          : cubeSideY < 0
          ? rotateStickerLocationDown(frontStickerLocation)
          : cubeSideZ < 0
          ? rotateStickerLocationRight(
              rotateStickerLocationRight(frontStickerLocation)
            )
          : frontStickerLocation;
      stickerLocations.push(stickerLocation);
    }
  }
  return stickerLocations;
}

export function rotateStickerLocationDown(
  stickerLocation: StickerLocation
): StickerLocation {
  const [x, y, z] = stickerLocation;
  return [x, -z, y];
}
export function rotateStickerLocationUp(
  stickerLocation: StickerLocation
): StickerLocation {
  const [x, y, z] = stickerLocation;
  return [x, z, -y];
}
export function rotateStickerLocationRight(
  stickerLocation: StickerLocation
): StickerLocation {
  const [x, y, z] = stickerLocation;
  return [z, y, -x];
}
export function rotateStickerLocationLeft(
  stickerLocation: StickerLocation
): StickerLocation {
  const [x, y, z] = stickerLocation;
  return [-z, y, x];
}
export function rotateStickerLocationCounterClockwise(
  stickerLocation: StickerLocation
): StickerLocation {
  const [x, y, z] = stickerLocation;
  return [y, -x, z];
}
export function rotateStickerLocationClockwise(
  stickerLocation: StickerLocation
): StickerLocation {
  const [x, y, z] = stickerLocation;
  return [-y, x, z];
}
