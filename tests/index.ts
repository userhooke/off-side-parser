import { readdir, readFile } from "fs/promises";
import { deepStrictEqual, strictEqual } from "assert";
import { join } from "path";

import { Scanner } from "../lib/Scanner";
import { Parser } from "../lib/Parser";
import { Interpreter } from "../lib/Interpreter";

async function runTests() {
  const cases = await readdir(join(__dirname, "cases"));

  for (const name of cases) {
    const source = await readFile(
      join(__dirname, "cases", name, `${name}.rr`),
      "utf8"
    );
    await testScanner(name, source);
    await testParser(name, source);
    await testInterpretator(name, source);
  }
}

async function testScanner(name: string, source: string) {
  let expected;
  try {
    expected = JSON.parse(
      await readFile(
        join(__dirname, "cases", name, `${name}.tokens.json`),
        "utf8"
      )
    );
  } catch (e) {
    console.error(e.message);
    return;
  }
  const scanner = new Scanner(source);
  const tokens = scanner.tokenize();
  deepStrictEqual(tokens, expected, source);
}

async function testParser(name: string, source: string) {
  let expected;
  try {
    expected = JSON.parse(
      await readFile(join(__dirname, "cases", name, `${name}.ast.json`), "utf8")
    );
  } catch (e) {
    console.error(e.message);
    return;
  }
  const scanner = new Scanner(source);
  const parser = new Parser();
  const tokens = scanner.tokenize();
  const ast = parser.parse(tokens);
  deepStrictEqual(ast, expected, source);
}

async function testInterpretator(name: string, source: string) {
  let expected;
  try {
    expected = await readFile(
      join(__dirname, "cases", name, `${name}.out.txt`),
      "utf8"
    );
  } catch (e) {
    console.error(e.message);
    return;
  }
  const scanner = new Scanner(source);
  const parser = new Parser();
  const tokens = scanner.tokenize();
  const ast = parser.parse(tokens);
  const interpreter = new Interpreter();
  const output = interpreter.eval(ast).toString();
  strictEqual(output, expected, source);
}

runTests().then(() => console.log("All's good 👌"));
