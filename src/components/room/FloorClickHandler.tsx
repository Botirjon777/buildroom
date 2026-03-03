import React, { useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useRoomStore } from "@/store/roomStore";
import * as THREE from "three";

export const FloorClickHandler: React.FC = () => {
  const {
    activeTool,
    roomWidth,
    roomDepth,
    roomHeight,
    selectedColor,
    selectedFurnitureType,
    addWall,
    addFurniture,
    addLight,
    addCable,
    setSelectedId,
  } = useRoomStore();
  const [wallStart, setWallStart] = useState<[number, number] | null>(null);

  const handleClick = (e: any) => {
    // Only handle left clicks here
    if (e.nativeEvent.button !== 0) return;

    e.stopPropagation();
    const point = e.point;
    // Improved snap logic: 0.1m snap for better accuracy
    const x = Math.round(point.x * 10) / 10;
    const z = Math.round(point.z * 10) / 10;

    if (activeTool === "wall") {
      if (!wallStart) {
        setWallStart([x, z]);
      } else {
        if (x !== wallStart[0] || z !== wallStart[1]) {
          addWall({
            id: `wall-${Date.now()}`,
            start: wallStart,
            end: [x, z],
            height: roomHeight,
            thickness: 0.15,
            color: selectedColor,
            sideA: { color: selectedColor },
            sideB: { color: selectedColor },
          });
        }
        setWallStart(null);
      }
    }

    if (activeTool === "furniture") {
      addFurniture({
        id: `furn-${Date.now()}`,
        type: selectedFurnitureType,
        position: [x, 0, z],
        rotation: 0,
        scale: 1,
        color: selectedColor === "#FFFFFF" ? "#A0522D" : selectedColor,
      });
    }

    if (activeTool === "lighting") {
      addLight({
        id: `light-${Date.now()}`,
        type: "point",
        position: [x, 2.5, z],
        color: "#FFF5E1",
        intensity: 1,
      });
    }

    if (activeTool === "cable") {
      addCable({
        id: `cable-${Date.now()}`,
        type: "outlet",
        position: [x, 0.3, z],
      });
    }

    if (activeTool === "select") {
      setSelectedId(null);
    }
  };

  const handlePointerDown = (e: any) => {
    // Right click (button 2) removes the current drafting wall
    if (e.nativeEvent.button === 2 && wallStart) {
      e.stopPropagation();
      setWallStart(null);
    }
  };

  const [mousePos, setMousePos] = useState<[number, number] | null>(null);

  const handlePointerMove = (e: any) => {
    if (wallStart) {
      const x = Math.round(e.point.x * 10) / 10;
      const z = Math.round(e.point.z * 10) / 10;
      setMousePos([x, z]);
    }
  };

  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onContextMenu={(e) => e.nativeEvent.preventDefault()}
      >
        <planeGeometry args={[50, 50]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Wall start indicator */}
      {wallStart && (
        <group>
          <mesh position={[wallStart[0], 0.01, wallStart[1]]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color="#00cc88" />
          </mesh>

          {/* Draft wall preview line */}
          {mousePos && (
            <line>
              <bufferGeometry
                attach="geometry"
                onUpdate={(self) => {
                  self.setFromPoints([
                    new THREE.Vector3(wallStart[0], 0.02, wallStart[1]),
                    new THREE.Vector3(mousePos[0], 0.02, mousePos[1]),
                  ]);
                }}
              />
              <lineBasicMaterial
                attach="material"
                color="#00cc88"
                linewidth={2}
              />
            </line>
          )}
        </group>
      )}
    </>
  );
};
