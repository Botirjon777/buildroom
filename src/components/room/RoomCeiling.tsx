import React from 'react';
import { useRoomStore } from '@/store/roomStore';

export const RoomCeiling: React.FC = () => {
  const { roomWidth, roomDepth, roomHeight, ceilingColor } = useRoomStore();

  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]} receiveShadow>
      <planeGeometry args={[roomWidth, roomDepth]} />
      <meshStandardMaterial color={ceilingColor} transparent opacity={0.3} />
    </mesh>
  );
};
