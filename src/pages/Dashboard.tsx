import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Layout,
  Clock,
  Loader2,
  Folder,
  ArrowRight,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  useProjects,
  useDeleteProject,
  useCreateProject,
} from "@/hooks/useProjects";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { toast } from "sonner";
import { CreateProjectModal } from "@/components/dashboard/CreateProjectModal";
import { formatDistanceToNow } from "date-fns";

const Dashboard = () => {
  const { userInfo } = useAuthStore();
  const { data: projects = [], isLoading: loading } = useProjects();
  const { mutateAsync: createProject, isPending: isCreating } =
    useCreateProject();
  const { mutateAsync: deleteProject } = useDeleteProject();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateProject = () => {
    setIsModalOpen(true);
  };

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

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        toast.success("Project deleted");
      } catch (err) {
        toast.error("Failed to delete project");
      }
    }
  };

  if (!userInfo) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black mb-2">My Projects</h1>
            <p className="text-white/40 text-lg">
              Manage and create your 3D room designs.
            </p>
          </div>
          <Button
            onClick={handleCreateProject}
            disabled={isCreating}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold h-14 px-8 rounded-2xl shadow-xl shadow-purple-500/20"
          >
            {isCreating ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Plus className="w-5 h-5 mr-2" />
            )}
            Create New Project
          </Button>
        </div>

        {loading && projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-white/20">
            <Loader2 className="w-12 h-12 animate-spin mb-4" />
            <p className="text-xl font-medium">Loading your projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-40 text-center rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02]">
            <Folder className="w-20 h-20 text-white/10 mb-6" />
            <h2 className="text-2xl font-bold mb-2">No projects yet</h2>
            <p className="text-white/40 max-w-sm mb-8">
              Start your first interior design project today and transform your
              ideas into 3D reality.
            </p>
            <Button
              onClick={handleCreateProject}
              className="bg-white text-black hover:bg-white/90"
            >
              Get Started
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card
                key={project._id}
                className="group relative border-white/5 bg-white/5 hover:bg-white/[0.08] backdrop-blur-xl transition-all duration-300 cursor-pointer overflow-hidden rounded-3xl"
                onClick={() => navigate(`/configurator/${project._id}`)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                      <Layout className="w-6 h-6 text-purple-400" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteProject(project._id, e)}
                      className="text-white/20 hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">
                    {project.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-6">
                  <div className="flex items-center gap-4 text-sm text-white/30">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Folder className="w-4 h-4" />
                      Active
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full flex items-center justify-between text-sm font-bold text-purple-400">
                    <span>Open Project</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
      <CreateProjectModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleModalSubmit}
        isLoading={isCreating}
      />
    </div>
  );
};

export default Dashboard;
