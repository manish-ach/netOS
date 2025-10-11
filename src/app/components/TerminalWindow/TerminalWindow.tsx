"use client";

import { Minus, Maximize2, Minimize } from "lucide-react";
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

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    
    setFocused(true);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  }, [setFocused, isMaximized, position]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isMaximized) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Constrain to viewport bounds - allow more left movement
    const constrainedX = Math.max(-400, Math.min(window.innerWidth - 300, newX));
    const constrainedY = Math.max(-100, Math.min(window.innerHeight - 300, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  }, [isDragging, isMaximized, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

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

  if (!isVisible) return null;

  const transform = isMaximized 
    ? '' 
    : `translate(${position.x}px, ${position.y}px)`;

  return (
    <div
      onMouseDown={handleMouseDown}
      className={`${isMaximized ? 'fixed inset-y-4 inset-x-2 z-50' : 'fixed top-20 left-1/2 -translate-x-1/2 z-50'}
        ${isMaximized ? 'w-auto h-auto' : 'w-[700px] max-w-[90vw]'} 
        rounded-xl overflow-hidden
        shadow-[0_8px_40px_rgba(0,0,0,0.3)] backdrop-blur-md border transition-all duration-150 ease-out
        ${isFocused ? "border-blue-500/70 shadow-blue-500/30" : "border-gray-400/40 shadow-black/30"}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
      `}
      style={{ transform }}
    >
      {/* Title bar */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#21262d] border-b border-gray-700">
        <div className="text-gray-300 text-sm select-none font-mono">
          manish@portfolio:~ 
        </div>
        <div className="flex gap-2 text-gray-400">
          <button 
            onClick={closeTerminal}
            className="hover:text-gray-200 transition-colors"
            title="Minimize (Close)"
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
        </div>
      </div>

      {/* Terminal Body */}
      {!isMinimized && <TerminalBody />}
    </div>
  );
});

TerminalWindow.displayName = 'TerminalWindow';

export default TerminalWindow;
