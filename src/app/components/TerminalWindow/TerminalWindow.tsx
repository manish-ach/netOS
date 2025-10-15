"use client";

import { Minus, Maximize2, Minimize, X } from "lucide-react";
import { TerminalBody } from "./TerminalBody";
import { useTerminal } from "../../hooks/useTerminal";
import { useFocusManager } from "../../hooks/useFocusManager";
import { memo, useCallback, useState, useEffect } from "react";

const TerminalWindow = memo(() => {
  const { 
    isFocused, 
    setFocused, 
    isVisible, 
    isMinimized, 
    isMaximized,
    minimizeTerminal,
    maximizeTerminal,
    closeTerminal 
  } = useTerminal();

  const { focusedApp, setFocusedApp, getZIndex, getWindowPosition, bringToFront } = useFocusManager();

  const [size, setSize] = useState({ width: 900, height: 710 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Set initial position only once on mount
  useEffect(() => {
    const newPosition = getWindowPosition("terminal", size);
    setPosition(newPosition);
  }, []); // Only run once on mount

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    
    setFocused(true);
    bringToFront("terminal");
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  }, [setFocused, bringToFront, isMaximized]);

  // Allow dragging from anywhere except interactive elements or while resizing
  const handleContainerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    const target = e.target as HTMLElement;
    // Skip drag when interacting with inputs/controls or contenteditable regions
    if (target.closest('input, textarea, button, a, select, [data-nodrag], [contenteditable="true"]')) {
      return;
    }
    // If resize handle initiated, it will stopPropagation already
    setFocused(true);
    bringToFront("terminal");
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isMaximized, setFocused, bringToFront]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isMaximized) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = position.x + deltaX;
    const newY = position.y + deltaY;
    
    // No viewport constraints - allow free movement
    setPosition({ x: newX, y: newY });
    
    // Update drag start for next frame
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, isMaximized, dragStart, position]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
  }, []);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  }, [isMaximized, size]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || isMaximized) return;
    
    const newWidth = Math.max(600, Math.min(1600, resizeStart.width + (e.clientX - resizeStart.x)));
    const newHeight = Math.max(400, Math.min(1000, resizeStart.height + (e.clientY - resizeStart.y)));
    
    // Direct update for immediate response
    setSize({ width: newWidth, height: newHeight });
  }, [isResizing, isMaximized, resizeStart]);

  // Add/remove mouse event listeners
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
      onMouseDown={handleContainerMouseDown}
      className={`${isMaximized ? 'fixed top-0 left-0 right-0' : 'fixed'} overflow-hidden relative
        ${isMaximized ? 'rounded-none' : 'rounded-xl'}
        ${isMaximized ? '' : 'shadow-[0_8px_40px_rgba(0,0,0,0.3)]'} backdrop-blur-md border
        ${focusedApp === "terminal" ? "border-blue-500/70 shadow-blue-500/30" : "border-gray-400/40 shadow-black/30"}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${isResizing ? 'cursor-se-resize' : ''}
        ${isMinimized ? 'hidden' : ''}
        pointer-events-auto
        select-none
        flex flex-col
      `}
      style={{ 
        left: isMaximized ? '0' : `${position.x}px`,
        top: isMaximized ? '0' : `${position.y}px`,
        width: isMaximized ? '100vw' : `${size.width}px`,
        height: isMaximized ? 'calc(100vh - 48px)' : `${size.height}px`, // Account for taskbar
        zIndex: getZIndex("terminal")
      }}
    >
      {/* Title bar */}
      <div onMouseDown={handleMouseDown} className="flex items-center justify-between px-3 py-2 bg-[#21262d] border-b border-gray-700">
        <div className="text-gray-300 text-sm select-none font-mono">
          manish@portfolio:~ 
        </div>
        <div className="flex gap-2 text-gray-400">
          <button 
            onClick={minimizeTerminal}
            className="hover:text-gray-200 transition-colors"
            title="Minimize"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={maximizeTerminal}
            className="hover:text-gray-200 transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            onClick={closeTerminal}
            className="hover:text-red-400 transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="flex-1 min-h-0">
        <TerminalBody />
      </div>
      
      {/* Resize handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-60 hover:opacity-100 transition-opacity z-10"
          style={{
            background: 'linear-gradient(-45deg, transparent 30%, #4a5568 30%, #4a5568 50%, transparent 50%)',
            transform: 'translate(1px, 1px)'
          }}
        />
      )}
    </div>
  );
});

TerminalWindow.displayName = 'TerminalWindow';

export default TerminalWindow;
