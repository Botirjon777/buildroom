import React from "react";
import { ModelLibrary } from "@/components/models/ModelLibrary";
import { ModelViewerCanvas } from "@/components/models/ModelViewerCanvas";
import { ModelConfigPanel } from "@/components/models/ModelConfigPanel";
import { useModelStore } from "@/store/modelStore";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  RotateCw,
  Move,
  Settings2,
  Download,
  Box,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ModelViewer = () => {
  const navigate = useNavigate();
  const { transformMode, setTransformMode, activeModelId, models } =
    useModelStore();
  const activeModel = models.find((m) => m.id === activeModelId);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-secondary">
      {/* Viewer Top Bar */}
      <header className="h-12 border-b border-toolbar-border bg-background/50 backdrop-blur-md flex items-center justify-between px-4 z-10">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-toolbar-muted hover:text-toolbar-foreground"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="text-xs font-medium">Back to Editor</span>
          </Button>
          <div className="h-4 w-px bg-toolbar-border" />
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-primary" />
            <h1 className="text-sm font-bold text-toolbar-foreground tracking-tight uppercase">
              3D Model Inspector
            </h1>
            {activeModel && (
              <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-mono">
                {activeModel.fileName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeModel && (
            <div className="flex items-center bg-toolbar-hover/40 rounded-lg p-0.5 border border-toolbar-border mr-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={
                      transformMode === "translate" ? "secondary" : "ghost"
                    }
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setTransformMode("translate")}
                  >
                    <Move className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Move Mode (W)</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={transformMode === "rotate" ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setTransformMode("rotate")}
                  >
                    <RotateCw className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Rotate Mode (E)</TooltipContent>
              </Tooltip>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs bg-toolbar-hover/20"
            disabled
          >
            <Download className="w-3.5 h-3.5 mr-2" />
            Export Data
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        <ModelLibrary />

        <div className="flex-1 relative">
          <ModelViewerCanvas />

          {/* Overlay Gizmo Help */}
          {activeModel && (
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm border border-toolbar-border p-2 rounded-md shadow-lg pointer-events-none">
              <p className="text-[10px] text-toolbar-muted uppercase font-bold mb-1 tracking-wider">
                Controls
              </p>
              <ul className="text-[10px] space-y-1 text-toolbar-foreground/80 lowercase">
                <li>
                  <span className="font-mono text-primary mr-2">
                    Left Click
                  </span>
                  select mesh
                </li>
                <li>
                  <span className="font-mono text-primary mr-2">
                    Right Click
                  </span>
                  pan view
                </li>
                <li>
                  <span className="font-mono text-primary mr-2">
                    Alt + Drag
                  </span>
                  rotate view
                </li>
              </ul>
            </div>
          )}
        </div>

        <div className="toolbar-panel border-l border-toolbar-border bg-background/30">
          <ModelConfigPanel />
        </div>
      </div>

      {/* Minimal Status Bar */}
      <footer className="h-6 bg-background/80 border-t border-toolbar-border flex items-center px-4 justify-between">
        <div className="flex items-center gap-4">
          <span className="text-[9px] text-toolbar-muted flex items-center gap-1 uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            System Ready
          </span>
        </div>
        <div className="text-[9px] text-toolbar-muted font-mono">
          REACT THREE FIBER ENGINE v8.0
        </div>
      </footer>
    </div>
  );
};

export default ModelViewer;
