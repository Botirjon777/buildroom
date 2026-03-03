import { create } from "zustand";
import { UploadedModel } from "@/types/room";

interface ModelState {
  models: UploadedModel[];
  activeModelId: string | null;
  selectedMeshName: string | null;
  selectedMeshColor: string;
  selectedMeshTexture: string | null;
  transformMode: "translate" | "rotate";

  // Actions
  addModel: (model: UploadedModel) => void;
  removeModel: (id: string) => void;
  setActiveModelId: (id: string | null) => void;
  setSelectedMeshName: (name: string | null) => void;
  setSelectedMeshColor: (color: string) => void;
  setSelectedMeshTexture: (url: string | null) => void;
  setTransformMode: (mode: "translate" | "rotate") => void;
  updateMeshConfig: (
    modelId: string,
    meshName: string,
    config: { color?: string; texture?: string },
  ) => void;
}

// Persist simple metadata to localStorage, but not the files themselves (too large)
const PERSIST_KEY = "dream_design_models_meta";

const loadSavedModels = (): UploadedModel[] => {
  try {
    const saved = localStorage.getItem(PERSIST_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveModels = (models: UploadedModel[]) => {
  // We only save metadata, fileUrls won't persist across reloads (they are object URLs)
  // In a real app, these would be server-side paths
  localStorage.setItem(PERSIST_KEY, JSON.stringify(models));
};

export const useModelStore = create<ModelState>((set, get) => ({
  models: loadSavedModels(),
  activeModelId: null,
  selectedMeshName: null,
  selectedMeshColor: "#ffffff",
  selectedMeshTexture: null,
  transformMode: "translate",

  addModel: (model) => {
    const newModels = [...get().models, model];
    set({ models: newModels });
    saveModels(newModels);
  },

  removeModel: (id) => {
    const newModels = get().models.filter((m) => m.id !== id);
    set({
      models: newModels,
      activeModelId: get().activeModelId === id ? null : get().activeModelId,
    });
    saveModels(newModels);
  },

  setActiveModelId: (id) =>
    set({
      activeModelId: id,
      selectedMeshName: null,
      selectedMeshColor: "#ffffff",
      selectedMeshTexture: null,
    }),

  setSelectedMeshName: (name) => set({ selectedMeshName: name }),

  setSelectedMeshColor: (color) => set({ selectedMeshColor: color }),

  setSelectedMeshTexture: (url) => set({ selectedMeshTexture: url }),

  setTransformMode: (mode) => set({ transformMode: mode }),

  updateMeshConfig: (modelId, meshName, config) => {
    // This is for local session state, specifically for the active model instances
    // In a full implementation, we might want to persist these overrides too
    set({
      selectedMeshColor: config.color ?? get().selectedMeshColor,
      selectedMeshTexture: config.texture ?? get().selectedMeshTexture,
    });
  },
}));
