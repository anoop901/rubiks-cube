import { useEffect, useRef } from "react";
import "./RubiksCubeCanvas.css";
import * as THREE from "three";
import RubiksCubeScene from "./RubiksCubeScene";

export default function RubiksCubeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas == null) {
      return;
    }
    const scene = new RubiksCubeScene(canvas);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });

    let frameNumber = 0;

    function animate() {
      scene.cameraGroup.setRotationFromEuler(
        new THREE.Euler(
          0.6 * Math.sin(0.02 * frameNumber),
          -0.02 * frameNumber,
          0,
          "YXZ"
        )
      );
    }

    function animateAndRAF() {
      animationFrameIdRef.current = requestAnimationFrame(animateAndRAF);
      frameNumber++;
      renderer.render(scene, scene.camera);
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
