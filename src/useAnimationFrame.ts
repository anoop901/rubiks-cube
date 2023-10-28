import { useCallback, useEffect, useRef } from "react";

function useAnimationFrame(callback: (frameNumber: number) => void) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  });
  useEffect(() => {
    let animationFrameId: number;
    let frameNumber = 0;

    const animate = () => {
      callbackRef.current(frameNumber);
      frameNumber++;
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
}

export default useAnimationFrame;
