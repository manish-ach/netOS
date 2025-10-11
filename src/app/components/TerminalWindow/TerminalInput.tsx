import { FC } from "react";

type Props = {
  input: string;
  setInput: (value: string) => void;
  onSubmit: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>; // ✅ include | null
};

export const TerminalInput: FC<Props> = ({
  input,
  setInput,
  onSubmit,
  inputRef,
}) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit();
    }}
    className="flex items-center"
  >
    <span className="text-green-400 font-bold">manish</span>
    <span className="text-gray-400 mx-1">@</span>
    <span className="text-blue-400 font-bold">portfolio</span>
    <span className="text-gray-500 ml-1">:~$</span>
    <input
      ref={inputRef}
      type="text"
      className="bg-transparent flex-1 outline-none text-[#d4d4d4] caret-green-400 ml-2 font-mono"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      autoFocus
      placeholder=" "
    />
  </form>
);
