import React, { useRef } from "react";
import { useRoomStore } from "@/store/roomStore";
import { FurnitureItem, FurnitureType } from "@/types/room";
import * as THREE from "three";

function getFurnitureGeometry(type: FurnitureType): {
  args: [number, number, number];
  yOffset: number;
} {
  switch (type) {
    case "sofa":
      return { args: [1.8, 0.7, 0.8], yOffset: 0.35 };
    case "chair":
      return { args: [0.6, 0.8, 0.6], yOffset: 0.4 };
    case "table":
      return { args: [1.2, 0.05, 0.8], yOffset: 0.75 };
    case "bed":
      return { args: [2, 0.5, 1.6], yOffset: 0.25 };
    case "desk":
      return { args: [1.4, 0.05, 0.7], yOffset: 0.75 };
    case "bookshelf":
      return { args: [1, 2, 0.35], yOffset: 1 };
    case "lamp-floor":
      return { args: [0.3, 1.6, 0.3], yOffset: 0.8 };
    case "lamp-table":
      return { args: [0.25, 0.4, 0.25], yOffset: 0.2 };
    case "cabinet":
      return { args: [1, 0.9, 0.5], yOffset: 0.45 };
    case "plant":
      return { args: [0.4, 0.8, 0.4], yOffset: 0.4 };
    default:
      return { args: [1, 1, 1], yOffset: 0.5 };
  }
}

const FurniturePiece: React.FC<{ item: FurnitureItem }> = ({ item }) => {
  const {
    activeTool,
    selectedId,
    setSelectedId,
    selectedColor,
    updateFurniture,
  } = useRoomStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const geo = getFurnitureGeometry(item.type);
  const isSelected = selectedId === item.id;

  const handleClick = (e: any) => {
    e.stopPropagation();
    if (activeTool === "select" || activeTool === "delete") {
      setSelectedId(item.id);
    }
    if (activeTool === "paint") {
      updateFurniture(item.id, { color: selectedColor });
    }
  };

  // Build compound shapes for some furniture
  if (item.type === "table" || item.type === "desk") {
    return (
      <group
        position={[item.position[0], 0, item.position[2]]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        {/* Table top */}
        <mesh position={[0, geo.yOffset, 0]} castShadow>
          <boxGeometry args={geo.args} />
          <meshStandardMaterial
            color={item.color}
            emissive={isSelected ? "#00aa88" : "#000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </mesh>
        {/* Legs */}
        {[
          [-1, -1],
          [1, -1],
          [-1, 1],
          [1, 1],
        ].map(([x, z], i) => (
          <mesh
            key={i}
            position={[
              x * (geo.args[0] / 2 - 0.05),
              geo.yOffset / 2,
              z * (geo.args[2] / 2 - 0.05),
            ]}
            castShadow
          >
            <boxGeometry args={[0.05, geo.yOffset, 0.05]} />
            <meshStandardMaterial color={item.color} />
          </mesh>
        ))}
      </group>
    );
  }

  if (item.type === "sofa") {
    return (
      <group
        position={[item.position[0], 0, item.position[2]]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        {/* Base */}
        <mesh position={[0, 0.2, 0]} castShadow>
          <boxGeometry args={[1.8, 0.4, 0.8]} />
          <meshStandardMaterial
            color={item.color}
            emissive={isSelected ? "#00aa88" : "#000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.55, -0.3]} castShadow>
          <boxGeometry args={[1.8, 0.3, 0.2]} />
          <meshStandardMaterial color={item.color} />
        </mesh>
        {/* Armrests */}
        <mesh position={[-0.85, 0.45, 0]} castShadow>
          <boxGeometry args={[0.1, 0.2, 0.8]} />
          <meshStandardMaterial color={item.color} />
        </mesh>
        <mesh position={[0.85, 0.45, 0]} castShadow>
          <boxGeometry args={[0.1, 0.2, 0.8]} />
          <meshStandardMaterial color={item.color} />
        </mesh>
      </group>
    );
  }

  if (item.type === "lamp-floor") {
    return (
      <group
        position={[item.position[0], 0, item.position[2]]}
        rotation={[0, item.rotation, 0]}
        onClick={handleClick}
      >
        {/* Base */}
        <mesh position={[0, 0.02, 0]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.04, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        {/* Pole */}
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.5, 8]} />
          <meshStandardMaterial color="#555" />
        </mesh>
        {/* Shade */}
        <mesh position={[0, 1.55, 0]}>
          <coneGeometry args={[0.2, 0.25, 16, 1, true]} />
          <meshStandardMaterial
            color={item.color}
            side={THREE.DoubleSide}
            emissive={isSelected ? "#00aa88" : "#000"}
            emissiveIntensity={isSelected ? 0.3 : 0}
          />
        </mesh>
        <pointLight
          position={[0, 1.4, 0]}
          intensity={0.5}
          color="#FFF5E1"
          distance={4}
        />
      </group>
    );
  }

  return (
    <mesh
      ref={meshRef}
      name={item.id}
      position={[item.position[0], geo.yOffset, item.position[2]]}
      rotation={[0, item.rotation, 0]}
      castShadow
      onClick={handleClick}
    >
      <boxGeometry args={geo.args} />
      <meshStandardMaterial
        color={item.color}
        emissive={isSelected ? "#00aa88" : "#000000"}
        emissiveIntensity={isSelected ? 0.3 : 0}
      />
    </mesh>
  );
};

export const FurnitureObjects: React.FC = () => {
  const furniture = useRoomStore((s) => s.furniture);

  return (
    <group>
      {furniture.map((item) => (
        <FurniturePiece key={item.id} item={item} />
      ))}
    </group>
  );
};
