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
    if (meshRef.current) {
      meshRef.current.position.copy(state.nodeProps[0].position);
      meshRef.current.scale.copy(state.nodeProps[0].scale);
      meshRef.current.quaternion.copy(state.nodeProps[0].quaternion);
      meshRef.current.material.color.copy(state.nodeProps[0].color);
    }
    const animDuration = 5;
    const tl = gsap.timeline();
    const tl2 = gsap.timeline();
    tl.to(
      {},
      {
        duration: animDuration,
        ease: "none",
        onStart: function () {
          if (meshRef.current) {
            meshRef.current.visible = true;
          }
        },
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

            // Color
            const tweenColor = tl2.getById("color" + currentLabel);
            if (tweenColor) {
              tweenColor.progress((t1 * numSegments) % 1);
            }
          }
        },
        onComplete: function () {
          if (meshRef.current) {
            meshRef.current.visible = false;
          }
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
        )
        .to(
          {},
          {
            paused: true,
            id: "color" + label,
            onUpdate: function () {
              if (meshRef.current) {
                meshRef.current.material.color.lerpColors(
                  new THREE.Color(state.nodeProps[i].color),
                  new THREE.Color(state.nodeProps[i + 1].color),
                  this.progress()
                );
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
    <Box ref={meshRef} visible={false}>
      <meshStandardMaterial />
    </Box>
  );
}
