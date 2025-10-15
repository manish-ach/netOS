"use client";

import React, { createContext, useContext, useState, useRef, useEffect, useCallback, useMemo } from "react";
import { commands } from "../commands";

export type Command = {
  input: string;
  output: string | React.ReactNode | null;
};

type TerminalContextValue = {
  input: string;
  setInput: (value: string) => void;
  history: Command[];
  submitCommand: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  terminalEndRef: React.RefObject<HTMLDivElement | null>;
  isFocused: boolean;
  setFocused: (value: boolean) => void;
  focusInput: () => void;
  isVisible: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isClosed: boolean;
  minimizeTerminal: () => void;
  maximizeTerminal: () => void;
  closeTerminal: () => void;
  openTerminal: () => void;
};

const TerminalContext = createContext<TerminalContextValue | null>(null);

export const TerminalProvider = ({ children }: { children: React.ReactNode }) => {
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<Command[]>([
    { input: "neofetch", output: commands.neofetch() }
  ]);
  const [isFocused, setFocused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClosed, setIsClosed] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [history]);

  const handleCommand = useCallback((cmd: string): string | null => {
    const lower = cmd.toLowerCase();
    const commandFn = commands[lower];
    if (commandFn) return commandFn();
    return `Command not found: ${cmd}`;
  }, []);

  const submitCommand = useCallback(() => {
    if (!input.trim()) return;

    const output = handleCommand(input.trim());
    
    // Handle special case for clear command
    if (output === null && input.trim().toLowerCase() === 'clear') {
      setHistory([]);
    } else {
      setHistory(prev => [...prev, { input, output }]);
    }
    
    setInput("");
  }, [input, handleCommand]);

  const focusInput = useCallback(() => {
    setFocused(true);
    inputRef.current?.focus();
  }, []);

  const minimizeTerminal = useCallback(() => {
    setIsMinimized(true);
    setFocused(false);
  }, []);

  const maximizeTerminal = useCallback(() => {
    setIsMaximized(prev => !prev);
  }, []);

  const closeTerminal = useCallback(() => {
    setIsVisible(false);
    setIsClosed(true);
    setFocused(false);
  }, []);

  const openTerminal = useCallback(() => {
    setIsVisible(true);
    setIsMinimized(false);
    setIsClosed(false);
    setFocused(true);
    // If history is empty, add neofetch message
    if (history.length === 0) {
      setHistory([{ input: "neofetch", output: commands.neofetch() }]);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [history.length]);

  const value = useMemo((): TerminalContextValue => ({
    input,
    setInput,
    history,
    submitCommand,
    inputRef,
    terminalEndRef,
    isFocused,
    setFocused,
    focusInput,
    isVisible,
    isMinimized,
    isMaximized,
    isClosed,
    minimizeTerminal,
    maximizeTerminal,
    closeTerminal,
    openTerminal,
  }), [
    input, history, submitCommand, inputRef, terminalEndRef,
    isFocused, setFocused, focusInput, isVisible, isMinimized, isMaximized, isClosed,
    minimizeTerminal, maximizeTerminal, closeTerminal, openTerminal
  ]);

  return <TerminalContext.Provider value={value}>{children}</TerminalContext.Provider>;
};

export const useTerminal = () => {
  const ctx = useContext(TerminalContext);
  if (!ctx) {
    throw new Error("useTerminal must be used within a TerminalProvider");
  }
  return ctx;
};
