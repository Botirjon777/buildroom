import React, { useRef, useCallback } from 'react';
import Toolbar from '@/components/room/Toolbar';
import PropertiesPanel from '@/components/room/PropertiesPanel';
import TopBar from '@/components/room/TopBar';
import StatusBar from '@/components/room/StatusBar';
import RoomViewport3D from '@/components/room/RoomViewport3D';
import { useRoomStore } from '@/store/roomStore';

const Index = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleExportImage = useCallback(() => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'room-render.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }, []);

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useRoomStore.getState();
      if (e.key === 'Delete' || e.key === 'Backspace') {
        store.deleteSelected();
      }
      if (e.key === 'Escape') {
        store.setTool('select');
        store.setSelectedId(null);
      }
      if (e.key === 'w') store.setTool('wall');
      if (e.key === 'p') store.setTool('paint');
      if (e.key === 'f') store.setTool('furniture');
      if (e.key === 'l') store.setTool('lighting');
      if (e.key === 'v') store.setTool('select');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-secondary">
      <TopBar onExportImage={handleExportImage} />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar />
        <div className="flex-1 relative">
          <RoomViewport3D canvasRef={canvasRef} />
        </div>
        <div className="toolbar-panel border-l border-toolbar-border">
          <PropertiesPanel />
        </div>
      </div>
      <StatusBar />
    </div>
  );
};

export default Index;
