import React from "react";
import { useRoomStore } from "@/store/roomStore";
import { Wall } from "@/types/room";
import * as THREE from "three";

const WallMesh: React.FC<{ wall: Wall; roomHeight: number }> = ({
  wall,
  roomHeight,
}) => {
  const {
    activeTool,
    selectedId,
    setSelectedId,
    selectedColor,
    updateWallSide,
    viewMode,
  } = useRoomStore();
  const height = viewMode === "2d" ? 0.01 : wall.height || roomHeight;

  const dx = wall.end[0] - wall.start[0];
  const dz = wall.end[1] - wall.start[1];
  const length = Math.sqrt(dx * dx + dz * dz);
  const angle = Math.atan2(dz, dx);
  const cx = (wall.start[0] + wall.end[0]) / 2;
  const cz = (wall.start[1] + wall.end[1]) / 2;

  const isSelected = selectedId === wall.id;

  const handlePointerDown = (e: any) => {
    e.stopPropagation();

    // Select tool
    if (activeTool === "select" || activeTool === "delete") {
      setSelectedId(wall.id);
    }

    // Paint tool: detect side
    if (activeTool === "paint") {
      // BoxGeometry face indices: 0: +X, 1: -X, 2: +Y, 3: -Y, 4: +Z (Side A), 5: -Z (Side B)
      const faceIndex = Math.floor(e.faceIndex / 2);
      let side: "sideA" | "sideB" | null = null;

      if (faceIndex === 4) side = "sideA";
      else if (faceIndex === 5) side = "sideB";

      if (side) {
        updateWallSide(wall.id, side, { color: selectedColor });
      } else {
        // Fallback for edges
        updateWallSide(wall.id, "sideA", { color: selectedColor });
        updateWallSide(wall.id, "sideB", { color: selectedColor });
      }
    }
  };

  // Materials for each side of the box
  const materials = React.useMemo(() => {
    const createMaterial = (sideData?: {
      color: string;
      textureUrl?: string;
    }) => {
      if (viewMode === "2d") {
        return new THREE.MeshBasicMaterial({
          color: isSelected ? "#ffffff" : "#444444",
        });
      }

      const mat = new THREE.MeshStandardMaterial({
        color: sideData?.color || wall.color,
        roughness: 0.8,
        metalness: 0.1,
        emissive: isSelected ? "#00aa88" : "#000000",
        emissiveIntensity: isSelected ? 0.3 : 0,
        map: sideData?.textureUrl
          ? new THREE.TextureLoader().load(sideData.textureUrl, (tex) => {
              tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
              tex.repeat.set(length / 2, height / 2); // Simple tiling
            })
          : null,
      });
      return mat;
    };

    return [
      createMaterial(), // Right
      createMaterial(), // Left
      createMaterial(), // Top
      createMaterial(), // Bottom
      createMaterial(wall.sideA), // Side A (Front +Z)
      createMaterial(wall.sideB), // Side B (Back -Z)
    ];
  }, [wall.color, wall.sideA, wall.sideB, isSelected, length, height]);

  return (
    <mesh
      name={wall.id}
      position={[cx, height / 2, cz]}
      rotation={[0, -angle, 0]}
      castShadow
      receiveShadow
      onPointerDown={handlePointerDown}
    >
      <boxGeometry args={[length, height, wall.thickness]} />
      {materials.map((mat, i) => (
        <primitive key={i} object={mat} attach={`material-${i}`} />
      ))}
    </mesh>
  );
};

export const RoomWalls: React.FC = () => {
  const { walls, roomHeight } = useRoomStore();

  return (
    <group>
      {walls.map((wall) => (
        <WallMesh key={wall.id} wall={wall} roomHeight={roomHeight} />
      ))}
    </group>
  );
};
