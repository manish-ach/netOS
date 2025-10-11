import TerminalWindow from "./components/TerminalWindow/TerminalWindow";
import { TerminalIcon } from "./components/TerminalIcon";
import { TerminalProvider } from "./hooks/useTerminal";
import { div } from "framer-motion/client";

export default function Home() {
  return (
    <div>
    <main className="min-h-screen flex items-center justify-center">
      <TerminalProvider>
        <TerminalWindow />
        <TerminalIcon />
      </TerminalProvider>
    </main>
    <div className="h-10 w-10 bg-red-500"><h1>Hello</h1>hello</div>
    </div>
  );
}
