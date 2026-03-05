import React from "react";
import { useRoomStore } from "@/store/roomStore";
import {
  Camera,
  FileDown,
  Box,
  Layout,
  FilePlus,
  Copy,
  Save,
  Download,
  Edit2,
  Eye,
  Layers,
  Sun,
  Moon,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
} from "@/components/ui/menubar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import jsPDF from "jspdf";

interface TopBarProps {
  projectName?: string;
  onExportImage: () => void;
  onSave?: () => void;
  onSaveAs?: () => void;
  onNew?: () => void;
  onClone?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  onClear?: () => void;
  onRename?: (newName: string) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  projectName = "Untitled Project",
  onExportImage,
  onSave,
  onSaveAs,
  onNew,
  onClone,
  onImport,
  onExport,
  onClear,
  onRename,
}) => {
  const navigate = useNavigate();
  const {
    roomWidth,
    roomDepth,
    roomHeight,
    walls,
    furniture,
    lights,
    cables,
    viewMode,
    setViewMode,
    showGrid,
    toggleGrid,
    theme,
    setTheme,
  } = useRoomStore();

  const exportPDF = () => {
    const pdf = new jsPDF("landscape", "mm", "a4");
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();

    // Title
    pdf.setFontSize(20);
    pdf.text("Room Floor Plan", pageW / 2, 15, { align: "center" });

    pdf.setFontSize(10);
    pdf.text(
      `Room: ${roomWidth}m × ${roomDepth}m × ${roomHeight}m`,
      pageW / 2,
      22,
      { align: "center" },
    );

    // Draw floor plan
    const scale = Math.min((pageW - 40) / roomWidth, (pageH - 60) / roomDepth);
    const offsetX = (pageW - roomWidth * scale) / 2;
    const offsetY = 35;

    // Room outline
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.5);
    pdf.rect(offsetX, offsetY, roomWidth * scale, roomDepth * scale);

    // Grid
    pdf.setDrawColor(200);
    pdf.setLineWidth(0.1);
    for (let x = 0; x <= roomWidth; x++) {
      pdf.line(
        offsetX + x * scale,
        offsetY,
        offsetX + x * scale,
        offsetY + roomDepth * scale,
      );
    }
    for (let z = 0; z <= roomDepth; z++) {
      pdf.line(
        offsetX,
        offsetY + z * scale,
        offsetX + roomWidth * scale,
        offsetY + z * scale,
      );
    }

    // Legend & Stats
    pdf.setFontSize(8);
    pdf.text(
      `Project: ${projectName}`,
      offsetX,
      offsetY + roomDepth * scale + 10,
    );

    pdf.save(`${projectName.replace(/\s+/g, "-").toLowerCase()}-plan.pdf`);
  };

  return (
    <div className="h-14 toolbar-panel border-b border-toolbar-border flex items-center justify-between px-4 bg-[#0D0D0F]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/5 transition-colors group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layout className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest leading-none mb-1">
              Dream Design
            </span>
            <button
              onClick={() => {
                const newName = prompt("Rename project to:", projectName);
                if (newName && newName !== projectName) {
                  onRename?.(newName);
                }
              }}
              className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors text-left flex items-center gap-1.5"
            >
              {projectName}
              <Edit2 className="w-3 h-3 text-white/20 group-hover:text-indigo-400 transition-colors" />
            </button>
          </div>
        </div>

        <Menubar className="bg-transparent border-none shadow-none text-white/50 space-x-1">
          <MenubarMenu>
            <MenubarTrigger className="hover:bg-white/5 data-[state=open]:bg-white/5 data-[state=open]:text-white cursor-pointer px-3 h-8 text-xs font-medium">
              File
            </MenubarTrigger>
            <MenubarContent className="bg-[#0D0D0F] border-white/10 text-white min-w-[200px]">
              <MenubarItem
                onClick={onNew}
                className="cursor-pointer focus:bg-white/5"
              >
                <FilePlus className="w-4 h-4 mr-2 text-white/40" /> New Project{" "}
                <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem
                onClick={onClone}
                className="cursor-pointer focus:bg-white/5"
              >
                <Copy className="w-4 h-4 mr-2 text-white/40" /> Clone Project
              </MenubarItem>
              <MenubarSeparator className="bg-white/5" />
              <MenubarItem
                onClick={onSave}
                className="cursor-pointer focus:bg-white/5"
              >
                <Save className="w-4 h-4 mr-2 text-white/40" /> Save{" "}
                <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarItem
                onClick={onSaveAs}
                className="cursor-pointer focus:bg-white/5"
              >
                <Save className="w-4 h-4 mr-2 text-white/40" /> Save As...{" "}
                <MenubarShortcut>⇧⌘S</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator className="bg-white/5" />
              <MenubarSub>
                <MenubarSubTrigger className="cursor-pointer focus:bg-white/5">
                  <Download className="w-4 h-4 mr-2 text-white/40" /> Export
                </MenubarSubTrigger>
                <MenubarSubContent className="bg-[#0D0D0F] border-white/10 text-white">
                  <MenubarItem
                    onClick={onExportImage}
                    className="cursor-pointer focus:bg-white/5"
                  >
                    PNG Image
                  </MenubarItem>
                  <MenubarItem
                    onClick={exportPDF}
                    className="cursor-pointer focus:bg-white/5"
                  >
                    PDF Plan
                  </MenubarItem>
                  <MenubarItem
                    onClick={onExport}
                    className="cursor-pointer focus:bg-white/5"
                  >
                    Project JSON
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarItem
                onClick={onImport}
                className="cursor-pointer focus:bg-white/5"
              >
                <FileDown className="w-4 h-4 mr-2 text-white/40" /> Import
                Project
              </MenubarItem>
              <MenubarItem
                onClick={() => navigate("/models")}
                className="cursor-pointer focus:bg-white/5"
              >
                <Search className="w-4 h-4 mr-2 text-white/40" /> Inspect Models
              </MenubarItem>
              <MenubarSeparator className="bg-white/5" />
              <MenubarItem
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer focus:bg-white/5"
              >
                Exit to Dashboard
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="hover:bg-white/5 data-[state=open]:bg-white/5 data-[state=open]:text-white cursor-pointer px-3 h-8 text-xs font-medium">
              Edit
            </MenubarTrigger>
            <MenubarContent className="bg-[#0D0D0F] border-white/10 text-white min-w-[160px]">
              <MenubarItem className="cursor-pointer focus:bg-white/5">
                Undo <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem className="cursor-pointer focus:bg-white/5">
                Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator className="bg-white/5" />
              <MenubarItem
                onClick={onClear}
                className="cursor-pointer focus:bg-white/5 text-red-400 focus:text-red-400"
              >
                Clear Room
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="hover:bg-white/5 data-[state=open]:bg-white/5 data-[state=open]:text-white cursor-pointer px-3 h-8 text-xs font-medium">
              View
            </MenubarTrigger>
            <MenubarContent className="bg-[#0D0D0F] border-white/10 text-white min-w-[160px]">
              <MenubarItem
                onClick={() => setViewMode?.("3d")}
                className={`cursor-pointer focus:bg-white/5 ${viewMode === "3d" ? "text-purple-400" : ""}`}
              >
                <Box className="w-4 h-4 mr-2" /> 3D View
                {viewMode === "3d" && <MenubarShortcut>✓</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem
                onClick={() => setViewMode?.("2d")}
                className={`cursor-pointer focus:bg-white/5 ${viewMode === "2d" ? "text-blue-400" : ""}`}
              >
                <Layers className="w-4 h-4 mr-2" /> 2D Floor Plan
                {viewMode === "2d" && <MenubarShortcut>✓</MenubarShortcut>}
              </MenubarItem>
              <MenubarSeparator className="bg-white/5" />
              <MenubarItem
                onClick={() => setViewMode?.("render")}
                className={`cursor-pointer focus:bg-white/5 ${viewMode === "render" ? "text-green-400" : ""}`}
              >
                <Eye className="w-4 h-4 mr-2" /> Render Preview
                {viewMode === "render" && <MenubarShortcut>✓</MenubarShortcut>}
              </MenubarItem>
              <MenubarSeparator className="bg-white/5" />
              <MenubarItem
                onClick={toggleGrid}
                className="cursor-pointer focus:bg-white/5"
              >
                <Layout className="w-4 h-4 mr-2" />{" "}
                {showGrid ? "Hide Grid" : "Show Grid"}
                {showGrid && <MenubarShortcut>✓</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="cursor-pointer focus:bg-white/5"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 mr-2" />
                ) : (
                  <Moon className="w-4 h-4 mr-2" />
                )}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="hover:bg-white/5 data-[state=open]:bg-white/5 data-[state=open]:text-white cursor-pointer px-3 h-8 text-xs font-medium">
              Help
            </MenubarTrigger>
            <MenubarContent className="bg-[#0D0D0F] border-white/10 text-white min-w-[160px]">
              <MenubarItem className="cursor-pointer focus:bg-white/5">
                Documentation
              </MenubarItem>
              <MenubarItem className="cursor-pointer focus:bg-white/5">
                Keyboard Shortcuts
              </MenubarItem>
              <MenubarSeparator className="bg-white/5" />
              <MenubarItem className="cursor-pointer focus:bg-white/5">
                About DreamDesign
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white/5 rounded-full px-2 py-1 gap-2 mr-2">
          <div
            className={`w-1.5 h-1.5 rounded-full ${viewMode === "3d" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : viewMode === "2d" ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" : "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]"}`}
          />
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-none">
            {viewMode === "render" ? "Cinema Render" : `${viewMode} View`}
          </span>
        </div>
        <span className="text-white/20 text-xs font-mono mr-4">
          {roomWidth}×{roomDepth}×{roomHeight}m
        </span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/5"
              onClick={onSave}
            >
              <Save className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save Project</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-white/40 hover:text-white hover:bg-white/5"
              onClick={onExportImage}
            >
              <Camera className="w-4 h-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Screenshot</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default TopBar;
