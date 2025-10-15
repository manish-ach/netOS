"use client";

import { Minus, Maximize2, Minimize, X } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useProjects } from "../../hooks/useProjects";
import { useFocusManager } from "../../hooks/useFocusManager";

const ProjectsWindow = memo(() => {
  const {
    isFocused,
    setFocused,
    isVisible,
    isMinimized,
    isMaximized,
    minimizeProjects,
    maximizeProjects,
    closeProjects,
  } = useProjects();

  const { focusedApp, setFocusedApp, getZIndex, getWindowPosition } = useFocusManager();

  const [size, setSize] = useState({ width: 900, height: 600 });
  const [position, setPosition] = useState({ x: 80, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const newPosition = getWindowPosition("projects", size);
    setPosition(newPosition);
  }, [size.width, size.height]); // Only depend on size dimensions

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    setFocused(true);
    setFocusedApp("projects");
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [setFocused, setFocusedApp, isMaximized]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isMaximized) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = position.x + deltaX;
    const newY = position.y + deltaY;
    
    // Constrain to viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const taskbarHeight = 48;
    const availableHeight = viewportHeight - taskbarHeight;
    
    const constrainedX = Math.max(0, Math.min(viewportWidth - size.width, newX));
    const constrainedY = Math.max(0, Math.min(availableHeight - size.height, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, isMaximized, dragStart, position, size]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({ x: e.clientX, y: e.clientY, width: size.width, height: size.height });
  }, [isMaximized, size]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || isMaximized) return;
    const newWidth = Math.max(600, Math.min(1600, resizeStart.width + (e.clientX - resizeStart.x)));
    const newHeight = Math.max(400, Math.min(1000, resizeStart.height + (e.clientY - resizeStart.y)));
    setSize({ width: newWidth, height: newHeight });
  }, [isResizing, isMaximized, resizeStart]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleResizeMove, handleMouseUp]);

  if (!isVisible) return null;

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`${isMaximized ? 'fixed top-0 left-0 right-0' : 'fixed'} overflow-hidden relative
        ${isMaximized ? 'rounded-none' : 'rounded-xl'}
        ${isMaximized ? '' : 'shadow-[0_8px_40px_rgba(0,0,0,0.3)]'} backdrop-blur-md border transition-all duration-150 ease-out
        ${focusedApp === "projects" ? "border-purple-500/70 shadow-purple-500/30" : "border-gray-400/40 shadow-black/30"}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${isResizing ? 'cursor-nw-resize' : ''}
        ${isMinimized ? 'hidden' : ''}
        pointer-events-auto
      `}
      style={{ 
        left: isMaximized ? '0' : `${position.x}px`,
        top: isMaximized ? '0' : `${position.y}px`,
        width: isMaximized ? '100vw' : `${size.width}px`,
        height: isMaximized ? 'calc(100vh - 48px)' : `${size.height}px`,
        zIndex: getZIndex("projects")
      }}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#21262d] border-b border-gray-700">
        <div className="text-gray-300 text-sm select-none font-mono">Projects</div>
        <div className="flex gap-2 text-gray-400">
          <button 
            onClick={minimizeProjects}
            className="hover:text-gray-200 transition-colors"
            title="Minimize"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={maximizeProjects}
            className="hover:text-gray-200 transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            onClick={closeProjects}
            className="hover:text-red-400 transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Projects Body */}
      <div className="w-full h-full bg-[#0d1117] p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500/40 to-purple-500/40 border border-white/10 flex items-center justify-center text-white text-sm font-semibold">
                DP
              </div>
              <div>
                <div className="text-gray-100 text-sm">Demo Project</div>
                <div className="text-gray-400 text-xs">A sample project card</div>
              </div>
            </div>
            <div className="text-xs text-gray-300 mb-3">
              Replace this with your real projects. You can render a list and link out.
            </div>
            <div className="flex items-center gap-2">
              <a
                href="#projects"
                className="text-xs px-3 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30"
              >
                View more
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noreferrer"
                className="text-xs px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200"
              >
                Source
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Resize handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-3 h-3 cursor-nw-resize opacity-60 hover:opacity-100 transition-opacity z-10"
          style={{
            background: 'linear-gradient(-45deg, transparent 30%, #4a5568 30%, #4a5568 50%, transparent 50%)',
            transform: 'translate(1px, 1px)'
          }}
        />
      )}
    </div>
  );
});

ProjectsWindow.displayName = 'ProjectsWindow';

export default ProjectsWindow;


