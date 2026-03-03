import React from "react";
import { useModelStore } from "@/store/modelStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, FileCode, Archive, Library } from "lucide-react";
import { ModelUploader } from "./ModelUploader";

export const ModelLibrary: React.FC = () => {
  const { models, activeModelId, setActiveModelId, removeModel } =
    useModelStore();

  return (
    <div className="flex flex-col h-full w-64 border-r border-toolbar-border bg-secondary/30">
      <div className="p-4 border-b border-toolbar-border bg-toolbar-hover/10">
        <div className="flex items-center gap-2 mb-4">
          <Library className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-bold text-toolbar-foreground uppercase tracking-wider">
            Library
          </h2>
        </div>
        <ModelUploader />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {models.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 opacity-40 text-toolbar-muted">
              <Archive className="w-8 h-8 mb-2" />
              <p className="text-xs text-center">No models uploaded yet</p>
            </div>
          ) : (
            models.map((model) => (
              <div
                key={model.id}
                className={`group flex items-center justify-between p-2 rounded-md transition-all cursor-pointer ${
                  activeModelId === model.id
                    ? "bg-primary/20 border border-primary/30 ring-1 ring-primary/20"
                    : "hover:bg-toolbar-hover border border-transparent"
                }`}
                onClick={() => setActiveModelId(model.id)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`p-1.5 rounded bg-toolbar-hover/50 ${activeModelId === model.id ? "text-primary" : "text-toolbar-muted"}`}
                  >
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-toolbar-foreground truncate">
                      {model.name}
                    </span>
                    <span className="text-[10px] text-toolbar-muted uppercase">
                      {model.format}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 opacity-0 group-hover:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeModel(model.id);
                  }}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t border-toolbar-border bg-toolbar-hover/10 text-center">
        <span className="text-[10px] text-toolbar-muted font-mono uppercase">
          {models.length} Model{models.length !== 1 ? "s" : ""} Stored
        </span>
      </div>
    </div>
  );
};
