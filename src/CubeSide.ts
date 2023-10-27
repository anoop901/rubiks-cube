import * as THREE from "three";
import { BLUE, GREEN, ORANGE, RED, WHITE, YELLOW } from "./colors";

export type CubeSide = [number, number, number];

export const CUBE_SIDES: CubeSide[] = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
];

export function cubeSideToMatrix4(cubeSide: CubeSide): THREE.Matrix4 {
  const [x, y, z] = cubeSide;
  const matrix = new THREE.Matrix4();
  if (x > 0) {
    matrix.makeRotationY(Math.PI / 2);
  }
  if (x < 0) {
    matrix.makeRotationY(-Math.PI / 2);
  }
  if (y > 0) {
    matrix.makeRotationX(-Math.PI / 2);
  }
  if (y < 0) {
    matrix.makeRotationX(Math.PI / 2);
  }
  if (z < 0) {
    matrix.makeRotationY(Math.PI);
  }
  return matrix;
}

export function cubeSideToInitialColor(cubeSide: CubeSide): string {
  const [x, y, z] = cubeSide;
  if (x > 0) {
    return RED;
  }
  if (x < 0) {
    return ORANGE;
  }
  if (y > 0) {
    return BLUE;
  }
  if (y < 0) {
    return GREEN;
  }
  if (z < 0) {
    return YELLOW;
  }
  return WHITE;
}
