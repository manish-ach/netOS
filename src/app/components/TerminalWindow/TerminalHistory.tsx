import { Command } from "@/app/hooks/useTerminal";

type Props = {
  history: Command[];
};

export const TerminalHistory = ({ history }: Props) => (
  <>
    {history.map((cmd, i) => (
      <div key={i} className="mb-3">
        <div className="flex items-center">
          <span className="text-green-400 font-bold">manish</span>
          <span className="text-gray-400 mx-1">@</span>
          <span className="text-blue-400 font-bold">portfolio</span>
          <span className="text-gray-500 ml-1">:~$</span>
          <span className="ml-2 text-[#d4d4d4]">{cmd.input}</span>
        </div>
        {cmd.output && (
          <div className="mt-2 ml-4">
            {typeof cmd.output === 'string' ? (
              <pre className="whitespace-pre-wrap text-[#d4d4d4] font-mono text-sm leading-relaxed">
                {cmd.output}
              </pre>
            ) : (
              cmd.output
            )}
          </div>
        )}
      </div>
    ))}
  </>
);
