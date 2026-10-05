package bd.pro.prachurjo.calculator.ui.calculator

import android.widget.Toast
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.clickable
import androidx.compose.foundation.combinedClickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.History
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import bd.pro.prachurjo.calculator.data.database.HistoryEntity
import bd.pro.prachurjo.calculator.ui.theme.*
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

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
    val historyList by viewModel.history.collectAsState(initial = emptyList())

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
    var showHistoryDialog by remember { mutableStateOf(false) }
    var showThemeDialog by remember { mutableStateOf(false) }
    var showHelpDialog by remember { mutableStateOf(false) }

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
            IconButton(
                onClick = { showHistoryDialog = true },
                modifier = Modifier.testTag("history_button")
            ) {
                Icon(Icons.Default.History, contentDescription = "History")
            }
            Box {
                IconButton(
                    onClick = { showMenu = true },
                    modifier = Modifier.testTag("more_button")
                ) {
                    Icon(Icons.Default.MoreVert, contentDescription = "Menu")
                }
                DropdownMenu(
                    expanded = showMenu,
                    onDismissRequest = { showMenu = false }
                ) {
                    DropdownMenuItem(
                        text = { Text("History") },
                        onClick = {
                            showHistoryDialog = true
                            showMenu = false
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("Clear history") },
                        onClick = {
                            viewModel.clearHistory()
                            Toast.makeText(context, "History cleared", Toast.LENGTH_SHORT).show()
                            showMenu = false
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("Choose theme") },
                        onClick = {
                            showThemeDialog = true
                            showMenu = false
                        }
                    )
                    DropdownMenuItem(
                        text = { Text("Help & About") },
                        onClick = {
                            showHelpDialog = true
                            showMenu = false
                        }
                    )
                }
            }
        }

        // Display Area
        Column(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(bottom = 8.dp)
                .testTag("display_area"),
            verticalArrangement = Arrangement.Bottom,
            horizontalAlignment = Alignment.End
        ) {
            // Angle indicator
            Text(
                text = angleMode,
                fontSize = 13.sp,
                fontWeight = FontWeight.Medium,
                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f),
                modifier = Modifier.testTag("angle_mode_indicator")
            )

            val scrollState = rememberScrollState()
            LaunchedEffect(expression) {
                scrollState.scrollTo(scrollState.maxValue)
            }

            // Expression
            Text(
                text = expression.ifEmpty { "0" },
                fontSize = 36.sp,
                textAlign = TextAlign.End,
                maxLines = 1,
                color = if (expression.isEmpty()) MaterialTheme.colorScheme.onSurface.copy(alpha = 0.35f) else MaterialTheme.colorScheme.onSurface,
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(scrollState)
                    .testTag("expression_text")
            )

            // Result or Error
            if (error != null) {
                Text(
                    text = error!!,
                    fontSize = 32.sp,
                    color = MaterialTheme.colorScheme.error,
                    textAlign = TextAlign.End,
                    modifier = Modifier.testTag("error_text")
                )
            } else if (result.isNotEmpty()) {
                Text(
                    text = "= $result",
                    fontSize = 44.sp,
                    fontWeight = FontWeight.Light,
                    textAlign = TextAlign.End,
                    modifier = Modifier
                        .testTag("result_text")
                        .combinedClickable(
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
            modifier = Modifier
                .align(Alignment.CenterHorizontally)
                .testTag("scientific_toggle_button")
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
            modifier = Modifier.fillMaxWidth().testTag("basic_keypad"),
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

    // History Modal Dialog
    if (showHistoryDialog) {
        AlertDialog(
            onDismissRequest = { showHistoryDialog = false },
            title = {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Calculation History", fontWeight = FontWeight.Bold)
                    if (historyList.isNotEmpty()) {
                        IconButton(
                            onClick = {
                                viewModel.clearHistory()
                                Toast.makeText(context, "All history cleared", Toast.LENGTH_SHORT).show()
                            }
                        ) {
                            Icon(Icons.Default.Delete, contentDescription = "Clear all history")
                        }
                    }
                }
            },
            text = {
                if (historyList.isEmpty()) {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(180.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Icon(
                                Icons.Default.History,
                                contentDescription = null,
                                modifier = Modifier.size(48.dp),
                                tint = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.4f)
                            )
                            Spacer(Modifier.height(8.dp))
                            Text(
                                "No history yet",
                                style = MaterialTheme.typography.bodyMedium,
                                color = MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                            )
                        }
                    }
                } else {
                    LazyColumn(
                        modifier = Modifier
                            .fillMaxWidth()
                            .heightIn(max = 380.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        items(historyList, key = { it.id }) { item ->
                            val timeStr = SimpleDateFormat("MMM d, HH:mm", Locale.getDefault()).format(Date(item.timestamp))
                            Card(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .clickable {
                                        viewModel.restoreHistory(item)
                                        showHistoryDialog = false
                                        Toast.makeText(context, "Loaded into calculator", Toast.LENGTH_SHORT).show()
                                    },
                                colors = CardDefaults.cardColors(
                                    containerColor = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)
                                )
                            ) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(12.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Column(modifier = Modifier.weight(1f)) {
                                        Text(
                                            text = item.expression,
                                            fontSize = 15.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant
                                        )
                                        Text(
                                            text = "= ${item.result}",
                                            fontSize = 18.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = MaterialTheme.colorScheme.primary
                                        )
                                        Text(
                                            text = timeStr,
                                            fontSize = 11.sp,
                                            color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f)
                                        )
                                    }
                                    IconButton(
                                        onClick = { viewModel.deleteHistoryItem(item.id) }
                                    ) {
                                        Icon(
                                            Icons.Default.Delete,
                                            contentDescription = "Delete entry",
                                            tint = MaterialTheme.colorScheme.error.copy(alpha = 0.7f)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showHistoryDialog = false }) {
                    Text("Close")
                }
            }
        )
    }

    // Theme Picker Dialog
    if (showThemeDialog) {
        AlertDialog(
            onDismissRequest = { showThemeDialog = false },
            title = { Text("Choose Theme", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    val themes = listOf(
                        "system" to "System default",
                        "light" to "Light",
                        "dark" to "Dark"
                    )
                    themes.forEach { (mode, label) ->
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    viewModel.setTheme(mode)
                                    showThemeDialog = false
                                }
                                .padding(vertical = 8.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            RadioButton(
                                selected = (themeMode == mode),
                                onClick = {
                                    viewModel.setTheme(mode)
                                    showThemeDialog = false
                                }
                            )
                            Spacer(Modifier.width(8.dp))
                            Text(label, fontSize = 16.sp)
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showThemeDialog = false }) {
                    Text("Cancel")
                }
            }
        )
    }

    // Help & About Dialog
    if (showHelpDialog) {
        AlertDialog(
            onDismissRequest = { showHelpDialog = false },
            icon = { Icon(Icons.Default.Info, contentDescription = null) },
            title = { Text("Calculator", fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Version 1.0.0", fontWeight = FontWeight.Medium, fontSize = 14.sp)
                    Text("Developer: Prachurjo Sorkar Porosh", fontSize = 13.sp)
                    Text("Website: https://prachurjo.dev.cv", fontSize = 13.sp)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        "Features:\n• Standard & Scientific calculation\n• Trigonometric (sin, cos, tan, inverse)\n• Logarithmic & Exponential functions\n• Offline persistent calculation history\n• Light and dark theme support",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            },
            confirmButton = {
                TextButton(onClick = { showHelpDialog = false }) {
                    Text("OK")
                }
            }
        )
    }
}
