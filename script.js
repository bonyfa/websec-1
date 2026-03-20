document.addEventListener('DOMContentLoaded', function() {
    const firstInput = document.getElementById('firstNumber');
    const secondInput = document.getElementById('secondNumber');
    const operatorSelect = document.getElementById('operator');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultOutput = document.getElementById('result');
    
    let history = [];
    
    function isValidNumber(value) {
        if (value === '') return false;
        return !isNaN(parseFloat(value)) && isFinite(value) && /^-?\d*\.?\d+$/.test(value);
    }
    
    function clearErrors() {
        firstInput.classList.remove('error');
        secondInput.classList.remove('error');
        const oldError = document.querySelector('.error-message');
        if (oldError) oldError.remove();
    }
    
    function showError(message, element) {
        element.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        document.getElementById('output').appendChild(errorDiv);
    }
    
    function addToHistory(operation) {
        history.unshift({ operation: operation });
        if (history.length > 5) history.pop();
    }
    
    function displayResult(currentResult) {
        let html = '';
        history.slice(1).forEach(item => {
            html += `<div class="result-item prev">${item.operation}</div>`;
        });
        html += `<div class="result-item">${currentResult}</div>`;
        resultOutput.innerHTML = html;
    }
    
    function calculate() {
        clearErrors();
        
        const firstVal = firstInput.value.trim();
        const secondVal = secondInput.value.trim();
        const operator = operatorSelect.value;
        
        if (firstVal === '' || secondVal === '') {
            showError('Заполните все поля', firstVal === '' ? firstInput : secondInput);
            return;
        }
        
        if (!isValidNumber(firstVal) || !isValidNumber(secondVal)) {
            showError('Введите корректное число', !isValidNumber(firstVal) ? firstInput : secondInput);
            return;
        }
        
        const num1 = parseFloat(firstVal);
        const num2 = parseFloat(secondVal);
        let result;
        
        switch(operator) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/':
                if (num2 === 0) {
                    showError('Деление на ноль!', secondInput);
                    return;
                }
                result = num1 / num2;
                break;
            default: result = 0;
        }
        
        result = Number(result.toFixed(10));
        
        const operation = `${num1} ${operator} ${num2} = ${result}`;
        addToHistory(operation);
        displayResult(operation);
    }
    
    calculateBtn.addEventListener('click', calculate);
    [firstInput, secondInput].forEach(inp => {
        inp.addEventListener('keypress', (e) => { if (e.key === 'Enter') calculate(); });
        inp.addEventListener('input', clearErrors);
    });
});