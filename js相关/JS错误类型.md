# JS错误类型
- Error: 通用错误类型;
- SyntaxError: JS 语法错误时抛出(拼写错误、缺失分号、括号不匹配等);
- ReferenceError: 尝试访问不存在的变量或函数时抛出(变量未声明或未定义);
- TypeError: 某个操作无法在特定类型的值上执行时抛出(对非函数对象执行函数调用、非对象上执行对象操作等);
- RangeError: 特定值不在所允许的范围或集合时抛出(递归调用过多导致调用栈超出最大限制、Number类型的方法超出最大限制等);
- URIError: 使用全局函数 decodeURI()、decodeURIComponent()、encodeURI()、encodeURIComponent() 时, 传递的 URI 不符合规范时抛出(decodeURI('%'));
- EvalError: 关于 eval() 的错误, 此异常不再会被 JavaScript 抛出, 但是 EvalError 对象仍然存在, 以保持兼容性。
