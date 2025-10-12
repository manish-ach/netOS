"use client";

import { Minus, Maximize2, Minimize, X } from "lucide-react";
import { TerminalBody } from "./TerminalBody";
import { useTerminal } from "../../hooks/useTerminal";
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

  const [size, setSize] = useState({ width: 900, height: 710 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  // Simple centering on mount, accounting for taskbar
  useEffect(() => {
    const centerX = (window.innerWidth - size.width) / 2;
    const centerY = (window.innerHeight - size.height - 48) / 2; // Account for 48px taskbar
    setPosition({ x: centerX, y: centerY });
  }, []); // Only run once on mount

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    
    setFocused(true);
    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY
    });
  }, [setFocused, isMaximized]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isMaximized) return;
    
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = position.x + deltaX;
    const newY = position.y + deltaY;
    
    // Allow dragging beyond viewport bounds for full access
    const constrainedX = newX;
    const constrainedY = newY;
    
    setPosition({ x: constrainedX, y: constrainedY });
    
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
      onMouseDown={handleMouseDown}
      className={`${isMaximized ? 'fixed top-0 left-0 right-0 z-50' : 'fixed z-50'}
        ${isMaximized ? 'rounded-none' : 'rounded-xl'} overflow-hidden relative
        ${isMaximized ? '' : 'shadow-[0_8px_40px_rgba(0,0,0,0.3)]'} backdrop-blur-md border transition-all duration-150 ease-out
        ${isFocused ? "border-blue-500/70 shadow-blue-500/30" : "border-gray-400/40 shadow-black/30"}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${isResizing ? 'cursor-nw-resize' : ''}
        ${isMinimized ? 'hidden' : ''}
      `}
      style={{ 
        left: isMaximized ? '0' : `${position.x}px`,
        top: isMaximized ? '0' : `${position.y}px`,
        width: isMaximized ? '100vw' : `${size.width}px`,
        height: isMaximized ? 'calc(100vh - 48px)' : `${size.height}px` // Account for taskbar
      }}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#21262d] border-b border-gray-700">
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
      <TerminalBody />
      
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

TerminalWindow.displayName = 'TerminalWindow';

export default TerminalWindow;
