/**
 * Prachurjo Calculator Engine
 * Developer: Prachurjo Sorkar Porosh
 * https://prachurjo.pro.bd/
 * © 2026 Prachurjo Calculator. All rights reserved.
 *
 * Full mathematical expression tokenizer, parser, and evaluator
 * supporting operator precedence, parentheses, scientific functions,
 * DEG/RAD angle modes, inverse trigonometric functions, percentages,
 * factorials, and constants.
 */

export type AngleMode = 'RAD' | 'DEG';

export interface EvaluationResult {
  success: boolean;
  value?: number;
  formatted?: string;
  error?: string;
}

// Factorial calculation with safety bounds and float tolerance
export function calculateFactorial(n: number): number {
  if (!Number.isFinite(n) || n < 0) {
    throw new Error('Invalid factorial');
  }
  // Tolerate small floating point noise near integer e.g. 5.000000000000001
  const nearestInt = Math.round(n);
  if (Math.abs(n - nearestInt) > 1e-10) {
    throw new Error('Invalid factorial');
  }
  n = nearestInt;
  if (n > 170) {
    throw new Error('Overflow');
  }
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Clean floating point inaccuracies (e.g., 0.1 + 0.2 = 0.3 or sin(180deg) = 0)
export function cleanFloat(val: number): number {
  if (Math.abs(val) < 1e-15) return 0;
  // If extremely close to an integer (e.g. 0.30000000000000004 or 4.999999999999999)
  const nearestInt = Math.round(val);
  if (Math.abs(val - nearestInt) < 1e-12) {
    return nearestInt;
  }
  // Use 14 significant digits to prevent truncating large integers while eliminating binary float noise
  return parseFloat(val.toPrecision(14));
}

// Format numbers for display
export function formatResultNumber(num: number): string {
  if (!Number.isFinite(num)) {
    if (isNaN(num)) return 'Error';
    return num > 0 ? 'Infinity' : '-Infinity';
  }

  // Avoid scientific notation for typical numbers
  const abs = Math.abs(num);
  if (abs >= 1e15 || (abs > 0 && abs < 1e-7)) {
    return num.toExponential(6).replace(/\.?0+e/, 'e');
  }

  const cleaned = cleanFloat(num);
  return cleaned.toString();
}

/**
 * Token types for expression parsing
 */
type TokenType =
  | 'NUMBER'
  | 'OPERATOR'
  | 'FUNCTION'
  | 'LPAREN'
  | 'RPAREN'
  | 'POSTFIX'
  | 'CONSTANT';

interface Token {
  type: TokenType;
  value: string;
}

export class CalculatorEngine {
  /**
   * Tokenize expression string
   */
  static tokenize(expression: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;
    const cleanExpr = expression.trim();

    while (i < cleanExpr.length) {
      const char = cleanExpr[i];

      // Skip whitespace
      if (/\s/.test(char)) {
        i++;
        continue;
      }

      // Numbers & decimals
      if (/[0-9.]/.test(char)) {
        let numStr = '';
        let dotCount = 0;
        while (i < cleanExpr.length && /[0-9.]/.test(cleanExpr[i])) {
          if (cleanExpr[i] === '.') {
            dotCount++;
            if (dotCount > 1) {
              throw new Error('Invalid decimal format');
            }
          }
          numStr += cleanExpr[i];
          i++;
        }
        tokens.push({ type: 'NUMBER', value: numStr });
        continue;
      }

      // Multi-character functions & constants
      if (/[a-zA-Z]/.test(char)) {
        let word = '';
        while (i < cleanExpr.length && /[a-zA-Z]/.test(cleanExpr[i])) {
          word += cleanExpr[i];
          i++;
        }

        const lowerWord = word.toLowerCase();
        if (lowerWord === 'e') {
          tokens.push({ type: 'CONSTANT', value: 'e' });
        } else if (
          [
            'sin',
            'cos',
            'tan',
            'asin',
            'acos',
            'atan',
            'ln',
            'log',
            'sqrt',
          ].includes(lowerWord)
        ) {
          tokens.push({ type: 'FUNCTION', value: lowerWord });
        } else {
          throw new Error(`Unknown identifier: ${word}`);
        }
        continue;
      }

      // Constants
      if (char === 'π') {
        tokens.push({ type: 'CONSTANT', value: 'π' });
        i++;
        continue;
      }

      // Square root
      if (char === '√') {
        tokens.push({ type: 'FUNCTION', value: 'sqrt' });
        i++;
        continue;
      }

      // Factorial / Percentage (Postfix)
      if (char === '!') {
        tokens.push({ type: 'POSTFIX', value: '!' });
        i++;
        continue;
      }

      if (char === '%') {
        tokens.push({ type: 'POSTFIX', value: '%' });
        i++;
        continue;
      }

      // Parentheses
      if (char === '(') {
        tokens.push({ type: 'LPAREN', value: '(' });
        i++;
        continue;
      }

      if (char === ')') {
        tokens.push({ type: 'RPAREN', value: ')' });
        i++;
        continue;
      }

      // Operators
      if (
        ['+', '-', '−', '*', '×', '/', '÷', '^'].includes(char)
      ) {
        let normOp = char;
        if (char === '−') normOp = '-';
        if (char === '×') normOp = '*';
        if (char === '÷') normOp = '/';
        tokens.push({ type: 'OPERATOR', value: normOp });
        i++;
        continue;
      }

      throw new Error(`Unexpected character: ${char}`);
    }

    return tokens;
  }

  /**
   * Convert tokens to Reverse Polish Notation (RPN) via Shunting-Yard
   */
  static shuntingYard(tokens: Token[]): Token[] {
    const outputQueue: Token[] = [];
    const operatorStack: Token[] = [];

    const precedence: Record<string, number> = {
      '+': 2,
      '-': 2,
      '*': 3,
      '/': 3,
      '^': 5,
      'u-': 6, // Unary negation binds higher than binary operators and exponent
    };

    const isRightAssociative = (op: string) => op === '^' || op === 'u-';

    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      const prevToken = i > 0 ? tokens[i - 1] : null;

      // Handle implicit multiplication:
      // Case 1: Number, constant, right paren, or postfix followed by (, function, or constant:
      // e.g. 2(3), (2)(3), 5π, 2sin(30), 5!π
      // Case 2: Constant, right paren, or postfix followed by number:
      // e.g. (2)3, π5, e2, 5!2, 10%5
      const isLeftImplicit =
        prevToken &&
        (prevToken.type === 'NUMBER' ||
          prevToken.type === 'CONSTANT' ||
          prevToken.type === 'RPAREN' ||
          prevToken.type === 'POSTFIX');

      const isRightImplicit =
        token.type === 'LPAREN' ||
        token.type === 'FUNCTION' ||
        token.type === 'CONSTANT' ||
        (token.type === 'NUMBER' &&
          prevToken &&
          (prevToken.type === 'RPAREN' ||
            prevToken.type === 'CONSTANT' ||
            prevToken.type === 'POSTFIX'));

      if (isLeftImplicit && isRightImplicit) {
        const mulToken: Token = { type: 'OPERATOR', value: '*' };
        while (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].type === 'OPERATOR' &&
          precedence[operatorStack[operatorStack.length - 1].value] >=
            precedence['*']
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(mulToken);
      }

      if (token.type === 'NUMBER' || token.type === 'CONSTANT') {
        outputQueue.push(token);
      } else if (token.type === 'FUNCTION') {
        operatorStack.push(token);
      } else if (token.type === 'POSTFIX') {
        outputQueue.push(token);
      } else if (token.type === 'OPERATOR') {
        // Detect unary minus
        let opValue = token.value;
        if (
          opValue === '-' &&
          (!prevToken ||
            prevToken.type === 'OPERATOR' ||
            prevToken.type === 'LPAREN' ||
            prevToken.type === 'FUNCTION')
        ) {
          opValue = 'u-';
        }

        const currPrec = precedence[opValue];

        while (operatorStack.length > 0) {
          const top = operatorStack[operatorStack.length - 1];
          if (top.type === 'FUNCTION') {
            outputQueue.push(operatorStack.pop()!);
            continue;
          }
          if (top.type === 'OPERATOR') {
            const topPrec = precedence[top.value];
            if (
              (isRightAssociative(opValue) && currPrec < topPrec) ||
              (!isRightAssociative(opValue) && currPrec <= topPrec)
            ) {
              outputQueue.push(operatorStack.pop()!);
              continue;
            }
          }
          break;
        }
        operatorStack.push({ type: 'OPERATOR', value: opValue });
      } else if (token.type === 'LPAREN') {
        operatorStack.push(token);
      } else if (token.type === 'RPAREN') {
        let foundLParen = false;
        while (operatorStack.length > 0) {
          const top = operatorStack.pop()!;
          if (top.type === 'LPAREN') {
            foundLParen = true;
            break;
          }
          outputQueue.push(top);
        }
        if (!foundLParen) {
          throw new Error('Mismatched parentheses');
        }
        if (
          operatorStack.length > 0 &&
          operatorStack[operatorStack.length - 1].type === 'FUNCTION'
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
      }
    }

    while (operatorStack.length > 0) {
      const top = operatorStack.pop()!;
      if (top.type === 'LPAREN' || top.type === 'RPAREN') {
        throw new Error('Mismatched parentheses');
      }
      outputQueue.push(top);
    }

    return outputQueue;
  }

  /**
   * Evaluate RPN token queue
   */
  static evaluateRPN(rpn: Token[], angleMode: AngleMode): number {
    const stack: number[] = [];

    const toRadians = (deg: number) => (deg * Math.PI) / 180;
    const toDegrees = (rad: number) => (rad * 180) / Math.PI;

    for (const token of rpn) {
      if (token.type === 'NUMBER') {
        const val = parseFloat(token.value);
        if (isNaN(val)) throw new Error('Invalid number');
        stack.push(val);
      } else if (token.type === 'CONSTANT') {
        if (token.value === 'π') stack.push(Math.PI);
        else if (token.value === 'e') stack.push(Math.E);
      } else if (token.type === 'POSTFIX') {
        if (stack.length < 1) throw new Error('Malformed expression');
        const a = stack.pop()!;
        if (token.value === '!') {
          stack.push(calculateFactorial(a));
        } else if (token.value === '%') {
          stack.push(a / 100);
        }
      } else if (token.type === 'OPERATOR') {
        if (token.value === 'u-') {
          if (stack.length < 1) throw new Error('Malformed expression');
          const a = stack.pop()!;
          stack.push(-a);
          continue;
        }

        if (stack.length < 2) throw new Error('Malformed expression');
        const b = stack.pop()!;
        const a = stack.pop()!;

        switch (token.value) {
          case '+':
            stack.push(a + b);
            break;
          case '-':
            stack.push(a - b);
            break;
          case '*':
            stack.push(a * b);
            break;
          case '/':
            if (b === 0) throw new Error('Cannot divide by zero');
            stack.push(a / b);
            break;
          case '^':
            stack.push(Math.pow(a, b));
            break;
          default:
            throw new Error(`Unsupported operator: ${token.value}`);
        }
      } else if (token.type === 'FUNCTION') {
        if (stack.length < 1) throw new Error('Malformed expression');
        const a = stack.pop()!;

        switch (token.value) {
          case 'sin': {
            if (angleMode === 'DEG') {
              const normDeg = ((a % 360) + 360) % 360;
              if (normDeg === 0 || normDeg === 180) {
                stack.push(0);
                break;
              }
              if (normDeg === 90) {
                stack.push(1);
                break;
              }
              if (normDeg === 270) {
                stack.push(-1);
                break;
              }
              if (normDeg === 30 || normDeg === 150) {
                stack.push(0.5);
                break;
              }
              if (normDeg === 210 || normDeg === 330) {
                stack.push(-0.5);
                break;
              }
            }
            const rad = angleMode === 'DEG' ? toRadians(a) : a;
            stack.push(cleanFloat(Math.sin(rad)));
            break;
          }
          case 'cos': {
            if (angleMode === 'DEG') {
              const normDeg = ((a % 360) + 360) % 360;
              if (normDeg === 90 || normDeg === 270) {
                stack.push(0);
                break;
              }
              if (normDeg === 0) {
                stack.push(1);
                break;
              }
              if (normDeg === 180) {
                stack.push(-1);
                break;
              }
              if (normDeg === 60 || normDeg === 300) {
                stack.push(0.5);
                break;
              }
              if (normDeg === 120 || normDeg === 240) {
                stack.push(-0.5);
                break;
              }
            }
            const rad = angleMode === 'DEG' ? toRadians(a) : a;
            stack.push(cleanFloat(Math.cos(rad)));
            break;
          }
          case 'tan': {
            if (angleMode === 'DEG') {
              const normDeg = ((a % 360) + 360) % 360;
              if (normDeg === 90 || normDeg === 270) {
                throw new Error('Undefined (tan 90°)');
              }
              if (normDeg === 0 || normDeg === 180) {
                stack.push(0);
                break;
              }
              if (normDeg === 45 || normDeg === 225) {
                stack.push(1);
                break;
              }
              if (normDeg === 135 || normDeg === 315) {
                stack.push(-1);
                break;
              }
            }
            const rad = angleMode === 'DEG' ? toRadians(a) : a;
            stack.push(cleanFloat(Math.tan(rad)));
            break;
          }
          case 'asin': {
            if (a < -1 || a > 1) {
              throw new Error('Domain error (asin)');
            }
            const rad = Math.asin(a);
            stack.push(angleMode === 'DEG' ? toDegrees(rad) : rad);
            break;
          }
          case 'acos': {
            if (a < -1 || a > 1) {
              throw new Error('Domain error (acos)');
            }
            const rad = Math.acos(a);
            stack.push(angleMode === 'DEG' ? toDegrees(rad) : rad);
            break;
          }
          case 'atan': {
            const rad = Math.atan(a);
            stack.push(angleMode === 'DEG' ? toDegrees(rad) : rad);
            break;
          }
          case 'ln': {
            if (a <= 0) throw new Error('Domain error (ln <= 0)');
            stack.push(Math.log(a));
            break;
          }
          case 'log': {
            if (a <= 0) throw new Error('Domain error (log <= 0)');
            stack.push(Math.log10(a));
            break;
          }
          case 'sqrt': {
            if (a < 0) throw new Error('Domain error (√ negative)');
            stack.push(Math.sqrt(a));
            break;
          }
          default:
            throw new Error(`Unknown function: ${token.value}`);
        }
      }
    }

    if (stack.length !== 1) {
      throw new Error('Malformed expression');
    }

    return stack[0];
  }

  /**
   * Main evaluate function
   */
  static evaluate(expression: string, angleMode: AngleMode): EvaluationResult {
    try {
      if (!expression || !expression.trim()) {
        return { success: true, value: 0, formatted: '' };
      }

      // Auto-close unmatched open parentheses at evaluation time
      let balancedExpr = expression;
      const openCount = (expression.match(/\(/g) || []).length;
      const closeCount = (expression.match(/\)/g) || []).length;
      if (openCount > closeCount) {
        balancedExpr += ')'.repeat(openCount - closeCount);
      }

      const tokens = CalculatorEngine.tokenize(balancedExpr);
      if (tokens.length === 0) {
        return { success: true, value: 0, formatted: '' };
      }

      const rpn = CalculatorEngine.shuntingYard(tokens);
      const rawVal = CalculatorEngine.evaluateRPN(rpn, angleMode);

      if (isNaN(rawVal)) {
        return { success: false, error: 'Error' };
      }

      const formatted = formatResultNumber(rawVal);
      return { success: true, value: rawVal, formatted };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error';
      return { success: false, error: msg.startsWith('Cannot') || msg.startsWith('Domain') || msg.startsWith('Overflow') ? msg : 'Error' };
    }
  }

  /**
   * Check if a decimal dot can be appended to the current expression
   */
  static canAppendDot(expression: string): boolean {
    if (!expression) return true;
    // Scan backward to the last non-number character
    let i = expression.length - 1;
    while (i >= 0) {
      const char = expression[i];
      if (char === '.') return false; // Already has dot in current number
      if (!/[0-9]/.test(char)) break;
      i--;
    }
    return true;
  }

  /**
   * Intelligent parenthesis handler:
   * Decides whether to insert '(' or ')' based on open count and preceding char
   */
  static getSmartParen(expression: string): '(' | ')' {
    if (!expression) return '(';
    const lastChar = expression[expression.length - 1];

    const openCount = (expression.match(/\(/g) || []).length;
    const closeCount = (expression.match(/\)/g) || []).length;

    // If there is an open bracket and last char is a number, constant, factorial, percent, or ')'
    if (
      openCount > closeCount &&
      (/[0-9πe!%]/.test(lastChar) || lastChar === ')')
    ) {
      return ')';
    }

    return '(';
  }
}
