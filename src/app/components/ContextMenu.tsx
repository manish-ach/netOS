"use client";

import { useEffect, useRef } from "react";
import { useContextMenu } from "../hooks/useContextMenu";

export const ContextMenu = () => {
  const { state, closeMenu } = useContextMenu();
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) closeMenu();
    };
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') closeMenu(); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onEsc);
    };
  }, [closeMenu]);

  if (!state.isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="fixed z-[2000] min-w-[180px] rounded-md border border-white/10 bg-black/80 backdrop-blur-md shadow-[0_12px_40px_rgba(0,0,0,0.45)] py-1 text-sm text-gray-200"
      style={{ left: state.x, top: state.y }}
    >
      {state.items.map((item, idx) => (
        <button
          key={idx}
          disabled={item.disabled}
          onClick={() => { item.onClick?.(); closeMenu(); }}
          className={`w-full px-3 py-2 text-left hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};


