import { Token, TokenType } from "./Token";
import * as AST from "./AST";

export class Parser {
  private lookahead: Token;
  private tokens: Token[];

  public parse(tokens: Token[]): AST.Program {
    this.tokens = this.parentesize(tokens);
    this.lookahead = this.getNextToken();
    return this.Program();
  }

  Program(): AST.Program {
    return {
      type: AST.ASTType.Program,
      body: this.ExpressionList(),
    };
  }

  ExpressionList(): AST.ExpressionList {
    const expressions = [];
    while (this.tokens.length) {
      expressions.push(this.Expression());
    }
    return expressions;
  }

  Expression(): AST.Expression {
    this.eat(TokenType.EXP_START);
    const callee = this.Symbol();
    const args = [];
    while (!this.match(TokenType.EXP_END)) {
      args.push(this.Argument());
    }
    this.eat(TokenType.EXP_END);
    return {
      type: AST.ASTType.Expression,
      callee,
      args,
    };
  }

  Argument(): any {
    if (this.match(TokenType.EXP_START)) {
      return this.Expression();
    } else {
      return this.Atom();
    }
  }

  Atom(): AST.Atom {
    switch (this.lookahead.type) {
      case TokenType.NUMBER:
        return this.Number();
      case TokenType.STRING:
        return this.String();
      case TokenType.SYMBOL:
        return this.Symbol();
      default:
        throw new SyntaxError(
          `Unexpected Atom token: ${JSON.stringify(this.lookahead, null, 2)}`
        );
    }
  }

  Number(): AST.NUMBER {
    const token = this.eat(TokenType.NUMBER);
    return {
      type: AST.ASTType.Number,
      value: Number(token.value),
    };
  }

  String(): AST.STRING {
    const token = this.eat(TokenType.STRING);
    return {
      type: AST.ASTType.String,
      value: token.value.slice(1, -1),
    };
  }

  Symbol(): AST.SYMBOL {
    const token = this.eat(TokenType.SYMBOL);
    return {
      type: AST.ASTType.Symbol,
      name: token.value,
    };
  }

  private eat(expected: TokenType) {
    const token = this.lookahead;

    if (!token) {
      throw new SyntaxError(`Unexpected end of input, expected: "${expected}"`);
    }
    if (token.type !== expected) {
      throw new SyntaxError(
        `Unexpected token: "${token.value}" on line ${token.line}, expected: "${expected}"`
      );
    }

    this.lookahead = this.getNextToken();
    return token;
  }

  private getNextToken() {
    return this.tokens.shift();
  }

  private match(type: TokenType) {
    return this.lookahead.type === type;
  }

  private parentesize(tokens: Token[]): Token[] {
    let column = 0;
    let line = 1;
    const output: Token[] = [
      {
        type: TokenType.EXP_START,
        column,
        line,
        value: null,
      },
    ];

    for (const token of tokens) {
      while (token.column < column) {
        output.push({
          type: TokenType.EXP_END,
          column: token.column,
          line: token.line,
          value: null,
        });
        column--;
      }
      if (token.line > line) {
        if (token.column === column) {
          output.push({
            type: TokenType.EXP_END,
            column: token.column,
            line: token.line,
            value: null,
          });
        }
        output.push({
          type: TokenType.EXP_START,
          column: token.column,
          line: token.line,
          value: null,
        });
        line++;
      }

      if (token.column > column) {
        column++;
      }

      output.push(token);
    }
    while (column >= 0) {
      output.push({
        type: TokenType.EXP_END,
        column,
        line,
        value: null,
      });
      column--;
    }
    // TODO add check to make sure all EXP_START and EXP_END are in place https://www.youtube.com/watch?v=zrOIQEN3Wkk
    return output;
  }
}
