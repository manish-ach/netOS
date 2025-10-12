"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useTerminal } from "../hooks/useTerminal";

export const TerminalIcon = () => {
  const { isVisible, openTerminal } = useTerminal();

  if (isVisible) return null;

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={openTerminal}
      className="fixed top-8 left-8 p-4 bg-[#21262d] text-[#c9d1d9] rounded-xl 
        shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-md border border-gray-600/40
        hover:bg-[#30363d] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)] 
        transition-all duration-200 cursor-pointer group"
      title="Open Terminal"
    >
      <Terminal size={24} className="group-hover:text-green-400 transition-colors" />
      
      {/* Pulse animation */}
      <motion.div
        className="absolute inset-0 rounded-xl bg-green-400/20"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.3, 0, 0.3]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.button>
  );
};
