export enum TokenType {
  EOF = "EOF", // End of File
  EOL = "EOL", // End of Line
  INDENT = "INDENT",
  DEDENT = "DEDENT",
  EXP_START = "EXP_START",
  EXP_END = "EXP_END",

  NUMBER = "NUMBER",
  SYMBOL = "SYMBOL",
  STRING = "STRING",
}

export interface Token {
  type: TokenType;
  line: number;
  column: number;
  value: string;
}
