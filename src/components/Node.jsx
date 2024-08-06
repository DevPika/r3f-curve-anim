import { useCursor } from "@react-three/drei";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { state, modes } from "../state";
import { Quaternion, Vector3 } from "three";
import { useControls } from "leva";

export class NodeProps {
  id;
  name;
  position;

  constructor(id, position, scale, quaternion, color) {
    this.id = id === undefined ? 0 : id;
    this.name = "Node" + this.id;
    this.position = position === undefined ? new Vector3() : position;
    this.scale = scale === undefined ? new Vector3(1, 1, 1) : scale;
    this.quaternion = quaternion === undefined ? new Quaternion() : quaternion;
    this.color = color === undefined ? "black" : color;
    this.isFirstLoadComplete = false;
    this.isSecondLoadComplete = false;
  }
}

export function Node({ name, ...props }) {
  // Ties this component to the state model
  const snap = useSnapshot(state);
  // Feed hover state into useCursor, which sets document.body.style.cursor to pointer|auto
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const params = {};
  params[name] = {
    value: snap.nodeProps.find((it) => it.name === name).color,
    onChange: function (v) {
      const nodeProp = state.nodeProps.find((it) => it.name === name);
      // TODO Leva Library Bug:
      // Color picker UI caches values, storing them even after node removal, so new nodes start with previous colors
      // console.log(v);
      if (!nodeProp.isFirstLoadComplete) {
        // this.value = nodeProp.color;
        nodeProp.isFirstLoadComplete = true;
        console.log("firstLoadComplete");
        console.log(nodeProp);
      } else if (!nodeProp.isSecondLoadComplete) {
        nodeProp.isSecondLoadComplete = true;
        console.log("secondLoadComplete");
        console.log(nodeProp);
      } else {
        nodeProp.color = v;
        console.log("color set");
      }
    },
  };
  useControls("Node Colors", params, [
    state.nodeProps.find((it) => it.name === name).color,
  ]);
  return (
    <mesh
      // Click sets the mesh as the new target
      onClick={(e) => (e.stopPropagation(), (state.current = name))}
      // If a click happened but this mesh wasn't hit we null out the target,
      // This works because missed pointers fire before the actual hits
      onPointerMissed={(e) => e.type === "click" && (state.current = null)}
      // Right click cycles through the transform modes
      onContextMenu={(e) =>
        snap.current === name &&
        (e.stopPropagation(), (state.mode = (snap.mode + 1) % modes.length))
      }
      onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
      onPointerOut={(e) => setHovered(false)}
      name={name}
      {...props}
      dispose={null}
    >
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial
        color={
          snap.current === name
            ? "#ff6080"
            : state.nodeProps.find((it) => it.name === name).color
        }
      />
    </mesh>
  );
}
