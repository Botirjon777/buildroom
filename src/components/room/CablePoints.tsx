import React from 'react';
import { useRoomStore } from '@/store/roomStore';

export const CablePoints: React.FC = () => {
  const { cables, selectedId, setSelectedId, activeTool } = useRoomStore();

  return (
    <group>
      {cables.map((cable) => {
        const isSelected = selectedId === cable.id;
        const color = cable.type === 'outlet' ? '#FFD93D' : cable.type === 'switch' ? '#4D96FF' : '#FF6B6B';

        return (
          <mesh
            key={cable.id}
            position={cable.position}
            onClick={(e) => {
              e.stopPropagation();
              if (activeTool === 'select' || activeTool === 'delete') setSelectedId(cable.id);
            }}
          >
            <boxGeometry args={[0.1, 0.1, 0.05]} />
            <meshStandardMaterial
              color={color}
              emissive={isSelected ? '#00aa88' : '#000'}
              emissiveIntensity={isSelected ? 0.5 : 0}
            />
          </mesh>
        );
      })}
    </group>
  );
};
