# Parser for off-side (indented) syntax

[Off-side rule](https://en.wikipedia.org/wiki/Off-side_rule) of syntax is when a scope is defined by indentation (like python).
This parser can convert an input like

```txt
x 1 2
  x 3
    x 4 5 6
    x 7 8 9

x 10 11
  x 12
```

to a list with nested lists. Basically kinda like a Lisp without brackets.

Feel free to check [test](/tests/cases) cases for some examples.

## References

- [stevekinney/dropbear](https://github.com/stevekinney/dropbear)
- [(How to Write a (Lisp) Interpreter (in Python))](https://norvig.com/lispy.html)
- [AST Explorer](https://astexplorer.net)
