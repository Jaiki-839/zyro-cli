/**
 * Tokenizes a raw command line into an argv-style array, honoring
 * single and double quotes (e.g. `echo "hello world"` -> ['echo', 'hello world']).
 */
export function tokenize(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quoteChar: string | null = null;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (quoteChar) {
      if (char === quoteChar) {
        quoteChar = null;
      } else {
        current += char;
      }
      continue;
    }

    if (char === '"' || char === "'") {
      quoteChar = char;
      continue;
    }

    if (/\s/.test(char)) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }

    current += char;
  }

  if (current.length > 0) {
    tokens.push(current);
  }

  return tokens;
}

export interface ParsedCommand {
  name: string;
  args: string[];
}

export function parseCommandLine(input: string): ParsedCommand | null {
  const tokens = tokenize(input.trim());
  if (tokens.length === 0) return null;
  const [name, ...args] = tokens;
  return { name: name.toLowerCase(), args };
}
