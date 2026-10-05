package bd.pro.prachurjo.calculator.ui.calculator

import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.sp

@Composable
fun CalculatorButton(
    label: String,
    contentDesc: String,
    backgroundColor: Color,
    textColor: Color,
    modifier: Modifier = Modifier,
    fontSize: Int = 24,
    onClick: () -> Unit
) {
    val tag = "btn_" + label.lowercase().filter { it.isLetterOrDigit() }.ifEmpty { "op" }
    Button(
        onClick = onClick,
        shape = CircleShape,
        colors = ButtonDefaults.buttonColors(
            containerColor = backgroundColor,
            contentColor = textColor
        ),
        modifier = modifier
            .testTag(tag)
            .semantics {
                contentDescription = contentDesc
            }
    ) {
        Text(
            text = label,
            fontSize = fontSize.sp
        )
    }
}
