import React, { useCallback } from "react";
import { useModelStore } from "@/store/modelStore";
import { UploadedModel, MeshInfo } from "@/types/room";
import { toast } from "sonner";
import { Upload, FileCode } from "lucide-react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

export const ModelUploader: React.FC = () => {
  const { addModel, setActiveModelId } = useModelStore();

  const analyzeMeshNames = async (file: File): Promise<MeshInfo[]> => {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const extension = file.name.split(".").pop()?.toLowerCase();

      let loader: any;
      if (extension === "glb" || extension === "gltf") {
        loader = new GLTFLoader();
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath(
          "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
        );
        loader.setDRACOLoader(dracoLoader);
      } else if (extension === "fbx") loader = new FBXLoader();
      else if (extension === "obj") loader = new OBJLoader();
      else {
        URL.revokeObjectURL(url);
        return reject(new Error("Unsupported format"));
      }

      loader.load(
        url,
        (result: any) => {
          const meshData: MeshInfo[] = [];
          const scene = result.scene || result;

          scene.traverse((child: any) => {
            if (child.isMesh) {
              meshData.push({
                name: child.name || `Mesh ${meshData.length + 1}`,
                materialName: child.material?.name,
                vertexCount: child.geometry?.attributes?.position?.count,
              });
            }
          });

          URL.revokeObjectURL(url);
          resolve(meshData);
        },
        undefined,
        (err: any) => {
          URL.revokeObjectURL(url);
          reject(err);
        },
      );
    });
  };

  const handleFileUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const extension = file.name.split(".").pop()?.toLowerCase();
      if (!["glb", "gltf", "fbx", "obj"].includes(extension || "")) {
        toast.error("Unsupported file format. Please upload GLB, FBX, or OBJ.");
        return;
      }

      const id = toast.loading(`Uploading and analyzing ${file.name}...`);

      try {
        const meshData = await analyzeMeshNames(file);

        const newModel: UploadedModel = {
          id: Math.random().toString(36).substring(7),
          name: file.name.split(".")[0],
          fileName: file.name,
          format: extension === "gltf" ? "glb" : (extension as any),
          fileUrl: URL.createObjectURL(file), // This only lasts for the session
          meshData: meshData,
          uploadedAt: Date.now(),
        };

        addModel(newModel);
        setActiveModelId(newModel.id);
        toast.success(`${file.name} uploaded successfully!`, { id });
      } catch (error) {
        console.error("Upload error:", error);
        toast.error(
          `Failed to load model: ${error instanceof Error ? error.message : "Unknown error"}`,
          { id },
        );
      }
    },
    [addModel, setActiveModelId],
  );

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-toolbar-border rounded-lg bg-toolbar-hover/20 hover:bg-toolbar-hover/40 transition-colors cursor-pointer relative group">
      <input
        type="file"
        accept=".glb,.gltf,.fbx,.obj"
        onChange={handleFileUpload}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="flex flex-col items-center gap-3 text-toolbar-muted group-hover:text-toolbar-foreground">
        <Upload className="w-10 h-10" />
        <div className="text-center">
          <p className="text-sm font-medium">
            Click or drag to upload 3D model
          </p>
          <p className="text-xs mt-1">GLB, FBX, or OBJ</p>
        </div>
      </div>
    </div>
  );
};
