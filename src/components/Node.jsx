import { useCursor } from "@react-three/drei";
import { useState } from "react";
import { useSnapshot } from "valtio";
import { state, modes } from "../state";
import { Euler, Quaternion, Vector3 } from "three";
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
  }
}

export function Node({ name, ...props }) {
  // Ties this component to the state model
  const snap = useSnapshot(state);
  // Feed hover state into useCursor, which sets document.body.style.cursor to pointer|auto
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);
  const params = {};
  params[name + "Position"] = {
    value: state.nodeProps.find((it) => it.name === name).position,
    onChange: (value) => {
      state.nodeProps.find((it) => it.name === name).position = value;
    },
  };
  params[name + "Scale"] = {
    value: state.nodeProps.find((it) => it.name === name).scale,
    onChange: (value) => {
      state.nodeProps.find((it) => it.name === name).scale = value;
    },
  };
  params[name + "Euler"] = {
    value: new Euler()
      .setFromQuaternion(
        state.nodeProps.find((it) => it.name === name).quaternion
      )
      .toArray()
      .slice(0, 3),
    onChange: (value) => {
      const quat = state.nodeProps.find((it) => it.name === name).quaternion;
      quat.setFromEuler(new Euler(...value));
      // console.log(new Euler(...value));
      // console.log(quat);
    },
    // onUpdate: (value) => {
    //   console.log(value);
    // },
  };
  params[name + "Color"] = {
    value: state.nodeProps.find((it) => it.name === name).color,
    onChange: (value) => {
      state.nodeProps.find((it) => it.name === name).color = value;
    },
  };
  useControls(name + "Params", params);
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
      material-color={snap.current === name ? "#ff6080" : props.color}
      {...props}
      dispose={null}
    >
      <boxGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial />
    </mesh>
  );
}
