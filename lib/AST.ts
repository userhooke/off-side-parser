export enum ASTType {
  Program = "Program",
  Expression = "Expression",
  String = "String",
  Number = "Number",
  Symbol = "Symbol",
}

export type GenericAST = {
  type: ASTType;
};

export type Program = {
  type: ASTType.Program;
  body: ExpressionList;
};

export type ExpressionList = Expression[] | [];

export type Expression = {
  type: ASTType.Expression;
  callee: SYMBOL;
  args: Argument[] | [];
};

export type Argument = Atom | Expression;

export type Atom = STRING | NUMBER | SYMBOL;

export type STRING = {
  type: ASTType.String;
  value: string;
};

export type NUMBER = {
  type: ASTType.Number;
  value: number;
};

export type SYMBOL = {
  type: ASTType.Symbol;
  name: string;
};
