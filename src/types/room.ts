export interface WallSide {
  color: string;
  textureUrl?: string;
}

export interface Wall {
  id: string;
  start: [number, number];
  end: [number, number];
  height: number;
  thickness: number;
  color: string;
  sideA?: WallSide;
  sideB?: WallSide;
}

export interface FurnitureItem {
  id: string;
  type: FurnitureType;
  position: [number, number, number];
  rotation: number;
  scale: number;
  color: string;
}

export type FurnitureType =
  | "sofa"
  | "chair"
  | "table"
  | "bed"
  | "desk"
  | "bookshelf"
  | "lamp-floor"
  | "lamp-table"
  | "cabinet"
  | "plant";

export interface RoomLight {
  id: string;
  type: "point" | "spot" | "ambient";
  position: [number, number, number];
  color: string;
  intensity: number;
}

export interface CablePoint {
  id: string;
  type: "outlet" | "switch" | "junction";
  position: [number, number, number];
  wallId?: string;
}

export type Tool =
  | "select"
  | "wall"
  | "paint"
  | "furniture"
  | "lighting"
  | "cable"
  | "measure"
  | "delete";

export interface RoomState {
  walls: Wall[];
  furniture: FurnitureItem[];
  lights: RoomLight[];
  cables: CablePoint[];
  floorColor: string;
  ceilingColor: string;
  roomWidth: number;
  roomDepth: number;
  roomHeight: number;
  activeTool: Tool;
  selectedId: string | null;
  selectedColor: string;
  selectedFurnitureType: FurnitureType;
}

export const FURNITURE_CATALOG: {
  type: FurnitureType;
  label: string;
  icon: string;
}[] = [
  { type: "sofa", label: "Sofa", icon: "🛋️" },
  { type: "chair", label: "Chair", icon: "🪑" },
  { type: "table", label: "Table", icon: "🪵" },
  { type: "bed", label: "Bed", icon: "🛏️" },
  { type: "desk", label: "Desk", icon: "🖥️" },
  { type: "bookshelf", label: "Bookshelf", icon: "📚" },
  { type: "lamp-floor", label: "Floor Lamp", icon: "🪔" },
  { type: "lamp-table", label: "Table Lamp", icon: "💡" },
  { type: "cabinet", label: "Cabinet", icon: "🗄️" },
  { type: "plant", label: "Plant", icon: "🌿" },
];

export const COLOR_PALETTE = [
  "#FFFFFF",
  "#F5F5F0",
  "#E8E4DC",
  "#D4C5A9",
  "#C9B99A",
  "#A0522D",
  "#8B4513",
  "#654321",
  "#2C2C2C",
  "#1A1A2E",
  "#16213E",
  "#0F3460",
  "#E94560",
  "#FF6B6B",
  "#FFA07A",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#9B59B6",
  "#1ABC9C",
];

export interface MeshInfo {
  name: string;
  materialName?: string;
  vertexCount?: number;
}

export interface UploadedModel {
  id: string;
  name: string;
  fileName: string;
  format: "glb" | "fbx" | "obj";
  fileUrl: string; // Object URL or local path
  meshData: MeshInfo[];
  uploadedAt: number;
}
