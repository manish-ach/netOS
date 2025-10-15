import TerminalWindow from "./components/TerminalWindow/TerminalWindow";
import ProjectsWindow from "./components/ProjectsWindow/ProjectsWindow";
import { TerminalIcon } from "./components/TerminalIcon";
import { DesktopWallpaper } from "./components/DesktopWallpaper";
import { Taskbar } from "./components/Taskbar";
import { TerminalProvider } from "./hooks/useTerminal";
import { ProjectsProvider } from "./hooks/useProjects";
import { ContextMenuProvider } from "./hooks/useContextMenu";
import { ContextMenu } from "./components/ContextMenu";
import { FocusManagerProvider } from "./hooks/useFocusManager";
import Spotlight from "./components/Spotlight";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <FocusManagerProvider>
        <ContextMenuProvider>
          <TerminalProvider>
            <ProjectsProvider>
              <DesktopWallpaper />
              <TerminalWindow />
              <ProjectsWindow />
              <TerminalIcon />
              <Taskbar />
              <ContextMenu />
              <Spotlight />
            </ProjectsProvider>
          </TerminalProvider>
        </ContextMenuProvider>
      </FocusManagerProvider>
    </main>
  );
}
