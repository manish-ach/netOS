"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type FocusedApp = "terminal" | "projects" | "start" | null;

type FocusManagerContextValue = {
  focusedApp: FocusedApp;
  setFocusedApp: (app: FocusedApp) => void;
  getZIndex: (app: FocusedApp) => number;
  getWindowPosition: (app: FocusedApp, windowSize: { width: number; height: number }) => { x: number; y: number };
  bringToFront: (app: FocusedApp) => void;
  resizingApp: FocusedApp;
  setResizingApp: (app: FocusedApp) => void;
};

const FocusManagerContext = createContext<FocusManagerContextValue | null>(null);

export const FocusManagerProvider = ({ children }: { children: React.ReactNode }) => {
  const [focusedApp, setFocusedApp] = useState<FocusedApp>(null);
  const [windowStack, setWindowStack] = useState<FocusedApp[]>([]);
  const [resizingApp, setResizingApp] = useState<FocusedApp>(null);

  const getZIndex = useCallback((app: FocusedApp) => {
    // Start menu always on top when open
    if (app === "start") return 2000;
    
    // Base z-index for app windows
    const baseZIndex = 100;
    
    // Find the position of this app in the stack
    const stackIndex = windowStack.indexOf(app);
    
    if (stackIndex === -1) {
      // App not in stack, give it a low z-index
      return baseZIndex;
    }
    
    // Each window gets a unique z-index based on its position in the stack
    // Earlier in stack (more front) => higher z-index
    return baseZIndex + (windowStack.length - stackIndex) * 10;
  }, [windowStack]);

  const bringToFront = useCallback((app: FocusedApp) => {
    if (!app || app === "start") return;
    
    setWindowStack(prev => {
      // Remove app from current position and add to front
      const newStack = prev.filter(a => a !== app);
      return [app, ...newStack];
    });
    setFocusedApp(app);
  }, []);

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

  const value = useMemo(() => ({ focusedApp, setFocusedApp, getZIndex, getWindowPosition, bringToFront, resizingApp, setResizingApp }), [focusedApp, getZIndex, getWindowPosition, bringToFront, resizingApp]);

  return (
    <FocusManagerContext.Provider value={value}>{children}</FocusManagerContext.Provider>
  );
};

export const useFocusManager = () => {
  const ctx = useContext(FocusManagerContext);
  if (!ctx) throw new Error("useFocusManager must be used within a FocusManagerProvider");
  return ctx;
};
