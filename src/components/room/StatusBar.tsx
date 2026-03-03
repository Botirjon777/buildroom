import React from 'react';
import { useRoomStore } from '@/store/roomStore';

const StatusBar: React.FC = () => {
  const { activeTool, walls, furniture, lights, cables, selectedId, roomWidth, roomDepth, roomHeight } = useRoomStore();

  const toolHints: Record<string, string> = {
    select: 'Click objects to select them',
    wall: 'Click two points on the floor to create a wall',
    paint: 'Select a color, then click a wall or furniture to paint',
    furniture: 'Select furniture type, then click to place',
    lighting: 'Click to add a light source',
    cable: 'Click to add an electrical outlet/switch',
    measure: 'Select objects to see measurements',
    delete: 'Click an object to delete, or select and press Delete',
  };

  return (
    <div className="h-7 toolbar-panel border-t border-toolbar-border flex items-center justify-between px-3">
      <span className="text-toolbar-muted text-xs font-mono">
        {toolHints[activeTool]}
      </span>
      <div className="flex items-center gap-4 text-toolbar-muted text-xs font-mono">
        <span>Walls: {walls.length}</span>
        <span>Furniture: {furniture.length}</span>
        <span>Lights: {lights.length}</span>
        <span>Area: {(roomWidth * roomDepth).toFixed(1)}m²</span>
        {selectedId && <span className="text-primary">Selected: {selectedId.split('-')[0]}</span>}
      </div>
    </div>
  );
};

export default StatusBar;
