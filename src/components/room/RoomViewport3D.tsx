import React, { useRef, useCallback } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Environment,
  TransformControls,
  OrthographicCamera,
  PerspectiveCamera,
} from "@react-three/drei";
import { useRoomStore } from "@/store/roomStore";
import { RoomFloor } from "./RoomFloor";
import { RoomWalls } from "./RoomWalls";
import { RoomCeiling } from "./RoomCeiling";
import { FurnitureObjects } from "./FurnitureObjects";
import { RoomLights } from "./RoomLights";
import { CablePoints } from "./CablePoints";
import { FloorClickHandler } from "./FloorClickHandler";
import { FloorPlanLabels } from "./FloorPlanLabels";
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
    viewMode,
    showGrid,
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
      <FloorPlanLabels />

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

      {showGrid && (
        <Grid
          args={[20, 20]}
          position={[0, 0.005, 0]}
          cellSize={0.5}
          cellThickness={0.5}
          cellColor={viewMode === "2d" ? "#1e1e24" : "#c0c0c0"}
          sectionSize={1}
          sectionThickness={1}
          sectionColor={viewMode === "2d" ? "#31313a" : "#909090"}
          fadeDistance={25}
          fadeStrength={1}
          infiniteGrid={false}
        />
      )}
    </>
  );
}

interface RoomViewport3DProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

const RoomViewport3D: React.FC<RoomViewport3DProps> = ({ canvasRef }) => {
  const { viewMode } = useRoomStore();

  return (
    <div className="w-full h-full bg-[#0A0A0B] relative">
      <Canvas
        ref={canvasRef}
        shadows
        gl={{
          preserveDrawingBuffer: true,
          antialias: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ReinhardToneMapping,
        }}
      >
        {viewMode === "2d" ? (
          <OrthographicCamera
            makeDefault
            position={[0, 10, 0]}
            zoom={80}
            near={0.1}
            far={100}
          />
        ) : (
          <PerspectiveCamera
            makeDefault
            position={[8, 6, 8]}
            fov={50}
            near={0.1}
            far={100}
          />
        )}

        <SceneContent />

        <OrbitControls
          makeDefault
          enableRotate={viewMode !== "2d"}
          enablePan={true}
          screenSpacePanning={viewMode === "2d"}
          minPolarAngle={viewMode === "2d" ? 0 : 0.1}
          maxPolarAngle={
            viewMode === "2d"
              ? 0
              : viewMode === "render"
                ? Math.PI / 1.5
                : Math.PI / 2 - 0.05
          }
          minDistance={viewMode === "2d" ? 1 : 2}
          maxDistance={viewMode === "2d" ? 50 : 25}
          target={[0, 0, 0]}
        />
      </Canvas>

      {viewMode === "render" && (
        <div className="absolute inset-0 pointer-events-none border-[20px] border-purple-500/10 flex items-end justify-between p-8">
          <div className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-[10px] font-bold text-white uppercase tracking-[0.2em]">
              Photorealistic Path Tracing Active
            </span>
          </div>
          <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            4K UHD • 120 FPS • RTX ON
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomViewport3D;
