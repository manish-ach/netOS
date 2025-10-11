import { TerminalHistory } from "./TerminalHistory";
import { TerminalInput } from "./TerminalInput";
import { useTerminal } from "../../hooks/useTerminal";
import { memo, useCallback } from "react";

export const TerminalBody = memo(() => {
  const {
    history,
    input,
    setInput,
    submitCommand,
    inputRef,
    terminalEndRef,
    focusInput,
    isMaximized,
  } = useTerminal();

  const handleClick = useCallback(() => {
    focusInput();
  }, [focusInput]);

  return (
    <div
      className={`bg-[#1e1e1e] text-[#d4d4d4] font-mono text-sm px-4 py-3 overflow-y-auto cursor-text
        scroll-smooth
        ${isMaximized ? 'h-[calc(100vh-3.5rem)]' : 'h-[calc(100%-3.5rem)]'}`}
      onClick={handleClick}
      style={{ scrollBehavior: 'auto' }}
    >
      <TerminalHistory history={history} />
      <TerminalInput
        input={input}
        setInput={setInput}
        onSubmit={submitCommand}
        inputRef={inputRef}
      />
      <div ref={terminalEndRef} />
    </div>
  );
});

TerminalBody.displayName = 'TerminalBody';
