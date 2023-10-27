import { useEffect, useRef } from "react";
import "./RubiksCubeCanvas.css";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { ALL_COLORS } from "./colors";

export default function RubiksCubeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      40,
      canvas.width / canvas.height
    );

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });

    new GLTFLoader().load("RoundedCube.glb", (gltf) => {
      const geometry = gltf.scene.children[0].geometry as THREE.BufferGeometry;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          for (let z = -1; z <= 1; z++) {
            const piece = new THREE.Mesh(geometry, cubeMaterial);
            piece.position.set(x, y, z);
            scene.add(piece);
          }
        }
      }
    });

    const stickerShape = new THREE.Shape();
    stickerShape.moveTo(-0.4, 0.35);
    stickerShape.quadraticCurveTo(-0.4, 0.4, -0.35, 0.4);
    stickerShape.lineTo(0.35, 0.4);
    stickerShape.quadraticCurveTo(0.4, 0.4, 0.4, 0.35);
    stickerShape.lineTo(0.4, -0.35);
    stickerShape.quadraticCurveTo(0.4, -0.4, 0.35, -0.4);
    stickerShape.lineTo(-0.35, -0.4);
    stickerShape.quadraticCurveTo(-0.4, -0.4, -0.4, -0.35);
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
        scene.add(sticker);
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
        scene.add(sticker);
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
        scene.add(sticker);
      }
    }

    const cameraGroup = new THREE.Group();
    cameraGroup.add(camera);
    scene.add(cameraGroup);
    camera.position.z = 10;

    let frameNumber = 0;

    function animate() {
      cameraGroup.setRotationFromEuler(
        new THREE.Euler(
          0.6 * Math.sin(0.02 * frameNumber),
          -0.6 * Math.cos(0.02 * frameNumber),
          // 0.02 * frameNumber,
          0,
          "YXZ"
        )
      );
    }

    function animateAndRAF() {
      animationFrameIdRef.current = requestAnimationFrame(animateAndRAF);
      frameNumber++;
      renderer.render(scene, camera);
      animate();
    }
    animationFrameIdRef.current = requestAnimationFrame(animateAndRAF);
    return () => {
      if (animationFrameIdRef.current != null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={640}
      className="RubiksCubeCanvas"
    />
  );
}
