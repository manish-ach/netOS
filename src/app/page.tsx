import TerminalWindow from "./components/TerminalWindow/TerminalWindow";
import { TerminalIcon } from "./components/TerminalIcon";
import { TerminalProvider } from "./hooks/useTerminal";
import { div } from "framer-motion/client";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <TerminalProvider>
        <TerminalWindow />
        <TerminalIcon />
      </TerminalProvider>
    </main>
  );
}
