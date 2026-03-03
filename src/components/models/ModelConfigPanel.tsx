import React from "react";
import { useModelStore } from "@/store/modelStore";
import { COLOR_PALETTE } from "@/types/room";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Box, Layers, Palette, Image as ImageIcon, Info } from "lucide-react";
import { toast } from "sonner";

export const ModelConfigPanel: React.FC = () => {
  const {
    activeModelId,
    models,
    selectedMeshName,
    setSelectedMeshName,
    selectedMeshColor,
    setSelectedMeshColor,
    setSelectedMeshTexture,
  } = useModelStore();

  const activeModel = models.find((m) => m.id === activeModelId);

  if (!activeModel) {
    return (
      <div className="p-4 text-center text-toolbar-muted">
        <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Select a model to see properties</p>
      </div>
    );
  }

  const handleTextureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!selectedMeshName) {
        toast.error("Please select a mesh first");
        return;
      }
      const url = URL.createObjectURL(file);
      setSelectedMeshTexture(url);
      toast.success("Texture applied to " + selectedMeshName);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6 w-72">
        {/* Model Info */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Box className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-toolbar-foreground tracking-wide uppercase">
              Model Info
            </h3>
          </div>
          <div className="space-y-2 bg-toolbar-hover/20 p-3 rounded-md border border-toolbar-border">
            <div className="flex justify-between items-center">
              <span className="text-xs text-toolbar-muted">Name</span>
              <span className="text-xs font-medium text-toolbar-foreground truncate max-w-[120px]">
                {activeModel.name}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-toolbar-muted">Format</span>
              <Badge
                variant="outline"
                className="text-[10px] uppercase h-4 px-1"
              >
                {activeModel.format}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-toolbar-muted">Meshes</span>
              <span className="text-xs font-medium text-toolbar-foreground">
                {activeModel.meshData.length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-toolbar-muted">Uploaded</span>
              <span className="text-xs font-medium text-toolbar-foreground">
                {new Date(activeModel.uploadedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </section>

        <Separator className="bg-toolbar-border" />

        {/* Mesh List */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-bold text-toolbar-foreground tracking-wide uppercase">
              Meshes
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
            {activeModel.meshData.map((mesh) => (
              <button
                key={mesh.name}
                onClick={() => setSelectedMeshName(mesh.name)}
                className={`text-left px-3 py-1.5 rounded transition-colors text-xs truncate ${
                  selectedMeshName === mesh.name
                    ? "bg-primary text-primary-foreground"
                    : "bg-toolbar-hover/40 text-toolbar-foreground hover:bg-toolbar-hover"
                }`}
                title={mesh.name}
              >
                {mesh.name}
              </button>
            ))}
          </div>
        </section>

        {selectedMeshName && (
          <>
            <Separator className="bg-toolbar-border" />

            {/* Mesh Styling */}
            <section className="space-y-4 animate-in fade-in slide-in-from-right-2">
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-toolbar-foreground tracking-wide uppercase">
                  Appearance
                </h3>
              </div>

              <div className="space-y-3">
                <Label className="text-xs text-toolbar-muted">
                  Color: {selectedMeshName}
                </Label>
                <div className="grid grid-cols-6 gap-1.5">
                  {COLOR_PALETTE.slice(0, 12).map((color) => (
                    <button
                      key={color}
                      className={`w-full aspect-square rounded-sm border transition-transform hover:scale-110 ${
                        selectedMeshColor === color
                          ? "border-primary ring-1 ring-primary"
                          : "border-toolbar-border"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setSelectedMeshColor(color)}
                    />
                  ))}
                  <div className="relative w-full aspect-square overflow-hidden rounded-sm border border-toolbar-border">
                    <input
                      type="color"
                      value={selectedMeshColor}
                      onChange={(e) => setSelectedMeshColor(e.target.value)}
                      className="absolute inset-[-5px] w-[200%] h-[200%] cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-xs text-toolbar-muted">
                  Texture Map
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-8 text-[10px] bg-toolbar-hover/30 border-toolbar-border relative group"
                  >
                    <ImageIcon className="w-3 h-3 mr-1" />
                    Upload Texture
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleTextureUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 text-toolbar-muted"
                    onClick={() => setSelectedMeshTexture(null)}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </ScrollArea>
  );
};
