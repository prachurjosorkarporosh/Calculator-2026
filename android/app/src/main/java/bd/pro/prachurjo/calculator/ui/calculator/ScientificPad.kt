package bd.pro.prachurjo.calculator.ui.calculator

import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import bd.pro.prachurjo.calculator.ui.theme.*

@Composable
fun ScientificPad(
    angleMode: String,
    isInvActive: Boolean,
    onToggleAngleMode: () -> Unit,
    onToggleInv: () -> Unit,
    onInput: (String) -> Unit,
    modifier: Modifier = Modifier,
    isDark: Boolean = false
) {
    val sciBg = if (isDark) ScientificBtnDark else OperatorBtnLight
    val sciText = if (isDark) OperatorTextDark else OperatorTextLight

    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Row 1: √ | π | ^ | !
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            CalculatorButton("√", "Square root", sciBg, sciText, Modifier.weight(1f).height(52.dp), 20) { onInput("√(") }
            CalculatorButton("π", "Pi", sciBg, sciText, Modifier.weight(1f).height(52.dp), 20) { onInput("π") }
            CalculatorButton("^", "Power", sciBg, sciText, Modifier.weight(1f).height(52.dp), 20) { onInput("^") }
            CalculatorButton("!", "Factorial", sciBg, sciText, Modifier.weight(1f).height(52.dp), 20) { onInput("!") }
        }

        // Row 2: Rad/Deg | sin | cos | tan
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val angleLabel = if (angleMode == "RAD") "deg" else "rad"
            CalculatorButton(angleLabel, "Angle mode", sciBg, sciText, Modifier.weight(1f).height(52.dp), 16) { onToggleAngleMode() }
            val sinLabel = if (isInvActive) "sin⁻¹" else "sin"
            CalculatorButton(sinLabel, "Sine", sciBg, sciText, Modifier.weight(1f).height(52.dp), 16) { onInput(if (isInvActive) "asin(" else "sin(") }
            val cosLabel = if (isInvActive) "cos⁻¹" else "cos"
            CalculatorButton(cosLabel, "Cosine", sciBg, sciText, Modifier.weight(1f).height(52.dp), 16) { onInput(if (isInvActive) "acos(" else "cos(") }
            val tanLabel = if (isInvActive) "tan⁻¹" else "tan"
            CalculatorButton(tanLabel, "Tangent", sciBg, sciText, Modifier.weight(1f).height(52.dp), 16) { onInput(if (isInvActive) "atan(" else "tan(") }
        }

        // Row 3: Inv | e | ln | log
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            CalculatorButton("INV", "Inverse", sciBg, sciText, Modifier.weight(1f).height(52.dp), 14) { onToggleInv() }
            CalculatorButton("e", "Euler constant", sciBg, sciText, Modifier.weight(1f).height(52.dp), 20) { onInput("e") }
            CalculatorButton("ln", "Natural log", sciBg, sciText, Modifier.weight(1f).height(52.dp), 16) { onInput("ln(") }
            CalculatorButton("log", "Logarithm", sciBg, sciText, Modifier.weight(1f).height(52.dp), 16) { onInput("log(") }
        }
    }
}
