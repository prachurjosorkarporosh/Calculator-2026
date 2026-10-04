package bd.pro.prachurjo.calculator.domain.calculator

import kotlin.math.*

data class EvaluationResult(
    val isSuccess: Boolean,
    val value: Double = 0.0,
    val formattedValue: String = "",
    val errorMessage: String? = null
)

object CalculatorEngine {

    fun evaluate(expression: String, angleMode: String): EvaluationResult {
        return try {
            val clean = expression.trim()
            if (clean.isEmpty()) {
                return EvaluationResult(isSuccess = true, formattedValue = "")
            }

            // Normalize operators
            val normalized = clean
                .replace("×", "*")
                .replace("÷", "/")
                .replace("−", "-")

            val tokens = tokenize(normalized)
            val rpn = shuntingYard(tokens)
            val resultVal = evaluateRPN(rpn, angleMode)

            if (resultVal.isNaN() || resultVal.isInfinite()) {
                EvaluationResult(isSuccess = false, errorMessage = "Error")
            } else {
                EvaluationResult(isSuccess = true, value = resultVal, formattedValue = formatNumber(resultVal))
            }
        } catch (e: Exception) {
            EvaluationResult(isSuccess = false, errorMessage = e.message ?: "Error")
        }
    }

    private fun formatNumber(value: Double): String {
        val rounded = (value * 1e11).roundToLong() / 1e11
        return if (rounded == rounded.toLong().toDouble()) {
            rounded.toLong().toString()
        } else {
            rounded.toString()
        }
    }

    private fun tokenize(expr: String): List<String> {
        val tokens = mutableListOf<String>()
        var i = 0
        while (i < expr.length) {
            val c = expr[i]
            if (c.isWhitespace()) {
                i++
                continue
            }
            if (c.isDigit() || c == '.') {
                val sb = StringBuilder()
                while (i < expr.length && (expr[i].isDigit() || expr[i] == '.')) {
                    sb.append(expr[i])
                    i++
                }
                tokens.add(sb.toString())
                continue
            }
            if (c.isLetter()) {
                val sb = StringBuilder()
                while (i < expr.length && expr[i].isLetter()) {
                    sb.append(expr[i])
                    i++
                }
                tokens.add(sb.toString())
                continue
            }
            if (c == 'π' || c == 'e' || c == '√' || c == '!' || c == '%' || c == '(' || c == ')' || c == '+' || c == '-' || c == '*' || c == '/' || c == '^') {
                tokens.add(c.toString())
                i++
                continue
            }
            i++
        }
        return tokens
    }

    private fun shuntingYard(tokens: List<String>): List<String> {
        val output = mutableListOf<String>()
        val ops = ArrayDeque<String>()

        fun precedence(op: String): Int = when (op) {
            "+", "-" -> 2
            "*", "/" -> 3
            "u-" -> 4
            "^" -> 5
            else -> 0
        }

        for (i in tokens.indices) {
            val token = tokens[i]
            val prev = if (i > 0) tokens[i - 1] else null

            when {
                token.toDoubleOrNull() != null || token == "π" || token == "e" -> output.add(token)
                token == "!" || token == "%" -> output.add(token)
                token in listOf("sin", "cos", "tan", "asin", "acos", "atan", "ln", "log", "√") -> ops.addLast(token)
                token == "(" -> ops.addLast(token)
                token == ")" -> {
                    while (ops.isNotEmpty() && ops.last() != "(") {
                        output.add(ops.removeLast())
                    }
                    if (ops.isNotEmpty() && ops.last() == "(") ops.removeLast()
                    if (ops.isNotEmpty() && ops.last() in listOf("sin", "cos", "tan", "asin", "acos", "atan", "ln", "log", "√")) {
                        output.add(ops.removeLast())
                    }
                }
                token in listOf("+", "-", "*", "/", "^") -> {
                    val actualOp = if (token == "-" && (prev == null || prev in listOf("+", "-", "*", "/", "^", "("))) "u-" else token
                    while (ops.isNotEmpty() && ops.last() != "(" && precedence(ops.last()) >= precedence(actualOp)) {
                        output.add(ops.removeLast())
                    }
                    ops.addLast(actualOp)
                }
            }
        }
        while (ops.isNotEmpty()) {
            output.add(ops.removeLast())
        }
        return output
    }

    private fun evaluateRPN(rpn: List<String>, angleMode: String): Double {
        val stack = ArrayDeque<Double>()

        for (token in rpn) {
            when {
                token.toDoubleOrNull() != null -> stack.addLast(token.toDouble())
                token == "π" -> stack.addLast(Math.PI)
                token == "e" -> stack.addLast(Math.E)
                token == "!" -> {
                    val n = stack.removeLast()
                    if (n < 0 || n != n.toLong().toDouble() || n > 170) throw IllegalArgumentException("Invalid factorial")
                    var fact = 1.0
                    for (k in 2..n.toLong()) fact *= k
                    stack.addLast(fact)
                }
                token == "%" -> stack.addLast(stack.removeLast() / 100.0)
                token == "u-" -> stack.addLast(-stack.removeLast())
                token in listOf("+", "-", "*", "/", "^") -> {
                    val b = stack.removeLast()
                    val a = stack.removeLast()
                    val res = when (token) {
                        "+" -> a + b
                        "-" -> a - b
                        "*" -> a * b
                        "/" -> if (b == 0.0) throw ArithmeticException("Cannot divide by zero") else a / b
                        "^" -> a.pow(b)
                        else -> 0.0
                    }
                    stack.addLast(res)
                }
                token in listOf("sin", "cos", "tan", "asin", "acos", "atan", "ln", "log", "√") -> {
                    val a = stack.removeLast()
                    val toRad = if (angleMode == "DEG") Math.toRadians(a) else a
                    val res = when (token) {
                        "sin" -> sin(toRad)
                        "cos" -> cos(toRad)
                        "tan" -> tan(toRad)
                        "asin" -> {
                            val r = asin(a)
                            if (angleMode == "DEG") Math.toDegrees(r) else r
                        }
                        "acos" -> {
                            val r = acos(a)
                            if (angleMode == "DEG") Math.toDegrees(r) else r
                        }
                        "atan" -> {
                            val r = atan(a)
                            if (angleMode == "DEG") Math.toDegrees(r) else r
                        }
                        "ln" -> if (a <= 0) throw IllegalArgumentException("ln <= 0") else ln(a)
                        "log" -> if (a <= 0) throw IllegalArgumentException("log <= 0") else log10(a)
                        "√" -> if (a < 0) throw IllegalArgumentException("√ < 0") else sqrt(a)
                        else -> 0.0
                    }
                    stack.addLast(res)
                }
            }
        }
        return stack.lastOrNull() ?: 0.0
    }
}
