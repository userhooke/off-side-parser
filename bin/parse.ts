#!/usr/bin/env ts-node

import { statSync, readFileSync } from "fs";
import { Interpreter } from "../lib/Interpreter";
import { Parser } from "../lib/Parser";
import { Scanner } from "../lib/Scanner";

function run(source: string) {
  const scanner = new Scanner(source);
  const parser = new Parser();
  const tokens = scanner.tokenize();
  const ast = parser.parse(tokens);
  const interpreter = new Interpreter();
  return interpreter.eval(ast);
}

function loadFile(path: string) {
  statSync(path);
  return readFileSync(path, "utf-8");
}

function printNicely(output: {}) {
  console.log(JSON.stringify(output, null, 2));
}

// ts-node bin/parse.ts input_file.txt
if (process.stdin.isTTY) {
  const [_node, _path, filePath] = process.argv;
  if (!filePath) {
    console.log("Please provide a file to execute.");
    process.exit(64);
  }
  printNicely(run(loadFile(filePath)));
} else {
  // bash pipe
  // cat input_file.txt > ts-node bin/parse.ts
  let stdin = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => (stdin += chunk));
  process.stdin.on("end", () => printNicely(run(stdin)));
}
