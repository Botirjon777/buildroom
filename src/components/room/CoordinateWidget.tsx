import React, { useState, useEffect } from "react";
import { useRoomStore } from "@/store/roomStore";
import { Move, Target, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export const CoordinateWidget: React.FC = () => {
  const {
    selectedId,
    furniture,
    lights,
    walls,
    updateFurniture,
    updateLight,
    updateWall,
  } = useRoomStore();

  const [coords, setCoords] = useState<{ x: number; y: number; z: number }>({
    x: 0,
    y: 0,
    z: 0,
  });
  const [editCoords, setEditCoords] = useState<{
    x: string;
    y: string;
    z: string;
  }>({ x: "0", y: "0", z: "0" });

  useEffect(() => {
    if (!selectedId) return;

    let target: any = null;
    if (selectedId.startsWith("furn-")) {
      target = furniture.find((f) => f.id === selectedId);
    } else if (selectedId.startsWith("light-")) {
      target = lights.find((l) => l.id === selectedId);
    } else if (selectedId.startsWith("wall-")) {
      target = walls.find((w) => w.id === selectedId);
    }

    if (target && target.position) {
      const [x, y, z] = target.position;
      setCoords({ x, y, z });
      setEditCoords({ x: x.toFixed(2), y: y.toFixed(2), z: z.toFixed(2) });
    } else if (target && target.start && target.end) {
      // For walls, show center
      const x = (target.start[0] + target.end[0]) / 2;
      const z = (target.start[1] + target.end[1]) / 2;
      setCoords({ x, y: 0, z });
      setEditCoords({ x: x.toFixed(2), y: "0", z: z.toFixed(2) });
    }
  }, [selectedId, furniture, lights, walls]);

  const handleApply = () => {
    if (!selectedId) return;

    const x = parseFloat(editCoords.x);
    const y = parseFloat(editCoords.y);
    const z = parseFloat(editCoords.z);

    if (isNaN(x) || isNaN(y) || isNaN(z)) return;

    if (selectedId.startsWith("furn-")) {
      updateFurniture(selectedId, { position: [x, y, z] });
    } else if (selectedId.startsWith("light-")) {
      updateLight(selectedId, { position: [x, y, z] });
    } else if (selectedId.startsWith("wall-")) {
      const wall = walls.find((w) => w.id === selectedId);
      if (wall) {
        const dx = x - (wall.start[0] + wall.end[0]) / 2;
        const dz = z - (wall.start[1] + wall.end[1]) / 2;
        updateWall(selectedId, {
          start: [wall.start[0] + dx, wall.start[1] + dz],
          end: [wall.end[0] + dx, wall.end[1] + dz],
        });
      }
    }
  };

  if (!selectedId) return null;

  return (
    <div className="absolute bottom-20 right-6 z-50">
      <Popover>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-3 bg-[#0D0D0F]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/5 transition-all group overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Move className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col items-start pr-2">
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">
                Coordinates
              </span>
              <div className="flex gap-3 text-xs font-mono text-white/60">
                <span className="flex gap-1.5">
                  <b className="text-white/40">X</b>
                  {coords.x.toFixed(2)}
                </span>
                <span className="flex gap-1.5">
                  <b className="text-white/40">Y</b>
                  {coords.y.toFixed(2)}
                </span>
                <span className="flex gap-1.5">
                  <b className="text-white/40">Z</b>
                  {coords.z.toFixed(2)}
                </span>
              </div>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 bg-[#0D0D0F] border-white/10 p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-indigo-400" />
                Position Correction
              </h4>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/40 px-1">
                  X
                </label>
                <Input
                  value={editCoords.x}
                  onChange={(e) =>
                    setEditCoords({ ...editCoords, x: e.target.value })
                  }
                  className="bg-white/5 border-white/10 h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/40 px-1">
                  Y
                </label>
                <Input
                  value={editCoords.y}
                  onChange={(e) =>
                    setEditCoords({ ...editCoords, y: e.target.value })
                  }
                  className="bg-white/5 border-white/10 h-8 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/40 px-1">
                  Z
                </label>
                <Input
                  value={editCoords.z}
                  onChange={(e) =>
                    setEditCoords({ ...editCoords, z: e.target.value })
                  }
                  className="bg-white/5 border-white/10 h-8 text-xs font-mono"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleApply}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 h-8 text-xs"
              >
                Apply Change
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
