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
    const initialScale = meshRef.current.scale.clone();
    const initialQuaternion = meshRef.current.quaternion.clone();
    const tl = gsap.timeline();
    const tl2 = gsap.timeline();
    tl.to(
      {},
      {
        duration: animDuration,
        ease: "none",
        onUpdate: function () {
          if (meshRef.current) {
            const progress = this.progress();
            // Position
            const point = state.curve.getPointAt(progress);
            meshRef.current.position.copy(point);

            const numSegments = state.nodeProps.length - 1;
            const t1 = state.curve.getUtoTmapping(progress);
            const currentLabel = Math.floor(t1 * numSegments);

            // Scale
            const tweenScale = tl2.getById("scale" + currentLabel);
            // TODO Store tween in variable outside while creation itself instead of gettingById each time
            if (tweenScale) {
              tweenScale.progress((t1 * numSegments) % 1);
            }

            // Rotation
            const tweenRotation = tl2.getById("quaternion" + currentLabel);
            if (tweenRotation) {
              tweenRotation.progress((t1 * numSegments) % 1);
            }
          }
        },
        onComplete: function () {
          meshRef.current.position.copy(initialPosition);
          meshRef.current.scale.copy(initialScale);
          meshRef.current.quaternion.copy(initialQuaternion);
        },
      }
    );

    // Add separate tweens for scale and rotation for each segment
    // These tweens will be controlled by the main timeline 'tl'
    for (let i = 0; i < state.nodeProps.length - 1; i++) {
      const label = i.toString();
      tl2
        .to(
          {},
          {
            paused: true,
            id: "scale" + label,
            onUpdate: function () {
              if (meshRef.current) {
                meshRef.current.scale
                  .copy(state.nodeProps[i].scale)
                  .lerp(state.nodeProps[i + 1].scale, this.progress());
              }
            },
          },
          label
        )
        .to(
          {},
          {
            paused: true,
            id: "quaternion" + label,
            onUpdate: function () {
              if (meshRef.current) {
                meshRef.current.quaternion
                  .copy(state.nodeProps[i].quaternion)
                  .slerp(state.nodeProps[i + 1].quaternion, this.progress());
              }
            },
          },
          label
        );
    }
  });

  useControls("Buttons", {
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
