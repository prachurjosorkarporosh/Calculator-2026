package bd.pro.prachurjo.calculator.ui.calculator

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import bd.pro.prachurjo.calculator.ui.theme.*

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun CalculatorScreen(
    viewModel: CalculatorViewModel,
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current
    val clipboardManager = LocalClipboardManager.current
    val expression by viewModel.expression.collectAsState()
    val result by viewModel.result.collectAsState()
    val error by viewModel.error.collectAsState()
    val isScientificExpanded by viewModel.isScientificExpanded.collectAsState()
    val angleMode by viewModel.angleMode.collectAsState()
    val isInvActive by viewModel.isInvActive.collectAsState()
    val themeMode by viewModel.themeMode.collectAsState()

    val isDark = when (themeMode) {
        "light" -> false
        "dark" -> true
        else -> isSystemInDarkTheme()
    }

    val numBg = if (isDark) NumberBtnDark else NumberBtnLight
    val numText = if (isDark) NumberTextDark else NumberTextLight
    val opBg = if (isDark) OperatorBtnDark else OperatorBtnLight
    val opText = if (isDark) OperatorTextDark else OperatorTextLight

    var showMenu by remember { mutableStateOf(false) }

    Column(
        modifier = modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Top Bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = { /* Open history */ }) {
                Icon(Icons.Default.History, contentDescription = "History")
            }
            Box {
                IconButton(onClick = { showMenu = true }) {
                    Icon(Icons.Default.MoreVert, contentDescription = "Menu")
                }
                DropdownMenu(
                    expanded = showMenu,
                    onDismissRequest = { showMenu = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("Clear history") },
                        onClick = {
                            viewModel.clearHistory()
                            showMenu = false
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("Choose theme") },
                        onClick = { showMenu = false }
                    )
                    DropdownMenuItem(
                        text = { Text("Privacy Policy") },
                        onClick = { showMenu = false }
                    )
                    DropdownMenuItem(
                        text = { Text("Send feedback") },
                        onClick = { showMenu = false }
                    )
                    DropdownMenuItem(
                        text = { Text("Help") },
                        onClick = { showMenu = false }
                    )
                }
            }
        }

        // Display Area
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(bottom = 8.dp),
            verticalArrangement = Arrangement.Bottom,
            horizontalAlignment = Alignment.End
        ) {
            // Angle indicator
            Text(
                text = angleMode,
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
            )

            val scrollState = rememberScrollState()
            LaunchedEffect(expression) {
                scrollState.scrollTo(scrollState.maxValue)
            }

            // Expression
            Text(
                text = expression,
                fontSize = 36.sp,
                textAlign = TextAlign.End,
                maxLines = 1,
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(scrollState)
            )

            // Result or Error
            if (error != null) {
                Text(
                    text = error!!,
                    fontSize = 32.sp,
                    color = MaterialTheme.colorScheme.error,
                    textAlign = TextAlign.End
                )
            } else if (result.isNotEmpty()) {
                Text(
                    text = "= $result",
                    fontSize = 44.sp,
                    textAlign = TextAlign.End,
                    modifier = Modifier.combinedClickable(
                        onClick = {
                            clipboardManager.setText(AnnotatedString(result))
                            Toast.makeText(context, "Copied!", Toast.LENGTH_SHORT).show()
                        },
                        onLongClick = {
                            clipboardManager.setText(AnnotatedString(result))
                            Toast.makeText(context, "Copied to clipboard!", Toast.LENGTH_SHORT).show()
                        }
                    )
                )
            }
        }

        // Scientific Mode Toggle Chevron
        IconButton(
            onClick = { viewModel.toggleScientific() },
            modifier = Modifier.align(Alignment.CenterHorizontally)
        ) {
            Icon(
                imageVector = if (isScientificExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                contentDescription = "Toggle scientific mode"
            )
        }

        // Scientific Pad (Animated visibility)
        AnimatedVisibility(visible = isScientificExpanded) {
            ScientificPad(
                angleMode = angleMode,
                isInvActive = isInvActive,
                onToggleAngleMode = { viewModel.toggleAngleMode() },
                onToggleInv = { viewModel.toggleInv() },
                onInput = { viewModel.onInput(it) },
                isDark = isDark,
                modifier = Modifier.padding(bottom = 8.dp)
            )
        }

        // Basic 4-Column Keypad
        Column(
            modifier = Modifier.fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            // Row 1: AC | () | % | ÷
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CalculatorButton("AC", "All Clear", opBg, opText, Modifier.weight(1f).height(62.dp), 22) { viewModel.onClear() }
                CalculatorButton("( )", "Parentheses", opBg, opText, Modifier.weight(1f).height(62.dp), 22) { viewModel.onInput("(") }
                CalculatorButton("%", "Percentage", opBg, opText, Modifier.weight(1f).height(62.dp), 22) { viewModel.onInput("%") }
                CalculatorButton("÷", "Divide", opBg, opText, Modifier.weight(1f).height(62.dp), 28) { viewModel.onInput("÷") }
            }

            // Row 2: 7 | 8 | 9 | ×
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CalculatorButton("7", "Seven", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("7") }
                CalculatorButton("8", "Eight", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("8") }
                CalculatorButton("9", "Nine", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("9") }
                CalculatorButton("×", "Multiply", opBg, opText, Modifier.weight(1f).height(62.dp), 28) { viewModel.onInput("×") }
            }

            // Row 3: 4 | 5 | 6 | −
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CalculatorButton("4", "Four", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("4") }
                CalculatorButton("5", "Five", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("5") }
                CalculatorButton("6", "Six", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("6") }
                CalculatorButton("−", "Subtract", opBg, opText, Modifier.weight(1f).height(62.dp), 28) { viewModel.onInput("−") }
            }

            // Row 4: 1 | 2 | 3 | +
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CalculatorButton("1", "One", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("1") }
                CalculatorButton("2", "Two", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("2") }
                CalculatorButton("3", "Three", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("3") }
                CalculatorButton("+", "Add", opBg, opText, Modifier.weight(1f).height(62.dp), 28) { viewModel.onInput("+") }
            }

            // Row 5: 0 | . | ⌫ | =
            Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                CalculatorButton("0", "Zero", numBg, numText, Modifier.weight(1f).height(62.dp), 26) { viewModel.onInput("0") }
                CalculatorButton(".", "Decimal point", numBg, numText, Modifier.weight(1f).height(62.dp), 28) { viewModel.onInput(".") }
                CalculatorButton("⌫", "Backspace", numBg, numText, Modifier.weight(1f).height(62.dp), 24) { viewModel.onBackspace() }
                CalculatorButton("=", "Equals", EqualsBtn, EqualsText, Modifier.weight(1f).height(62.dp), 30) { viewModel.onEquals() }
            }
        }
    }
}
