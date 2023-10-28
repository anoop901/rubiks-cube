import { useEffect, useRef } from "react";
import "./RubiksCubeCanvas.css";
import * as THREE from "three";
import RubiksCubeScene from "./RubiksCubeScene";
import useAnimationFrame from "./useAnimationFrame";

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 640;

export default function RubiksCubeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<RubiksCubeScene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mouseLocationRef = useRef({ x: 0, y: 0 });

  useAnimationFrame(() => {
    if (sceneRef.current == null || rendererRef.current == null) {
      return;
    }

    const mouseLocation = mouseLocationRef.current;
    const xRotationFraction = (2 * mouseLocation.x) / CANVAS_WIDTH - 1;
    const yRotationFraction = (2 * mouseLocation.y) / CANVAS_HEIGHT - 1;
    const scene = sceneRef.current;
    scene.cameraGroup.setRotationFromEuler(
      new THREE.Euler(
        yRotationFraction * (Math.PI / 2),
        xRotationFraction * Math.PI,
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
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="RubiksCubeCanvas"
      onMouseMove={(event) => {
        if (sceneRef.current == null) {
          return;
        }
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        mouseLocationRef.current = { x, y };
      }}
      onMouseLeave={() => {
        mouseLocationRef.current = {
          x: CANVAS_WIDTH / 2,
          y: CANVAS_HEIGHT / 2,
        };
      }}
    />
  );
}
