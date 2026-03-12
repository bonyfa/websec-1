document.addEventListener('DOMContentLoaded', function() {
    const firstInput = document.getElementById('firstNumber');
    const secondInput = document.getElementById('secondNumber');
    const operatorSelect = document.getElementById('operator');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultOutput = document.getElementById('result');
    
    // История операций (максимум 5 записей)
    let history = [];
    
    // Функция проверки валидности числа
    function isValidNumber(value) {
        if (value === '') return false;
        // Проверка на число (включая отрицательные и десятичные)
        return !isNaN(parseFloat(value)) && isFinite(value) && /^-?\d*\.?\d+$/.test(value);
    }
    
    // Функция очистки подсветки ошибок
    function clearErrors() {
        firstInput.classList.remove('error');
        secondInput.classList.remove('error');
        
        // Удаляем предыдущее сообщение об ошибке, если оно было
        const oldError = document.querySelector('.error-message');
        if (oldError) oldError.remove();
    }
    
    // Функция показа ошибки
    function showError(message, element) {
        element.classList.add('error');
        
        // Создаем сообщение об ошибке
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Добавляем сообщение после output
        const output = document.getElementById('output');
        output.appendChild(errorDiv);
    }
    
    // Функция добавления в историю
    function addToHistory(operation, result) {
        history.unshift({
            operation: operation,
            result: result
        });
        
        // Оставляем только последние 5 записей
        if (history.length > 5) {
            history.pop();
        }
    }
    
    // Функция отображения истории и текущего результата
    function displayResult(currentResult) {
        let html = '';
        
        // Добавляем историю (бледным шрифтом)
        history.slice(1).forEach(item => {
            html += `<div class="result-item prev">${item.operation}</div>`;
        });
        
        // Добавляем текущий результат
        html += `<div class="result-item">${currentResult}</div>`;
        
        resultOutput.innerHTML = html;
    }
    
    // Функция вычисления
    function calculate() {
        clearErrors();
        
        const firstVal = firstInput.value.trim();
        const secondVal = secondInput.value.trim();
        const operator = operatorSelect.value;
        
        // Проверка на пустые поля
        if (firstVal === '') {
            showError('Введите первое число', firstInput);
            return;
        }
        
        if (secondVal === '') {
            showError('Введите второе число', secondInput);
            return;
        }
        
        // Проверка валидности чисел
        if (!isValidNumber(firstVal)) {
            showError('Некорректное первое число', firstInput);
            return;
        }
        
        if (!isValidNumber(secondVal)) {
            showError('Некорректное второе число', secondInput);
            return;
        }
        
        const num1 = parseFloat(firstVal);
        const num2 = parseFloat(secondVal);
        let result;
        let errorMessage = '';
        
        // Выполнение операции
        switch(operator) {
            case '+':
                result = num1 + num2;
                break;
            case '-':
                result = num1 - num2;
                break;
            case '*':
                result = num1 * num2;
                break;
            case '/':
                if (num2 === 0) {
                    errorMessage = 'Деление на ноль невозможно';
                    showError(errorMessage, secondInput);
                    return;
                }
                result = num1 / num2;
                break;
            case '%':
                result = num1 % num2;
                break;
            case '^':
                result = Math.pow(num1, num2);
                if (!isFinite(result)) {
                    errorMessage = 'Результат слишком большой';
                    showError(errorMessage, secondInput);
                    return;
                }
                break;
            default:
                result = '?';
        }
        
        // Округление до 10 знаков после запятой
        if (typeof result === 'number') {
            result = Math.round(result * 10000000000) / 10000000000;
        }
        
        // Форматирование результата
        const operation = `${num1} ${operator} ${num2} = ${result}`;
        
        // Добавляем в историю
        addToHistory(operation, result);
        
        // Отображаем результат
        displayResult(operation);
    }
    
    // Обработчик клика по кнопке
    calculateBtn.addEventListener('click', calculate);
    
    // Обработчик нажатия Enter в полях ввода
    firstInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculate();
    });
    
    secondInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculate();
    });
    
    // Очистка ошибок при вводе
    firstInput.addEventListener('input', () => {
        firstInput.classList.remove('error');
        const errorMsg = document.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    });
    
    secondInput.addEventListener('input', () => {
        secondInput.classList.remove('error');
        const errorMsg = document.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    });
    
    // Добавляем пример при загрузке
    firstInput.value = '123';
    secondInput.value = '567';
    
    // Инициализация с примером
    setTimeout(() => {
        calculate();
    }, 100);
});