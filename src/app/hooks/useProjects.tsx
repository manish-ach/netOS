"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ProjectsContextValue = {
  isFocused: boolean;
  setFocused: (value: boolean) => void;
  isVisible: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isClosed: boolean;
  minimizeProjects: () => void;
  maximizeProjects: () => void;
  closeProjects: () => void;
  openProjects: () => void;
};

const ProjectsContext = createContext<ProjectsContextValue | null>(null);

export const ProjectsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isFocused, setFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClosed, setIsClosed] = useState(true);

  const minimizeProjects = useCallback(() => {
    setIsMinimized(true);
    setFocused(false);
  }, []);

  const maximizeProjects = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  const closeProjects = useCallback(() => {
    setIsVisible(false);
    setIsClosed(true);
    setFocused(false);
  }, []);

  const openProjects = useCallback(() => {
    setIsVisible(true);
    setIsMinimized(false);
    setIsClosed(false);
    setFocused(true);
  }, []);

  const value = useMemo((): ProjectsContextValue => ({
    isFocused,
    setFocused,
    isVisible,
    isMinimized,
    isMaximized,
    isClosed,
    minimizeProjects,
    maximizeProjects,
    closeProjects,
    openProjects,
  }), [isFocused, isVisible, isMinimized, isMaximized, isClosed, minimizeProjects, maximizeProjects, closeProjects, openProjects]);

  return (
    <ProjectsContext.Provider value={value}>{children}</ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within a ProjectsProvider");
  return ctx;
};


