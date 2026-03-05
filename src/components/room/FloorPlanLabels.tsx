import React from "react";
import { Text } from "@react-three/drei";
import { useRoomStore } from "@/store/roomStore";

export const FloorPlanLabels: React.FC = () => {
  const { walls, furniture, viewMode } = useRoomStore();

  if (viewMode !== "2d") return null;

  return (
    <group>
      {walls.map((wall) => {
        const dx = wall.end[0] - wall.start[0];
        const dz = wall.end[1] - wall.start[1];
        const length = Math.sqrt(dx * dx + dz * dz);
        const cx = (wall.start[0] + wall.end[0]) / 2;
        const cz = (wall.start[1] + wall.end[1]) / 2;
        const angle = Math.atan2(dz, dx);

        return (
          <group
            key={`label-${wall.id}`}
            position={[cx, 0.1, cz]}
            rotation={[-Math.PI / 2, 0, -angle]}
          >
            <Text
              position={[0, 0.2, 0]}
              fontSize={0.25}
              color="#ffffff"
              anchorX="center"
              anchorY="middle"
              outlineWidth={0.03}
              outlineColor="#000000"
            >
              {length.toFixed(2)}m
            </Text>
          </group>
        );
      })}

      {furniture.map((item) => (
        <group
          key={`label-${item.id}`}
          position={[item.position[0], 0.1, item.position[2]]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <Text
            position={[0, 0.4, 0]}
            fontSize={0.15}
            color="#bbbbbb"
            anchorX="center"
            anchorY="middle"
          >
            {item.type.toUpperCase()}
          </Text>
        </group>
      ))}
    </group>
  );
};
