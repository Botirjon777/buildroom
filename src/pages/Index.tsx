import React, { useRef, useCallback, useEffect, useState } from "react";
import Toolbar from "@/components/room/Toolbar";
import PropertiesPanel from "@/components/room/PropertiesPanel";
import TopBar from "@/components/room/TopBar";
import StatusBar from "@/components/room/StatusBar";
import RoomViewport3D from "@/components/room/RoomViewport3D";
import { useRoomStore } from "@/store/roomStore";
import { useParams, useNavigate } from "react-router-dom";
import {
  useProject,
  useUpdateProject,
  useCreateProject,
} from "@/hooks/useProjects";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CreateProjectModal } from "@/components/dashboard/CreateProjectModal";
import { CoordinateWidget } from "@/components/room/CoordinateWidget";

const Index = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: currentProject, isLoading: loading } = useProject(projectId);
  const { mutate: updateProjectMutate } = useUpdateProject();
  const { mutateAsync: createProject, isPending: isCreating } =
    useCreateProject();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useRoomStore();

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  // Sync room store with current project data
  useEffect(() => {
    if (currentProject?.data) {
      const store = useRoomStore.getState();
      const { data } = currentProject;

      // Load room dimensions if they exist in project data
      if (data.roomWidth && data.roomDepth) {
        store.setRoomDimensions(
          data.roomWidth,
          data.roomDepth,
          data.roomHeight || 3,
        );
      }

      // Load other data
      if (data.walls) store.setWalls(data.walls);
      if (data.furniture) store.setFurniture(data.furniture);
      if (data.lights) store.setLights(data.lights);
      if (data.cables) store.setCables(data.cables || []);

      console.log("Loaded project data:", data);
    }
  }, [currentProject]);

  // Auto-save logic (simplified)
  useEffect(() => {
    const timer = setInterval(() => {
      if (currentProject && projectId) {
        const store = useRoomStore.getState();
        const data = {
          walls: store.walls,
          furniture: store.furniture,
          lights: store.lights,
        };
        updateProjectMutate({
          id: projectId,
          projectData: { name: currentProject.name, data },
        });
      }
    }, 30000);

    return () => clearInterval(timer);
  }, [currentProject, projectId, updateProjectMutate]);

  const handleExportImage = useCallback(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.download = "room-render.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const store = useRoomStore.getState();
      if (e.key === "Delete" || e.key === "Backspace") {
        store.deleteSelected();
      }
      if (e.key === "Escape") {
        store.setTool("select");
        store.setSelectedId(null);
      }
      if (e.key === "w") store.setTool("wall");
      if (e.key === "p") store.setTool("paint");
      if (e.key === "f") store.setTool("furniture");
      if (e.key === "l") store.setTool("lighting");
      if (e.key === "v") store.setTool("select");
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleRename = useCallback(
    (newName: string) => {
      if (projectId) {
        updateProjectMutate(
          {
            id: projectId,
            projectData: { name: newName },
          },
          {
            onSuccess: () => {
              toast.success("Project renamed");
            },
            onError: () => {
              toast.error("Failed to rename project");
            },
          },
        );
      }
    },
    [projectId, updateProjectMutate],
  );

  const handleSave = useCallback(() => {
    if (currentProject && projectId) {
      const store = useRoomStore.getState();
      const data = {
        walls: store.walls,
        furniture: store.furniture,
        lights: store.lights,
        cables: store.cables,
      };
      updateProjectMutate({
        id: projectId,
        projectData: { name: currentProject.name, data },
      });
      toast.success("Project saved successfully");
    }
  }, [currentProject, projectId, updateProjectMutate]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-save logic (simplified)
  // ... (auto-save useEffect)

  // ... (shortcuts useEffect)

  const handleNew = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleModalSubmit = async (values: any) => {
    try {
      const newProject = await createProject({
        name: values.name,
        data: {
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
          ],
          cables: [],
          roomWidth: values.width,
          roomDepth: values.depth,
          roomType: values.type,
        },
      });
      setIsModalOpen(false);
      navigate(`/configurator/${newProject._id}`);
    } catch (err) {
      toast.error("Failed to create project");
    }
  };

  const handleSaveAs = useCallback(() => {
    const newName = prompt(
      "Enter new project name:",
      `${currentProject?.name} (Copy)`,
    );
    if (newName && projectId) {
      const store = useRoomStore.getState();
      const data = {
        walls: store.walls,
        furniture: store.furniture,
        lights: store.lights,
        cables: store.cables,
      };
      createProject({ name: newName, data }).then((np) => {
        toast.success("Project saved as new!");
        navigate(`/configurator/${np._id}`);
      });
    }
  }, [currentProject, projectId, createProject, navigate]);

  const handleExport = useCallback(() => {
    const store = useRoomStore.getState();
    const data = {
      name: currentProject?.name,
      data: {
        walls: store.walls,
        furniture: store.furniture,
        lights: store.lights,
        cables: store.cables,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentProject?.name || "project"}.json`;
    link.click();
  }, [currentProject]);

  const handleImport = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (re: any) => {
        try {
          const imported = JSON.parse(re.target.result);
          if (imported.data) {
            const store = useRoomStore.getState();
            store.setWalls(imported.data.walls || []);
            store.setFurniture(imported.data.furniture || []);
            store.setLights(imported.data.lights || []);
            store.setCables(imported.data.cables || []);
            toast.success("Project imported!");
          }
        } catch (err) {
          toast.error("Invalid project file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, []);

  const handleClear = useCallback(() => {
    if (confirm("Clear entire room? This cannot be undone.")) {
      useRoomStore.getState().clearRoom();
      toast.success("Room cleared");
    }
  }, []);

  const handleClone = useCallback(async () => {
    if (currentProject) {
      try {
        const clonedProject = await createProject({
          name: `${currentProject.name} (Copy)`,
          data: currentProject.data,
        });
        toast.success("Project cloned!");
        navigate(`/configurator/${clonedProject._id}`);
      } catch (err) {
        toast.error("Failed to clone project");
      }
    }
  }, [currentProject, createProject, navigate]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#0A0A0B] text-white">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500" />
        <p className="text-xl font-medium tracking-tight ml-4">
          Opening your masterpiece...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#0A0A0B] text-foreground">
      <TopBar
        projectName={currentProject?.name}
        onExportImage={handleExportImage}
        onSave={handleSave}
        onSaveAs={handleSaveAs}
        onNew={handleNew}
        onClone={handleClone}
        onImport={handleImport}
        onExport={handleExport}
        onClear={handleClear}
        onRename={handleRename}
      />
      <CreateProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleModalSubmit}
        isLoading={isCreating}
      />
      <div className="flex-1 flex overflow-hidden">
        <Toolbar />
        <div className="flex-1 relative">
          <RoomViewport3D canvasRef={canvasRef} />
        </div>
        <PropertiesPanel />
      </div>
      <StatusBar />
      <CoordinateWidget />
    </div>
  );
};

export default Index;
