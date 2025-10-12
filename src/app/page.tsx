import TerminalWindow from "./components/TerminalWindow/TerminalWindow";
import { TerminalIcon } from "./components/TerminalIcon";
import { DesktopWallpaper } from "./components/DesktopWallpaper";
import { Taskbar } from "./components/Taskbar";
import { TerminalProvider } from "./hooks/useTerminal";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <TerminalProvider>
        <DesktopWallpaper />
        <TerminalWindow />
        <TerminalIcon />
        <Taskbar />
      </TerminalProvider>
    </main>
  );
}
