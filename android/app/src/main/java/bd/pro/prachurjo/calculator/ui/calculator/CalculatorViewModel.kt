package bd.pro.prachurjo.calculator.ui.calculator

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import bd.pro.prachurjo.calculator.data.database.CalculatorDatabase
import bd.pro.prachurjo.calculator.data.database.HistoryEntity
import bd.pro.prachurjo.calculator.domain.calculator.CalculatorEngine
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

class CalculatorViewModel(application: Application) : AndroidViewModel(application) {
    private val historyDao = CalculatorDatabase.getDatabase(application).historyDao()

    private val _expression = MutableStateFlow("")
    val expression: StateFlow<String> = _expression.asStateFlow()

    private val _result = MutableStateFlow("")
    val result: StateFlow<String> = _result.asStateFlow()

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error.asStateFlow()

    private val _isScientificExpanded = MutableStateFlow(false)
    val isScientificExpanded: StateFlow<Boolean> = _isScientificExpanded.asStateFlow()

    private val _angleMode = MutableStateFlow("RAD")
    val angleMode: StateFlow<String> = _angleMode.asStateFlow()

    private val _isInvActive = MutableStateFlow(false)
    val isInvActive: StateFlow<Boolean> = _isInvActive.asStateFlow()

    private val _themeMode = MutableStateFlow("system")
    val themeMode: StateFlow<String> = _themeMode.asStateFlow()

    private val _soundEnabled = MutableStateFlow(true)
    val soundEnabled: StateFlow<Boolean> = _soundEnabled.asStateFlow()

    val history = historyDao.getAllHistory()

    fun onInput(token: String) {
        _error.value = null
        _expression.value += token
        evaluateLive()
    }

    fun onClear() {
        _expression.value = ""
        _result.value = ""
        _error.value = null
    }

    fun onBackspace() {
        val curr = _expression.value
        if (curr.isNotEmpty()) {
            _expression.value = curr.dropLast(1)
            evaluateLive()
        }
    }

    fun toggleScientific() {
        _isScientificExpanded.value = !_isScientificExpanded.value
    }

    fun toggleAngleMode() {
        _angleMode.value = if (_angleMode.value == "RAD") "DEG" else "RAD"
        evaluateLive()
    }

    fun toggleInv() {
        _isInvActive.value = !_isInvActive.value
    }

    fun setTheme(theme: String) {
        _themeMode.value = theme
    }

    fun onEquals() {
        val expr = _expression.value
        if (expr.isBlank()) return
        val res = CalculatorEngine.evaluate(expr, _angleMode.value)
        if (res.isSuccess) {
            _result.value = res.formattedValue
            _error.value = null
            viewModelScope.launch {
                historyDao.insertHistory(
                    HistoryEntity(
                        expression = expr,
                        result = res.formattedValue,
                        timestamp = System.currentTimeMillis()
                    )
                )
            }
        } else {
            _error.value = res.errorMessage ?: "Error"
        }
    }

    private fun evaluateLive() {
        val expr = _expression.value
        if (expr.isBlank()) {
            _result.value = ""
            return
        }
        val res = CalculatorEngine.evaluate(expr, _angleMode.value)
        if (res.isSuccess) {
            _result.value = res.formattedValue
        }
    }

    fun clearHistory() {
        viewModelScope.launch {
            historyDao.clearHistory()
        }
    }
}
