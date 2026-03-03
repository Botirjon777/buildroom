import React, { useRef, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Environment,
  TransformControls,
} from "@react-three/drei";
import { useRoomStore } from "@/store/roomStore";
import { RoomFloor } from "./RoomFloor";
import { RoomWalls } from "./RoomWalls";
import { RoomCeiling } from "./RoomCeiling";
import { FurnitureObjects } from "./FurnitureObjects";
import { RoomLights } from "./RoomLights";
import { CablePoints } from "./CablePoints";
import { FloorClickHandler } from "./FloorClickHandler";
import * as THREE from "three";

function SceneContent() {
  const {
    roomWidth,
    roomDepth,
    selectedId,
    walls,
    furniture,
    lights,
    updateWall,
    updateFurniture,
    updateLight,
    activeTool,
  } = useRoomStore();

  const { scene, controls } = useThree();

  // ... (inside the component)

  const orbitControls = controls as any;

  // Find the selected object data from the store
  const selectedObjectData =
    walls.find((w) => w.id === selectedId) ||
    furniture.find((f) => f.id === selectedId) ||
    lights.find((l) => l.id === selectedId);

  // Find the actual 3D object in the scene by its name (which should match selectedId)
  const selectedObjectRef = useRef<THREE.Object3D | null>(null);
  if (selectedId) {
    selectedObjectRef.current = scene.getObjectByName(selectedId);
  } else {
    selectedObjectRef.current = null;
  }

  const handleTransform = useCallback(
    (e: any) => {
      if (!selectedObjectData || !selectedId) return;

      // The object being transformed is e.target.object
      const obj = e.target.object;
      if (!obj) return;

      const { position, rotation, scale } = obj;

      if (selectedId.startsWith("wall-")) {
        const wall = walls.find((w) => w.id === selectedId);
        if (wall) {
          // For walls, we need to calculate the new start/end points based on the center movement
          // This is a simplified approach; a more robust solution might involve rotating walls
          // For now, assuming only translation for walls
          const currentCenter = new THREE.Vector3(
            (wall.start[0] + wall.end[0]) / 2,
            0,
            (wall.start[1] + wall.end[1]) / 2,
          );
          const newCenter = new THREE.Vector3(position.x, 0, position.z);
          const delta = newCenter.sub(currentCenter);

          updateWall(wall.id, {
            start: [wall.start[0] + delta.x, wall.start[1] + delta.z],
            end: [wall.end[0] + delta.x, wall.end[1] + delta.z],
          });
        }
      } else if (selectedId.startsWith("furn-")) {
        updateFurniture(selectedId, {
          position: [position.x, position.y, position.z],
          rotation: rotation.y, // Assuming rotation around Y-axis
          scale: scale.x, // Assuming uniform scale
        });
      } else if (selectedId.startsWith("light-")) {
        updateLight(selectedId, {
          position: [position.x, position.y, position.z],
        });
      }
    },
    [
      selectedId,
      selectedObjectData,
      walls,
      furniture,
      lights,
      updateWall,
      updateFurniture,
      updateLight,
    ],
  );

  return (
    <>
      <RoomLights />
      <RoomFloor />
      <RoomCeiling />
      <RoomWalls />
      <FurnitureObjects />
      <CablePoints />
      <FloorClickHandler />

      {selectedId && activeTool === "select" && selectedObjectRef.current && (
        <TransformControls
          object={selectedObjectRef.current}
          mode="translate"
          onMouseDown={() => {
            if (orbitControls) orbitControls.enabled = false;
          }}
          onMouseUp={(e) => {
            if (orbitControls) orbitControls.enabled = true;
            handleTransform(e);
          }}
        />
      )}

      <Grid
        args={[20, 20]}
        position={[0, 0.005, 0]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor="#c0c0c0"
        sectionSize={1}
        sectionThickness={1}
        sectionColor="#909090"
        fadeDistance={25}
        fadeStrength={1}
        infiniteGrid={false}
      />
      <OrbitControls
        makeDefault
        minPolarAngle={0.1}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minDistance={2}
        maxDistance={20}
        target={[0, 0, 0]}
      />
    </>
  );
}

interface RoomViewport3DProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const RoomViewport3D: React.FC<RoomViewport3DProps> = ({ canvasRef }) => {
  return (
    <div className="w-full h-full bg-viewport">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [8, 6, 8], fov: 50 }}
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

export default RoomViewport3D;
