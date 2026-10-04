package bd.pro.prachurjo.calculator.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFFC2E7FF),
    background = Color(0xFF121316),
    surface = Color(0xFF191C1E),
    onPrimary = Color(0xFF001D35),
    onBackground = Color(0xFFE2E2E6),
    onSurface = Color(0xFFE2E2E6)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF004A77),
    background = Color(0xFFFFFFFF),
    surface = Color(0xFFFBFDFD),
    onPrimary = Color(0xFFFFFFFF),
    onBackground = Color(0xFF191C1E),
    onSurface = Color(0xFF191C1E)
)

@Composable
fun PrachurjoCalculatorTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
