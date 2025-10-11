import help from "./help";
import whoami from "./whoami";
import clear from "./clear";
import neofetch from "./neofetch";

export const commands: Record<string, () => string | null> = {
  help,
  whoami,
  clear,
  neofetch,
};
