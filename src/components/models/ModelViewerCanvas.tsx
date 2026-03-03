import React, { Suspense, useMemo, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import {
  OrbitControls,
  Grid,
  Environment,
  TransformControls,
  useGLTF,
  useFBX,
  ContactShadows,
} from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useModelStore } from "@/store/modelStore";
import * as THREE from "three";

const ModelRenderer: React.FC<{ model: any; format: string }> = ({
  model,
  format,
}) => {
  const {
    selectedMeshName,
    setSelectedMeshName,
    selectedMeshColor,
    selectedMeshTexture,
    transformMode,
  } = useModelStore();

  const scene = useMemo(() => {
    if (format === "glb") return model.scene;
    return model;
  }, [model, format]);

  // Apply colors and textures to selected mesh
  useEffect(() => {
    if (!scene) return;

    scene.traverse((child: any) => {
      if (child.isMesh && child.name === selectedMeshName) {
        if (child.material) {
          // Clone material to avoid affecting other meshes that share it
          if (!child.material._cloned) {
            child.material = child.material.clone();
            child.material._cloned = true;
          }

          if (selectedMeshColor) {
            child.material.color.set(selectedMeshColor);
          }

          if (selectedMeshTexture) {
            const loader = new THREE.TextureLoader();
            loader.load(selectedMeshTexture, (tex) => {
              child.material.map = tex;
              child.material.needsUpdate = true;
            });
          }
        }
      }

      // Update emissive for selection highlight
      if (child.isMesh) {
        if (child.name === selectedMeshName) {
          child.material.emissive?.set("#00aa88");
          child.material.emissiveIntensity = 0.5;
        } else {
          child.material.emissive?.set("#000000");
          child.material.emissiveIntensity = 0;
        }
      }
    });
  }, [scene, selectedMeshName, selectedMeshColor, selectedMeshTexture]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    if (e.object && e.object.isMesh) {
      setSelectedMeshName(e.object.name);
    }
  };

  return (
    <TransformControls mode={transformMode}>
      <primitive
        object={scene}
        onPointerDown={handlePointerDown}
        scale={[1, 1, 1]}
      />
    </TransformControls>
  );
};

const DynamicModel: React.FC<{ url: string; format: string }> = ({
  url,
  format,
}) => {
  if (format === "glb") {
    const gltf = useGLTF(
      url,
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
    );
    return <ModelRenderer model={gltf} format="glb" />;
  }
  if (format === "fbx") {
    const fbx = useFBX(url);
    return <ModelRenderer model={fbx} format="fbx" />;
  }
  if (format === "obj") {
    const obj = useLoader(OBJLoader, url);
    return <ModelRenderer model={obj} format="obj" />;
  }
  return null;
};

export const ModelViewerCanvas: React.FC = () => {
  const { activeModelId, models } = useModelStore();
  const activeModel = models.find((m) => m.id === activeModelId);

  return (
    <div className="w-full h-full bg-viewport relative">
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 45 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />

          {activeModel && (
            <DynamicModel
              key={activeModel.id}
              url={activeModel.fileUrl}
              format={activeModel.format}
            />
          )}

          <ContactShadows
            position={[0, 0, 0]}
            opacity={0.4}
            scale={10}
            blur={2}
            far={10}
            resolution={256}
            color="#000000"
          />

          <Grid
            args={[10, 10]}
            position={[0, -0.01, 0]}
            cellSize={0.5}
            cellThickness={0.5}
            cellColor="#c0c0c0"
            sectionSize={1}
            sectionThickness={1}
            sectionColor="#909090"
            fadeDistance={25}
            fadeStrength={1}
          />

          <OrbitControls makeDefault minDistance={1} maxDistance={20} />
        </Suspense>
      </Canvas>

      {!activeModel && (
        <div className="absolute inset-0 flex items-center justify-center text-toolbar-muted bg-viewport/50 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-lg font-medium">No Model Loaded</p>
            <p className="text-sm">
              Select a model from the library or upload a new one
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
