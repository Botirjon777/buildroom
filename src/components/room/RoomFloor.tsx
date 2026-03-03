import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import * as THREE from 'three';

export const RoomFloor: React.FC = () => {
  const { roomWidth, roomDepth, floorColor } = useRoomStore();
  
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[roomWidth, roomDepth]} />
      <meshStandardMaterial color={floorColor} side={THREE.DoubleSide} />
    </mesh>
  );
};
