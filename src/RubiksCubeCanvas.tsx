import { useEffect, useRef } from "react";
import "./RubiksCubeCanvas.css";
import * as THREE from "three";
import RubiksCubeScene from "./RubiksCubeScene";
import useAnimationFrame from "./useAnimationFrame";

export default function RubiksCubeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<RubiksCubeScene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useAnimationFrame((frameNumber) => {
    if (sceneRef.current == null || rendererRef.current == null) {
      return;
    }
    const scene = sceneRef.current;
    scene.cameraGroup.setRotationFromEuler(
      new THREE.Euler(
        0.6 * Math.sin(0.02 * frameNumber),
        -0.02 * frameNumber,
        0,
        "YXZ"
      )
    );
    const renderer = rendererRef.current;
    renderer.render(scene, scene.camera);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const scene = new RubiksCubeScene();
    sceneRef.current = scene;
    rendererRef.current = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
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
