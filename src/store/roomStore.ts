import { create } from "zustand";
import {
  RoomState,
  Wall,
  WallSide,
  FurnitureItem,
  RoomLight,
  CablePoint,
  Tool,
  FurnitureType,
} from "@/types/room";

interface RoomStore extends RoomState {
  setTool: (tool: Tool) => void;
  setSelectedId: (id: string | null) => void;
  setSelectedColor: (color: string) => void;
  setSelectedFurnitureType: (type: FurnitureType) => void;
  addWall: (wall: Wall) => void;
  updateWall: (id: string, updates: Partial<Wall>) => void;
  updateWallSide: (
    id: string,
    side: "sideA" | "sideB",
    updates: Partial<WallSide>,
  ) => void;
  removeWall: (id: string) => void;
  copyWall: (id: string) => void;
  addFurniture: (item: FurnitureItem) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  removeFurniture: (id: string) => void;
  addLight: (light: RoomLight) => void;
  updateLight: (id: string, updates: Partial<RoomLight>) => void;
  removeLight: (id: string) => void;
  addCable: (cable: CablePoint) => void;
  removeCable: (id: string) => void;
  setFloorColor: (color: string) => void;
  setCeilingColor: (color: string) => void;
  setRoomDimensions: (w: number, d: number, h: number) => void;
  deleteSelected: () => void;
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  walls: [],
  furniture: [],
  lights: [
    {
      id: "ambient-1",
      type: "ambient",
      position: [0, 3, 0],
      color: "#FFFFFF",
      intensity: 0.6,
    },
    {
      id: "point-1",
      type: "point",
      position: [0, 2.8, 0],
      color: "#FFF5E1",
      intensity: 1,
    },
  ],
  cables: [],
  floorColor: "#E8E4DC",
  ceilingColor: "#FFFFFF",
  roomWidth: 6,
  roomDepth: 5,
  roomHeight: 3,
  activeTool: "select",
  selectedId: null,
  selectedColor: "#FFFFFF",
  selectedFurnitureType: "sofa",

  setTool: (tool) => set({ activeTool: tool, selectedId: null }),
  setSelectedId: (id) => set({ selectedId: id }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setSelectedFurnitureType: (type) => set({ selectedFurnitureType: type }),

  addWall: (wall) => set((s) => ({ walls: [...s.walls, wall] })),
  updateWall: (id, updates) =>
    set((s) => ({
      walls: s.walls.map((w) => (w.id === id ? { ...w, ...updates } : w)),
    })),
  updateWallSide: (id, side, updates) =>
    set((s) => ({
      walls: s.walls.map((w) =>
        w.id === id
          ? { ...w, [side]: { ...(w[side] || { color: w.color }), ...updates } }
          : w,
      ),
    })),
  removeWall: (id) =>
    set((s) => ({ walls: s.walls.filter((w) => w.id !== id) })),
  copyWall: (id) => {
    const wall = get().walls.find((w) => w.id === id);
    if (wall) {
      const newWall = {
        ...wall,
        id: `wall-${Date.now()}`,
        start: [wall.start[0] + 0.2, wall.start[1] + 0.2] as [number, number],
        end: [wall.end[0] + 0.2, wall.end[1] + 0.2] as [number, number],
      };
      set((s) => ({ walls: [...s.walls, newWall] }));
    }
  },

  addFurniture: (item) => set((s) => ({ furniture: [...s.furniture, item] })),
  updateFurniture: (id, updates) =>
    set((s) => ({
      furniture: s.furniture.map((f) =>
        f.id === id ? { ...f, ...updates } : f,
      ),
    })),
  removeFurniture: (id) =>
    set((s) => ({ furniture: s.furniture.filter((f) => f.id !== id) })),

  addLight: (light) => set((s) => ({ lights: [...s.lights, light] })),
  updateLight: (id, updates) =>
    set((s) => ({
      lights: s.lights.map((l) => (l.id === id ? { ...l, ...updates } : l)),
    })),
  removeLight: (id) =>
    set((s) => ({ lights: s.lights.filter((l) => l.id !== id) })),

  addCable: (cable) => set((s) => ({ cables: [...s.cables, cable] })),
  removeCable: (id) =>
    set((s) => ({ cables: s.cables.filter((c) => c.id !== id) })),

  setFloorColor: (color) => set({ floorColor: color }),
  setCeilingColor: (color) => set({ ceilingColor: color }),
  setRoomDimensions: (w, d, h) =>
    set({ roomWidth: w, roomDepth: d, roomHeight: h }),

  deleteSelected: () => {
    const { selectedId } = get();
    if (!selectedId) return;
    set((s) => ({
      walls: s.walls.filter((w) => w.id !== selectedId),
      furniture: s.furniture.filter((f) => f.id !== selectedId),
      lights: s.lights.filter(
        (l) => l.id !== selectedId && l.type !== "ambient",
      ),
      cables: s.cables.filter((c) => c.id !== selectedId),
      selectedId: null,
    }));
  },
}));
