import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import { state } from "../state";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import { button, useControls } from "leva";
import { useSnapshot } from "valtio";

export function AnimMesh() {
  useSnapshot(state);
  const meshRef = useRef();
  const { contextSafe } = useGSAP();

  const startAnimation = contextSafe(() => {
    const animDuration = 5;
    const initialPosition = meshRef.current.position.clone();
    const tl = gsap.timeline();
    tl.to(
      {},
      {
        duration: animDuration,
        ease: "none",
        onUpdate: function () {
          if (meshRef.current) {
            const progress = this.progress();
            const point = state.curve.getPointAt(progress);
            meshRef.current.position.copy(point);
          }
        },
        onComplete: function () {
          meshRef.current.position.copy(initialPosition);
        },
      }
    );
  });

  useControls({
    startAnimation: button(() => startAnimation()),
  });

  return (
    <Box
      ref={meshRef}
      position={[-2, 0, 0]}
      material={new THREE.MeshStandardMaterial({ color: "black" })}
    />
  );
}
