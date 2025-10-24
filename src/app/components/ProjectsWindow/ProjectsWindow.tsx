"use client";

import { Minus, Maximize2, Minimize, X, Star, GitFork, ExternalLink, Calendar, Code, RefreshCw } from "lucide-react";
import { memo, useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useProjects } from "../../hooks/useProjects";
import { useFocusManager } from "../../hooks/useFocusManager";
import { useGitHubData } from "../../hooks/useGitHubData";
import { GitHubService } from "../../services/github";

const ProjectsWindow = memo(() => {
  const {
    isFocused,
    setFocused,
    isVisible,
    isMinimized,
    isMaximized,
    minimizeProjects,
    maximizeProjects,
    closeProjects,
  } = useProjects();

  const { focusedApp, setFocusedApp, getZIndex, getWindowPosition, bringToFront, resizingApp, setResizingApp } = useFocusManager();
  const { repositories, user, loading, error, refetch } = useGitHubData();

  const [size, setSize] = useState({ width: 900, height: 600 });
  const [position, setPosition] = useState({ x: 80, y: 60 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    const newPosition = getWindowPosition("projects", size);
    setPosition(newPosition);
  }, []); // Only run once on mount

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    setFocused(true);
    bringToFront("projects");
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [setFocused, bringToFront, isMaximized]);

  // Allow dragging from container except interactive elements
  const handleContainerMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMaximized) return;
    if (resizingApp && resizingApp !== "projects") return;
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, button, a, select, [data-nodrag], [contenteditable="true"]')) {
      return;
    }
    setFocused(true);
    bringToFront("projects");
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isMaximized, setFocused, bringToFront, resizingApp]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || isMaximized) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    
    const newX = position.x + deltaX;
    const newY = position.y + deltaY;
    
    // No viewport constraints - allow free movement
    setPosition({ x: newX, y: newY });
    setDragStart({ x: e.clientX, y: e.clientY });
  }, [isDragging, isMaximized, dragStart, position]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizingApp(null);
  }, [setResizingApp]);

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    if (isMaximized) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizingApp("projects");
    setResizeStart({ x: e.clientX, y: e.clientY, width: size.width, height: size.height });
  }, [isMaximized, size, setResizingApp]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || isMaximized) return;
    const newWidth = Math.max(600, Math.min(1600, resizeStart.width + (e.clientX - resizeStart.x)));
    const newHeight = Math.max(400, Math.min(1000, resizeStart.height + (e.clientY - resizeStart.y)));
    setSize({ width: newWidth, height: newHeight });
  }, [isResizing, isMaximized, resizeStart]);

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
      onMouseDown={handleContainerMouseDown}
      className={`${isMaximized ? 'fixed top-0 left-0 right-0' : 'fixed'} overflow-hidden relative
        ${isMaximized ? 'rounded-none' : 'rounded-xl'}
        ${isMaximized ? '' : 'shadow-[0_8px_40px_rgba(0,0,0,0.3)]'} backdrop-blur-md border
        ${focusedApp === "projects" ? "border-purple-500/70 shadow-purple-500/30" : "border-gray-400/40 shadow-black/30"}
        ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        ${isResizing ? 'cursor-se-resize' : ''}
        ${isMinimized ? 'hidden' : ''}
        pointer-events-auto
        select-none
        flex flex-col
      `}
      style={{ 
        left: isMaximized ? '0' : `${position.x}px`,
        top: isMaximized ? '0' : `${position.y}px`,
        width: isMaximized ? '100vw' : `${size.width}px`,
        height: isMaximized ? 'calc(100vh - 48px)' : `${size.height}px`,
        zIndex: getZIndex("projects")
      }}
    >
      {/* Title bar */}
      <div onMouseDown={handleMouseDown} className="flex items-center justify-between px-3 py-2 bg-[#21262d] border-b border-gray-700">
        <div className="text-gray-300 text-sm select-none font-mono">Projects</div>
        <div className="flex gap-2 text-gray-400">
          <button 
            onClick={minimizeProjects}
            className="hover:text-gray-200 transition-colors"
            title="Minimize"
          >
            <Minus size={14} />
          </button>
          <button 
            onClick={maximizeProjects}
            className="hover:text-gray-200 transition-colors"
            title={isMaximized ? "Restore" : "Maximize"}
          >
            {isMaximized ? <Minimize size={14} /> : <Maximize2 size={14} />}
          </button>
          <button 
            onClick={closeProjects}
            className="hover:text-red-400 transition-colors"
            title="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Projects Body */}
      <div className="w-full flex-1 min-h-0 bg-[#0d1117] p-4 overflow-auto">
        {/* Header with refresh button */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {user && (
              <>
                <Image
                  src={user.avatar_url}
                  alt={user.name || user.login}
                  width={32}
                  height={32}
                  className="rounded-full border border-white/10"
                />
                <div>
                  <div className="text-gray-100 text-sm font-medium">{user.name || user.login}</div>
                  <div className="text-gray-400 text-xs">@{user.login}</div>
                </div>
              </>
            )}
          </div>
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs transition-colors disabled:opacity-50"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-400">
              <RefreshCw size={20} className="animate-spin" />
              <span>Loading repositories...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="text-red-400 mb-2">Failed to load repositories</div>
              <div className="text-gray-400 text-sm mb-4">{error}</div>
              <button
                onClick={refetch}
                className="px-4 py-2 rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Projects grid */}
        {!loading && !error && repositories.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {repositories.map((repo) => (
              <div key={repo.id} className="rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-md bg-gradient-to-br from-blue-500/40 to-purple-500/40 border border-white/10 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                      {repo.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-gray-100 text-sm font-medium truncate">{repo.name}</div>
                      <div className="text-gray-400 text-xs truncate">{repo.full_name}</div>
                    </div>
                  </div>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-gray-200 transition-colors flex-shrink-0"
                    title="View on GitHub"
                  >
                    <ExternalLink size={14} />
                  </a>
                </div>
                
                {repo.description && (
                  <div className="text-xs text-gray-300 mb-3 line-clamp-2">
                    {repo.description}
                  </div>
                )}

                {/* Language and stats */}
                <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
                  {repo.language && (
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: GitHubService.getLanguageColor(repo.language) }}
                      />
                      <span>{repo.language}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Star size={12} />
                    <span>{repo.stargazers_count}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GitFork size={12} />
                    <span>{repo.forks_count}</span>
                  </div>
                </div>

                {/* Updated date */}
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                  <Calendar size={12} />
                  <span>Updated {GitHubService.formatDate(repo.updated_at)}</span>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs px-3 py-1 rounded-md bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 border border-blue-500/30 transition-colors"
                  >
                    <Code size={12} className="inline mr-1" />
                    View Code
                  </a>
                  {repo.homepage && (
                    <a
                      href={repo.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 transition-colors"
                    >
                      <ExternalLink size={12} className="inline mr-1" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && repositories.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center text-gray-400">
              <div className="text-lg mb-2">No repositories found</div>
              <div className="text-sm">Check your GitHub username or try refreshing</div>
            </div>
          </div>
        )}
      </div>

      {/* Resize handle */}
      {!isMaximized && (
        <div
          onMouseDown={handleResizeStart}
          className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-60 hover:opacity-100 transition-opacity z-10"
          style={{
            background: 'linear-gradient(-45deg, transparent 30%, #4a5568 30%, #4a5568 50%, transparent 50%)',
            transform: 'translate(1px, 1px)'
          }}
        />
      )}
    </div>
  );
});

ProjectsWindow.displayName = 'ProjectsWindow';

export default ProjectsWindow;


