import * as THREE from "three";
import { ALL_COLORS } from "./colors";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { stickerLocationsOnCubeSide as getStickerLocationsOnCubeSide } from "./StickerLocation";
import {
  CUBE_SIDES,
  cubeSideToInitialColor,
  cubeSideToMatrix4,
} from "./CubeSide";

function getStickerShape(): THREE.Shape {
  const stickerShape = new THREE.Shape();
  stickerShape.moveTo(-0.4, 0.35);
  stickerShape.quadraticCurveTo(-0.4, 0.4, -0.35, 0.4);
  stickerShape.lineTo(0.35, 0.4);
  stickerShape.quadraticCurveTo(0.4, 0.4, 0.4, 0.35);
  stickerShape.lineTo(0.4, -0.35);
  stickerShape.quadraticCurveTo(0.4, -0.4, 0.35, -0.4);
  stickerShape.lineTo(-0.35, -0.4);
  stickerShape.quadraticCurveTo(-0.4, -0.4, -0.4, -0.35);
  return stickerShape;
}

export default class RubiksCubeScene extends THREE.Scene {
  public readonly camera: THREE.PerspectiveCamera;
  public cameraGroup: THREE.Group;

  constructor(canvas: HTMLCanvasElement) {
    super();

    this.cameraGroup = new THREE.Group();
    this.camera = new THREE.PerspectiveCamera(40, canvas.width / canvas.height);

    this.generateAndAddCubePieces();
    this.generateAndAddStickers();
    this.addCameraGroup();
  }

  private generateAndAddCubePieces(): void {
    const cubeMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });
    new GLTFLoader().load("RoundedCube.glb", (gltf) => {
      const geometry = gltf.scene.children[0].geometry as THREE.BufferGeometry;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const piece = new THREE.Mesh(geometry, cubeMaterial);
            piece.position.set(x, y, z);
            this.add(piece);
          }
        }
      }
    });
  }

  private generateAndAddStickers(): void {
    const stickerShape = getStickerShape();
    const stickerGeometry = new THREE.ExtrudeGeometry(stickerShape, {
      depth: 0.01,
      bevelEnabled: false,
    });

    for (const cubeSide of CUBE_SIDES) {
      const color = cubeSideToInitialColor(cubeSide);
      const stickerMaterial = new THREE.MeshStandardMaterial({ color });
      const stickerGroup = new THREE.Group();
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          const sticker = new THREE.Mesh(stickerGeometry, stickerMaterial);
          sticker.position.set(x, y, 1.5);
          stickerGroup.add(sticker);
        }
      }
      stickerGroup.setRotationFromMatrix(cubeSideToMatrix4(cubeSide));
      this.add(stickerGroup);
    }
  }

  private addCameraGroup(): void {
    this.cameraGroup = new THREE.Group();
    this.cameraGroup.add(this.camera);
    this.camera.position.z = 8;

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.copy(this.camera.position);
    this.cameraGroup.add(light);

    this.add(this.cameraGroup);
  }
}
