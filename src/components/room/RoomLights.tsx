import React from 'react';
import { useRoomStore } from '@/store/roomStore';

export const RoomLights: React.FC = () => {
  const lights = useRoomStore((s) => s.lights);

  return (
    <>
      {lights.map((light) => {
        if (light.type === 'ambient') {
          return <ambientLight key={light.id} color={light.color} intensity={light.intensity} />;
        }
        if (light.type === 'point') {
          return (
            <group key={light.id}>
              <pointLight
                position={light.position}
                color={light.color}
                intensity={light.intensity}
                castShadow
                distance={15}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
              />
              <mesh position={light.position}>
                <sphereGeometry args={[0.08, 16, 16]} />
                <meshBasicMaterial color={light.color} />
              </mesh>
            </group>
          );
        }
        if (light.type === 'spot') {
          return (
            <spotLight
              key={light.id}
              position={light.position}
              color={light.color}
              intensity={light.intensity}
              angle={0.5}
              penumbra={0.5}
              castShadow
            />
          );
        }
        return null;
      })}
    </>
  );
};
