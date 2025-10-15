"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type FocusedApp = "terminal" | "projects" | "start" | null;

type FocusManagerContextValue = {
  focusedApp: FocusedApp;
  setFocusedApp: (app: FocusedApp) => void;
  getZIndex: (app: FocusedApp) => number;
  getWindowPosition: (app: FocusedApp, windowSize: { width: number; height: number }) => { x: number; y: number };
};

const FocusManagerContext = createContext<FocusManagerContextValue | null>(null);

export const FocusManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const [focusedApp, setFocusedApp] = useState<FocusedApp>(null);
  const [openWindows, setOpenWindows] = useState<Set<FocusedApp>>(new Set());

  const getZIndex = useCallback((app: FocusedApp) => {
    // Start menu always on top when open
    if (app === "start") return 2000;
    
    // Base z-index for all app windows
    const baseZIndex = 100;
    
    // If this app is focused, it gets the highest z-index
    if (app === focusedApp) return baseZIndex + 200;
    
    // Otherwise, return base z-index
    return baseZIndex;
  }, [focusedApp]);

  const getWindowPosition = useCallback((app: FocusedApp, windowSize: { width: number; height: number }) => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const taskbarHeight = 48;
    const availableHeight = viewportHeight - taskbarHeight;
    
    // Ensure window stays within bounds
    const maxX = Math.max(20, viewportWidth - windowSize.width - 20);
    const maxY = Math.max(20, availableHeight - windowSize.height - 20);
    
    // Flexible positioning - windows can overlap and be repositioned
    switch (app) {
      case "terminal":
        return {
          x: Math.min(100, maxX),
          y: Math.min(100, maxY) // Top-left area
        };
      case "projects":
        return {
          x: Math.min(200, maxX), // Slightly offset from terminal
          y: Math.min(150, maxY) // Slightly offset vertically
        };
      default:
        return { x: 50, y: 50 };
    }
  }, []);

  const value = useMemo(() => ({ focusedApp, setFocusedApp, getZIndex, getWindowPosition }), [focusedApp, getZIndex, getWindowPosition]);

  return (
    <FocusManagerContext.Provider value={value}>{children}</FocusManagerContext.Provider>
  );
};

export const useFocusManager = () => {
  const ctx = useContext(FocusManagerContext);
  if (!ctx) throw new Error("useFocusManager must be used within a FocusManagerProvider");
  return ctx;
};
