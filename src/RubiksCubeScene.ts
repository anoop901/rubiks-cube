import * as THREE from "three";
import { ALL_COLORS } from "./colors";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

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
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
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
    const stickerMaterials = ALL_COLORS.map(
      (color) => new THREE.MeshBasicMaterial({ color })
    );
    const getRandomStickerMaterial = () =>
      stickerMaterials[Math.floor(Math.random() * stickerMaterials.length)];

    for (const x of [-1, 0, 1]) {
      for (const y of [-1, 0, 1]) {
        const sticker = new THREE.Mesh(
          stickerGeometry,
          getRandomStickerMaterial()
        );
        sticker.position.set(x, y, 1.5);
        this.add(sticker);
      }
    }
    for (const y of [-1, 0, 1]) {
      for (const z of [-1, 0, 1]) {
        const sticker = new THREE.Mesh(
          stickerGeometry,
          getRandomStickerMaterial()
        );
        sticker.position.set(1.5, y, z);
        sticker.rotation.y = Math.PI / 2;
        this.add(sticker);
      }
    }
    for (const x of [-1, 0, 1]) {
      for (const z of [-1, 0, 1]) {
        const sticker = new THREE.Mesh(
          stickerGeometry,
          getRandomStickerMaterial()
        );
        sticker.position.set(x, 1.5, z);
        sticker.rotation.x = -Math.PI / 2;
        this.add(sticker);
      }
    }
  }

  private addCameraGroup(): void {
    this.cameraGroup = new THREE.Group();
    this.cameraGroup.add(this.camera);
    this.add(this.cameraGroup);
    this.camera.position.z = 10;
  }
}
