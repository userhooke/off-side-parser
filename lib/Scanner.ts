import { TokenType, Token } from "./Token";

const Spec: [RegExp, TokenType][] = [
  [/^\n/, TokenType.EOL], // Newlines
  [/^\s/, null], // Whitespace

  [/^#.*/, null], // Bash style comment
  [/^\/\/.*/, null], // C/JS style comment
  [/^\/\*[\s\S]*?\*\//, null], // C style multiline

  [/^\d+/, TokenType.NUMBER],
  [/^[\w\-+*=<>_]+/, TokenType.SYMBOL],
  [/^"[^"]*"/, TokenType.STRING],
  [/^'[^']*'/, TokenType.STRING],
];

export class Scanner {
  private source: string;
  private cursor: number;
  private line: number;
  private tokens: Token[];
  private column: number;

  constructor(source: string) {
    this.source = source;
    this.cursor = 0;
    this.column = 0;
    this.line = 1;
    this.tokens = [];
  }

  hasMoreTokens(): boolean {
    return this.cursor < this.source.length;
  }

  tokenize(): Token[] {
    while (this.hasMoreTokens()) {
      for (const [regexp, tokenType] of Spec) {
        const tokenValue = this.match(regexp, this.source.slice(this.cursor));

        if (tokenType === null || tokenValue === null) {
          continue;
        }

        if (tokenType === TokenType.EOL) {
          this.line++;
          let column = 0;
          while (this.match(/^\t/, this.source.slice(this.cursor))) {
            column++;
          }
          this.column = column;
          continue;
        }

        this.tokens.push({
          type: tokenType,
          value: tokenValue,
          column: this.column,
          line: this.line,
        });
      }
    }
    return this.tokens;
  }

  match(regexp: RegExp, string: string) {
    const matched = regexp.exec(string);
    if (matched === null) {
      return null;
    }
    this.cursor += matched[0].length;
    return matched[0];
  }
}
