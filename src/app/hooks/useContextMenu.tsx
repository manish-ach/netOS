"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

type MenuItem = {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
};

type ContextMenuState = {
  isOpen: boolean;
  x: number;
  y: number;
  items: MenuItem[];
};

type ContextMenuContextValue = {
  state: ContextMenuState;
  openMenu: (x: number, y: number, items: MenuItem[]) => void;
  closeMenu: () => void;
};

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

export const ContextMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<ContextMenuState>({ isOpen: false, x: 0, y: 0, items: [] });

  const openMenu = useCallback((x: number, y: number, items: MenuItem[]) => {
    setState({ isOpen: true, x, y, items });
  }, []);

  const closeMenu = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const value = useMemo(() => ({ state, openMenu, closeMenu }), [state, openMenu, closeMenu]);

  return (
    <ContextMenuContext.Provider value={value}>{children}</ContextMenuContext.Provider>
  );
};

export const useContextMenu = () => {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error("useContextMenu must be used within a ContextMenuProvider");
  return ctx;
};


