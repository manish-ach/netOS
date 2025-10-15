"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Terminal } from "lucide-react";
import Image from "next/image";
import { useTerminal } from "../hooks/useTerminal";
import { useProjects } from "../hooks/useProjects";
import { useContextMenu } from "../hooks/useContextMenu";
import { useFocusManager } from "../hooks/useFocusManager";

export const Taskbar = memo(() => {
  const {
    isVisible,
    isMinimized,
    isMaximized,
    isClosed,
    openTerminal,
    minimizeTerminal,
    maximizeTerminal,
    closeTerminal,
  } = useTerminal();

  const {
    isVisible: isProjectsVisible,
    isMinimized: isProjectsMinimized,
    openProjects,
    minimizeProjects,
  } = useProjects();

  const [isStartOpen, setIsStartOpen] = useState(false);
  const [startView, setStartView] = useState<"home" | "projects">("home");
  const [startSearch, setStartSearch] = useState("");
  const startButtonRef = useRef<HTMLButtonElement | null>(null);
  const startMenuRef = useRef<HTMLDivElement | null>(null);
  const { openMenu } = useContextMenu();
  const { setFocusedApp, getZIndex, bringToFront } = useFocusManager();

  // Close Start menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        isStartOpen &&
        startMenuRef.current &&
        !startMenuRef.current.contains(target) &&
        startButtonRef.current &&
        !startButtonRef.current.contains(target)
      ) {
        setIsStartOpen(false);
        setStartView("home");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isStartOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsStartOpen(false);
        setStartView("home");
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-md border-t border-white/10 z-[1500]">
      <div className="relative h-full">
        {/* Centered group - Start button + app icons */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Start button (Windows 11 style) */}
          <button
            ref={startButtonRef}
            onClick={() => {
              setIsStartOpen((v) => !v);
              if (!isStartOpen) {
                setStartView("home");
                setFocusedApp("start");
              } else {
                setFocusedApp(null);
              }
            }}
            onContextMenu={(e) => {
              e.preventDefault();
              openMenu(e.clientX, e.clientY, [
                { label: "Settings (placeholder)", disabled: true },
                { label: "Personalize (placeholder)", disabled: true },
              ]);
            }}
            className={`w-9 h-9 rounded-md border flex items-center justify-center transition-colors ${
              isStartOpen
                ? "bg-white/15 border-white/20"
                : "bg-white/5 hover:bg-white/10 border-white/10"
            }`}
            title="Start"
            aria-label="Start"
          >
            <div className="grid grid-cols-3 grid-rows-3 gap-[2px]">
              {Array.from({ length: 9 }).map((_, i) => (
                <span key={i} className="w-[4px] h-[4px] rounded-[1px] bg-gray-200/90" />
              ))}
            </div>
          </button>

          {/* Terminal app icon */}
          <button
            onClick={
              isMinimized
                ? openTerminal
                : isVisible
                  ? minimizeTerminal
                  : openTerminal
            }
            onContextMenu={(e) => {
              e.preventDefault();
              openMenu(e.clientX, e.clientY, [
                { label: isVisible && !isMinimized ? "Minimize" : "Restore", onClick: () => (isVisible && !isMinimized ? minimizeTerminal() : openTerminal()) },
                { label: "Maximize (placeholder)", disabled: true },
                { label: "Close", onClick: () => closeTerminal() },
              ]);
            }}
            className={`relative flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 ${
              isVisible && !isMinimized
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : isMinimized
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
            title={
              isMinimized
                ? "Restore Terminal"
                : isVisible
                  ? "Minimize Terminal"
                  : "Open Terminal"
            }
            aria-label="Terminal"
            onMouseDown={() => {
              setIsStartOpen(false);
              bringToFront("terminal");
            }}
          >
            <Terminal size={18} />
            {(isVisible || isMinimized) && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-blue-400" />
            )}
          </button>

          {/* Projects app icon */}
          <button
            onClick={
              isProjectsMinimized
                ? openProjects
                : isProjectsVisible
                  ? minimizeProjects
                  : openProjects
            }
            onContextMenu={(e) => {
              e.preventDefault();
              openMenu(e.clientX, e.clientY, [
                { label: isProjectsVisible && !isProjectsMinimized ? "Minimize" : "Restore", onClick: () => (isProjectsVisible && !isProjectsMinimized ? minimizeProjects() : openProjects()) },
                { label: "Maximize (placeholder)", disabled: true },
                { label: "Close (placeholder)", disabled: true },
              ]);
            }}
            className={`relative flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200 ${
              isProjectsVisible && !isProjectsMinimized
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : isProjectsMinimized
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
            title={
              isProjectsMinimized
                ? "Restore Projects"
                : isProjectsVisible
                  ? "Minimize Projects"
                  : "Open Projects"
            }
            aria-label="Projects"
            onMouseDown={() => {
              setIsStartOpen(false);
              bringToFront("projects");
            }}
          >
            <Image src="/file.svg" alt="Projects" width={18} height={18} />
            {(isProjectsVisible || isProjectsMinimized) && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-purple-300" />
            )}
          </button>
        </div>

        {/* Right side - System info */}
        <div className="absolute right-4 inset-y-0 flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Online</span>
          </div>
          <div>
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>

        {/* Start menu panel */}
        {isStartOpen && (
          <div
            ref={startMenuRef}
            role="dialog"
            aria-modal="true"
            className="absolute left-1/2 -translate-x-1/2 bottom-14 w-[520px] max-w-[92vw] rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-4"
            style={{ zIndex: getZIndex("start") }}
          >
            {startView === "home" && (
              <>
                {/* Search */}
                <div className="mb-3">
                  <input
                    value={startSearch}
                    onChange={(e) => setStartSearch(e.target.value)}
                    placeholder="Search apps..."
                    className="w-full h-9 px-3 rounded-md bg-white/5 border border-white/10 text-sm text-gray-200 placeholder-gray-400 outline-none focus:border-blue-400/50"
                  />
                </div>

                {/* Pinned apps */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs text-gray-400">Pinned</div>
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {([
                      {
                        key: 'terminal',
                        label: 'Terminal',
                        icon: <Terminal size={18} />,
                        onClick: () => {
                          openTerminal();
                          setIsStartOpen(false);
                          setStartView('home');
                          setStartSearch('');
                        }
                      },
                      {
                        key: 'projects',
                        label: 'Projects',
                        icon: <Image src="/file.svg" alt="Projects" width={18} height={18} />,
                        onClick: () => {
                          openProjects();
                          setIsStartOpen(false);
                          setStartView('home');
                          setStartSearch('');
                        },
                      }
                    ] as Array<{ key: string; label: string; icon: React.ReactNode; onClick?: (() => void) | undefined }>)
                      .filter(app => app.label.toLowerCase().includes(startSearch.toLowerCase()))
                      .map(app => (
                        <button
                          key={app.key}
                          onClick={app.onClick}
                          className={`group flex flex-col items-center gap-1 p-2 rounded-md border transition-colors ${
                            app.onClick
                              ? 'hover:bg-white/5 border-transparent hover:border-white/10'
                              : 'opacity-60 cursor-not-allowed border-white/10 bg-white/5'
                          }`}
                          title={app.label}
                        >
                          <div className="w-9 h-9 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                            {app.icon}
                          </div>
                          <span className="text-[10px] text-gray-300 group-hover:text-white text-center truncate w-full">
                            {app.label}
                          </span>
                        </button>
                      ))}
                  </div>
                </div>

                {/* Recommended */}
                <div>
                  <div className="text-xs text-gray-400 mb-2">Recommended</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { title: "Open Terminal", hint: "Resume where you left off", onClick: openTerminal },
                      { title: "Minimize Terminal", hint: "Hide the terminal window", onClick: minimizeTerminal },
                    ].map((item) => (
                      <button
                        key={item.title}
                        onClick={() => {
                          setIsStartOpen(false);
                          setStartView("home");
                          item.onClick();
                        }}
                        className="text-left p-3 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      >
                        <div className="text-sm text-gray-100">{item.title}</div>
                        <div className="text-xs text-gray-400">{item.hint}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {startView === "projects" && null}
          </div>
        )}
      </div>
    </div>
  );
});

Taskbar.displayName = "Taskbar";
