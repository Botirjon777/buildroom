import React from 'react';
import { useRoomStore } from '@/store/roomStore';
import { Tool } from '@/types/room';
import {
  MousePointer2, Square, Paintbrush, Sofa, Lightbulb,
  Cable, Ruler, Trash2
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const tools: { tool: Tool; label: string; icon: React.ReactNode }[] = [
  { tool: 'select', label: 'Select', icon: <MousePointer2 className="w-5 h-5" /> },
  { tool: 'wall', label: 'Draw Wall', icon: <Square className="w-5 h-5" /> },
  { tool: 'paint', label: 'Paint', icon: <Paintbrush className="w-5 h-5" /> },
  { tool: 'furniture', label: 'Furniture', icon: <Sofa className="w-5 h-5" /> },
  { tool: 'lighting', label: 'Lighting', icon: <Lightbulb className="w-5 h-5" /> },
  { tool: 'cable', label: 'Cables', icon: <Cable className="w-5 h-5" /> },
  { tool: 'measure', label: 'Measure', icon: <Ruler className="w-5 h-5" /> },
  { tool: 'delete', label: 'Delete', icon: <Trash2 className="w-5 h-5" /> },
];

const Toolbar: React.FC = () => {
  const { activeTool, setTool, deleteSelected, selectedId } = useRoomStore();

  const handleToolClick = (tool: Tool) => {
    if (tool === 'delete' && selectedId) {
      deleteSelected();
    } else {
      setTool(tool);
    }
  };

  return (
    <div className="flex flex-col gap-1 p-2 toolbar-panel border-r border-toolbar-border">
      {tools.map(({ tool, label, icon }) => (
        <Tooltip key={tool}>
          <TooltipTrigger asChild>
            <button
              className={`toolbar-button ${activeTool === tool ? 'toolbar-button-active' : ''}`}
              onClick={() => handleToolClick(tool)}
            >
              {icon}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

export default Toolbar;
