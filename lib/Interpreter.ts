import * as AST from "./AST";
import { Environment, EnvironmentRecord } from "./Environment";

class DefaultGlobalEnvironment extends Environment {
  constructor() {
    super({
      print: { value: console.log, mutable: false },
      "+": {
        value: (a: number, b: number) => a + b,
        mutable: false,
      },
      "*": {
        value: (a: number, b: number) => a * b,
        mutable: false,
      },
      "/": {
        value: (a: number, b: number) => a / b,
        mutable: false,
      },
      "-": {
        value: (a: number, b?: number) => (b ? a - b : -a),
        mutable: false,
      },
      ">": {
        value: (a: number, b: number) => a > b,
        mutable: false,
      },
      "<": {
        value: (a: number, b: number) => a < b,
        mutable: false,
      },
      ">=": {
        value: (a: number, b: number) => a >= b,
        mutable: false,
      },
      "<=": {
        value: (a: number, b: number) => a <= b,
        mutable: false,
      },
      "=": {
        value: (a: number, b: number) => a === b,
        mutable: false,
      },
    });
  }
}

export class Interpreter {
  public global: Environment;

  constructor(global = new DefaultGlobalEnvironment()) {
    this.global = global;
  }

  public eval(ast: AST.GenericAST, env: Environment = this.global): any {
    switch (ast.type) {
      case AST.ASTType.Program:
        return this.Program(ast as AST.Program, env);

      case AST.ASTType.Expression:
        return this.Expression(ast as AST.Expression, env);

      case AST.ASTType.Number:
        return this.Number(ast as AST.NUMBER, env);

      case AST.ASTType.String:
        return this.String(ast as AST.STRING, env);

      case AST.ASTType.Symbol:
        return this.Symbol(ast as AST.SYMBOL, env);

      default:
        throw new Error(
          `Unsupported AST type: ${JSON.stringify(ast, null, 2)}`
        );
    }
  }
  Symbol(ast: AST.SYMBOL, env: Environment): any {
    return env.lookup(ast.name);
  }

  String(ast: AST.STRING, env: Environment): any {
    return ast.value;
  }

  Number(ast: AST.NUMBER, env: Environment): any {
    return ast.value;
  }

  Expression(ast: AST.Expression, env: Environment): any {
    const fn = this.eval(ast.callee, env);
    const args = ast.args.map((a) => this.eval(a, env));

    // 1. Built-in functions
    if (typeof fn === "function") {
      return fn(...args);
    }

    throw new Error(`${ast.callee} not implemented.`);
  }

  Program(ast: AST.Program, env: Environment): any {
    let program;
    ast.body.forEach((node) => {
      program = this.eval(node, env);
    });
    return program;
  }
}
