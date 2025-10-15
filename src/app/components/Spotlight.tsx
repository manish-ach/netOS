"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Terminal } from "lucide-react";
import Image from "next/image";
import { useTerminal } from "../hooks/useTerminal";
import { useProjects } from "../hooks/useProjects";

export const Spotlight = () => {
  const { openTerminal } = useTerminal();
  const { openProjects } = useProjects();

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const apps = useMemo(
    () => [
      { key: "terminal", label: "Open Terminal", icon: <Terminal size={16} />, run: openTerminal },
      { key: "projects", label: "Open Projects", icon: <Image src="/file.svg" alt="Projects" width={16} height={16} />, run: openProjects },
    ],
    [openTerminal, openProjects]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter(a => a.label.toLowerCase().includes(q) || a.key.includes(q));
  }, [apps, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Toggle on Cmd+Shift+D (Mac: metaKey)
      if (e.metaKey && e.shiftKey && (e.key === "d" || e.key === "D")) {
        e.preventDefault();
        setIsOpen(v => !v);
        return;
      }
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, Math.max(0, filtered.length - 1)));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const chosen = filtered[activeIndex];
        if (chosen) {
          chosen.run();
          setIsOpen(false);
          setQuery("");
          setActiveIndex(0);
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, filtered, activeIndex]);

  useEffect(() => {
    if (isOpen) {
      // small delay to ensure element exists
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[2500] flex items-start justify-center pt-[15vh] bg-black/40 backdrop-blur-[2px]"
      onMouseDown={() => setIsOpen(false)}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="w-[680px] max-w-[92vw] rounded-2xl border border-white/10 bg-[#0b0f14]/95 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b border-white/10">
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
            placeholder="Type to launch: terminal, projects..."
            className="w-full h-10 px-3 rounded-md bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-400 outline-none focus:border-blue-400/50"
            aria-label="Spotlight search"
          />
        </div>
        <div className="max-h-[50vh] overflow-auto py-1">
          {filtered.length === 0 && (
            <div className="px-3 py-6 text-sm text-gray-400">No matches</div>
          )}
          {filtered.map((app, idx) => (
            <button
              key={app.key}
              onClick={() => { app.run(); setIsOpen(false); setQuery(""); setActiveIndex(0); }}
              className={`w-full px-3 py-2 flex items-center gap-2 text-left text-sm border-t border-white/5 first:border-t-0 transition-colors ${
                idx === activeIndex ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <span className="w-7 h-7 rounded-md bg-white/5 border border-white/10 flex items-center justify-center text-gray-200">
                {app.icon}
              </span>
              <span className="text-gray-200">{app.label}</span>
            </button>
          ))}
        </div>
        <div className="px-3 py-2 text-[11px] text-gray-400 border-t border-white/10">
          Press Esc to close • Cmd+Shift+D to toggle
        </div>
      </div>
    </div>
  );
};

export default Spotlight;


