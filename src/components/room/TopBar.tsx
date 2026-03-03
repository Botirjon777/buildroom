import React from "react";
import { useRoomStore } from "@/store/roomStore";
import { Camera, FileDown, RotateCcw, Box } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import jsPDF from "jspdf";

interface TopBarProps {
  onExportImage: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onExportImage }) => {
  const navigate = useNavigate();
  const { walls, furniture, lights, cables, roomWidth, roomDepth, roomHeight } =
    useRoomStore();

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

    // Dimension labels
    pdf.setFontSize(8);
    pdf.setTextColor(100);
    for (let x = 0; x <= roomWidth; x++) {
      pdf.text(`${x}m`, offsetX + x * scale - 3, offsetY - 2);
    }
    for (let z = 0; z <= roomDepth; z++) {
      pdf.text(`${z}m`, offsetX - 8, offsetY + z * scale + 2);
    }

    // Walls
    pdf.setDrawColor(40);
    pdf.setLineWidth(1.5);
    walls.forEach((wall) => {
      const x1 = offsetX + (wall.start[0] + roomWidth / 2) * scale;
      const y1 = offsetY + (wall.start[1] + roomDepth / 2) * scale;
      const x2 = offsetX + (wall.end[0] + roomWidth / 2) * scale;
      const y2 = offsetY + (wall.end[1] + roomDepth / 2) * scale;
      pdf.line(x1, y1, x2, y2);

      // Wall length
      const len = Math.sqrt(
        Math.pow(wall.end[0] - wall.start[0], 2) +
          Math.pow(wall.end[1] - wall.start[1], 2),
      ).toFixed(2);
      pdf.setFontSize(6);
      pdf.setTextColor(200, 50, 50);
      pdf.text(`${len}m`, (x1 + x2) / 2 + 2, (y1 + y2) / 2 - 2);
    });

    // Furniture
    pdf.setFontSize(6);
    furniture.forEach((item) => {
      const fx = offsetX + (item.position[0] + roomWidth / 2) * scale;
      const fy = offsetY + (item.position[2] + roomDepth / 2) * scale;
      pdf.setDrawColor(100, 100, 200);
      pdf.setLineWidth(0.3);
      pdf.rect(fx - 3, fy - 3, 6, 6);
      pdf.setTextColor(100, 100, 200);
      pdf.text(item.type, fx + 4, fy + 1);
    });

    // Cables
    cables.forEach((cable) => {
      const cx = offsetX + (cable.position[0] + roomWidth / 2) * scale;
      const cy = offsetY + (cable.position[2] + roomDepth / 2) * scale;
      pdf.setDrawColor(255, 200, 0);
      pdf.setFillColor(255, 200, 0);
      pdf.circle(cx, cy, 2, "F");
      pdf.setTextColor(180, 150, 0);
      pdf.text(cable.type, cx + 3, cy + 1);
    });

    // Legend
    const legendY = offsetY + roomDepth * scale + 10;
    pdf.setFontSize(8);
    pdf.setTextColor(0);
    pdf.text("Legend:", offsetX, legendY);
    pdf.setDrawColor(40);
    pdf.setLineWidth(1.5);
    pdf.line(offsetX + 20, legendY - 1, offsetX + 30, legendY - 1);
    pdf.text("Wall", offsetX + 32, legendY);
    pdf.setDrawColor(100, 100, 200);
    pdf.setLineWidth(0.3);
    pdf.rect(offsetX + 55, legendY - 3, 6, 6);
    pdf.text("Furniture", offsetX + 63, legendY);
    pdf.setFillColor(255, 200, 0);
    pdf.circle(offsetX + 95, legendY - 1, 2, "F");
    pdf.text("Cable Point", offsetX + 99, legendY);

    // Stats
    pdf.setFontSize(9);
    pdf.setTextColor(60);
    const statsY = legendY + 10;
    pdf.text(
      `Total Walls: ${walls.length}  |  Furniture: ${furniture.length}  |  Lights: ${lights.length}  |  Cable Points: ${cables.length}`,
      offsetX,
      statsY,
    );
    pdf.text(
      `Floor Area: ${(roomWidth * roomDepth).toFixed(1)} m²  |  Volume: ${(roomWidth * roomDepth * roomHeight).toFixed(1)} m³`,
      offsetX,
      statsY + 5,
    );

    pdf.save("room-plan.pdf");
  };

  return (
    <div className="h-10 toolbar-panel border-b border-toolbar-border flex items-center justify-between px-3">
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-toolbar-foreground tracking-wider">
          ROOM CONFIGURATOR
        </h1>
        <span className="text-toolbar-muted text-xs font-mono">
          {roomWidth}×{roomDepth}×{roomHeight}m
        </span>
      </div>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-toolbar-foreground hover:bg-toolbar-hover"
              onClick={onExportImage}
            >
              <Camera className="w-4 h-4 mr-1" />
              <span className="text-xs">Screenshot</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Save as image</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-toolbar-foreground hover:bg-toolbar-hover"
              onClick={exportPDF}
            >
              <FileDown className="w-4 h-4 mr-1" />
              <span className="text-xs">PDF Plan</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Export floor plan as PDF with measurements
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-primary hover:bg-primary/10 border border-primary/20 ml-2"
              onClick={() => navigate("/models")}
            >
              <Box className="w-4 h-4 mr-1" />
              <span className="text-xs font-bold uppercase tracking-tighter">
                Inspect 3D
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Open 3D Model Inspector</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default TopBar;
