"use client";

import { memo } from "react";
import { Terminal, X, Minus, Square } from "lucide-react";
import { useTerminal } from "../hooks/useTerminal";

export const Taskbar = memo(() => {
  const { 
    isVisible, 
    isMinimized, 
    isMaximized, 
    isClosed,
    openTerminal, 
    minimizeTerminal, 
    maximizeTerminal, 
    closeTerminal 
  } = useTerminal();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-md border-t border-white/10 z-40">
      <div className="flex items-center justify-between h-full px-4">
        {/* Left side - Terminal icon */}
        <div className="flex items-center space-x-2">
          <button
            onClick={isMinimized ? openTerminal : (isVisible ? minimizeTerminal : openTerminal)}
            className={`flex items-center justify-center w-8 h-8 rounded transition-all duration-200 ${
              isVisible && !isMinimized 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : isMinimized
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
            }`}
            title={isMinimized ? "Restore Terminal" : (isVisible ? "Minimize Terminal" : "Open Terminal")}
          >
            <Terminal size={16} />
          </button>
        </div>

        {/* Center - Window controls (when terminal is visible and not minimized) */}
        {isVisible && !isMinimized && (
          <div className="flex items-center space-x-1">
            <button
              onClick={minimizeTerminal}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
              title="Minimize"
            >
              <Minus size={12} />
            </button>
            <button
              onClick={maximizeTerminal}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 transition-colors"
              title={isMaximized ? "Restore" : "Maximize"}
            >
              <Square size={12} />
            </button>
            <button
              onClick={closeTerminal}
              className="w-6 h-6 flex items-center justify-center rounded hover:bg-red-500/20 hover:text-red-400 transition-colors"
              title="Close"
            >
              <X size={12} />
            </button>
          </div>
        )}

        {/* Right side - System info */}
        <div className="flex items-center space-x-4 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Online</span>
          </div>
          <div>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
});

Taskbar.displayName = 'Taskbar';
