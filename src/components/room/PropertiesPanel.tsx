import React from "react";
import { useRoomStore } from "@/store/roomStore";
import { COLOR_PALETTE, FURNITURE_CATALOG } from "@/types/room";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Trash2, Copy } from "lucide-react";

const PropertiesPanel: React.FC = () => {
  const {
    activeTool,
    selectedColor,
    setSelectedColor,
    selectedFurnitureType,
    setSelectedFurnitureType,
    roomWidth,
    roomDepth,
    roomHeight,
    setRoomDimensions,
    floorColor,
    setFloorColor,
    ceilingColor,
    setCeilingColor,
    selectedId,
    walls,
    furniture,
    lights,
    updateWall,
    updateWallSide,
    updateFurniture,
    updateLight,
    copyWall,
    removeWall,
    deleteSelected,
  } = useRoomStore();

  const selectedWall = walls.find((w) => w.id === selectedId);
  const selectedFurniture = furniture.find((f) => f.id === selectedId);
  const selectedLight = lights.find((l) => l.id === selectedId);

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-5 w-64">
        {/* Room dimensions */}
        <div>
          <h3 className="text-sm font-semibold text-toolbar-foreground mb-3 tracking-wide uppercase">
            Room Size
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-toolbar-muted text-xs w-16 font-mono">
                W
              </Label>
              <Input
                type="number"
                value={roomWidth}
                onChange={(e) =>
                  setRoomDimensions(
                    Number(e.target.value),
                    roomDepth,
                    roomHeight,
                  )
                }
                className="h-7 bg-toolbar-hover border-toolbar-border text-toolbar-foreground text-xs font-mono"
                step={0.5}
                min={1}
              />
              <span className="text-toolbar-muted text-xs font-mono">m</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-toolbar-muted text-xs w-16 font-mono">
                D
              </Label>
              <Input
                type="number"
                value={roomDepth}
                onChange={(e) =>
                  setRoomDimensions(
                    roomWidth,
                    Number(e.target.value),
                    roomHeight,
                  )
                }
                className="h-7 bg-toolbar-hover border-toolbar-border text-toolbar-foreground text-xs font-mono"
                step={0.5}
                min={1}
              />
              <span className="text-toolbar-muted text-xs font-mono">m</span>
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-toolbar-muted text-xs w-16 font-mono">
                H
              </Label>
              <Input
                type="number"
                value={roomHeight}
                onChange={(e) =>
                  setRoomDimensions(
                    roomWidth,
                    roomDepth,
                    Number(e.target.value),
                  )
                }
                className="h-7 bg-toolbar-hover border-toolbar-border text-toolbar-foreground text-xs font-mono"
                step={0.25}
                min={1}
              />
              <span className="text-toolbar-muted text-xs font-mono">m</span>
            </div>
          </div>
        </div>

        <Separator className="bg-toolbar-border" />

        {/* Color Palette */}
        <div>
          <h3 className="text-sm font-semibold text-toolbar-foreground mb-3 tracking-wide uppercase">
            Colors
          </h3>
          <div className="grid grid-cols-5 gap-1.5">
            {COLOR_PALETTE.map((color) => (
              <button
                key={color}
                className={`w-8 h-8 rounded-md border-2 transition-transform hover:scale-110 ${
                  selectedColor === color
                    ? "border-primary ring-1 ring-primary scale-110"
                    : "border-toolbar-border"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}
              />
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Label className="text-toolbar-muted text-xs">Custom</Label>
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer border-0"
            />
          </div>
        </div>

        <Separator className="bg-toolbar-border" />

        {/* Surface Colors */}
        <div>
          <h3 className="text-sm font-semibold text-toolbar-foreground mb-3 tracking-wide uppercase">
            Surfaces
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="text-toolbar-muted text-xs w-16">Floor</Label>
              <input
                type="color"
                value={floorColor}
                onChange={(e) => setFloorColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label className="text-toolbar-muted text-xs w-16">Ceiling</Label>
              <input
                type="color"
                value={ceilingColor}
                onChange={(e) => setCeilingColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer border-0"
              />
            </div>
          </div>
        </div>

        {/* Furniture selection */}
        {activeTool === "furniture" && (
          <>
            <Separator className="bg-toolbar-border" />
            <div>
              <h3 className="text-sm font-semibold text-toolbar-foreground mb-3 tracking-wide uppercase">
                Furniture
              </h3>
              <div className="grid grid-cols-2 gap-1.5">
                {FURNITURE_CATALOG.map(({ type, label, icon }) => (
                  <button
                    key={type}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs transition-colors ${
                      selectedFurnitureType === type
                        ? "bg-primary text-primary-foreground"
                        : "bg-toolbar-hover text-toolbar-foreground hover:bg-toolbar-border"
                    }`}
                    onClick={() => setSelectedFurnitureType(type)}
                  >
                    <span className="text-base">{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Selected item properties */}
        {selectedWall && (
          <>
            <Separator className="bg-toolbar-border" />
            <div>
              <h3 className="text-sm font-semibold text-toolbar-foreground mb-3 tracking-wide uppercase">
                Wall Properties
              </h3>
              <div className="space-y-2 text-xs font-mono text-toolbar-foreground">
                <p>
                  Length:{" "}
                  {Math.sqrt(
                    Math.pow(selectedWall.end[0] - selectedWall.start[0], 2) +
                      Math.pow(selectedWall.end[1] - selectedWall.start[1], 2),
                  ).toFixed(2)}
                  m
                </p>
                <p>Height: {selectedWall.height}m</p>
                <p>Thickness: {selectedWall.thickness}m</p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => copyWall(selectedWall.id)}
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => removeWall(selectedWall.id)}
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>

              <Separator className="my-4 bg-toolbar-border" />

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-toolbar-muted uppercase">
                  Surface A (Inner)
                </h4>
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs text-toolbar-foreground">
                    Color
                  </Label>
                  <input
                    type="color"
                    value={selectedWall.sideA?.color || selectedWall.color}
                    onChange={(e) =>
                      updateWallSide(selectedWall.id, "sideA", {
                        color: e.target.value,
                      })
                    }
                    className="w-6 h-6 rounded border-0 cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-[10px] relative overflow-hidden"
                  >
                    Set Texture
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          updateWallSide(selectedWall.id, "sideA", {
                            textureUrl: URL.createObjectURL(file),
                          });
                      }}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[10px]"
                    onClick={() =>
                      updateWallSide(selectedWall.id, "sideA", {
                        textureUrl: undefined,
                      })
                    }
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-toolbar-muted uppercase">
                  Surface B (Outer)
                </h4>
                <div className="flex items-center justify-between gap-2">
                  <Label className="text-xs text-toolbar-foreground">
                    Color
                  </Label>
                  <input
                    type="color"
                    value={selectedWall.sideB?.color || selectedWall.color}
                    onChange={(e) =>
                      updateWallSide(selectedWall.id, "sideB", {
                        color: e.target.value,
                      })
                    }
                    className="w-6 h-6 rounded border-0 cursor-pointer"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-7 text-[10px] relative overflow-hidden"
                  >
                    Set Texture
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          updateWallSide(selectedWall.id, "sideB", {
                            textureUrl: URL.createObjectURL(file),
                          });
                      }}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-[10px]"
                    onClick={() =>
                      updateWallSide(selectedWall.id, "sideB", {
                        textureUrl: undefined,
                      })
                    }
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}

        {selectedFurniture && (
          <>
            <Separator className="bg-toolbar-border" />
            <div>
              <h3 className="text-sm font-semibold text-toolbar-foreground mb-3 tracking-wide uppercase">
                Furniture
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-toolbar-muted text-xs w-16">
                    Rotation
                  </Label>
                  <Slider
                    value={[selectedFurniture.rotation]}
                    onValueChange={([v]) =>
                      updateFurniture(selectedFurniture.id, { rotation: v })
                    }
                    min={0}
                    max={Math.PI * 2}
                    step={0.1}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {selectedLight && selectedLight.type !== "ambient" && (
          <>
            <Separator className="bg-toolbar-border" />
            <div>
              <h3 className="text-sm font-semibold text-toolbar-foreground mb-3 tracking-wide uppercase">
                Light
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label className="text-toolbar-muted text-xs w-16">
                    Intensity
                  </Label>
                  <Slider
                    value={[selectedLight.intensity]}
                    onValueChange={([v]) =>
                      updateLight(selectedLight.id, { intensity: v })
                    }
                    min={0}
                    max={5}
                    step={0.1}
                    className="flex-1"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-toolbar-muted text-xs w-16">
                    Color
                  </Label>
                  <input
                    type="color"
                    value={selectedLight.color}
                    onChange={(e) =>
                      updateLight(selectedLight.id, { color: e.target.value })
                    }
                    className="w-7 h-7 rounded cursor-pointer border-0"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
};

export default PropertiesPanel;
