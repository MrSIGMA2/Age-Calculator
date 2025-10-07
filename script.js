
const dobInput = document.getElementById('dob');
const resultCards = document.getElementById('resultCards');
const yearsEl = document.getElementById('years');
const monthsEl = document.getElementById('months');
const daysEl = document.getElementById('days');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const calendarAge = document.getElementById('calendarAge');
let intervalId = null;

function validateDob(dobValue) {
    if (!dobValue) {
        showError('Please enter your date of birth.');
        return false;
    }
    // Accept dd/mm/yyyy format from input
    let dob;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dobValue)) {
        const [day, month, year] = dobValue.split('/');
        dob = new Date(`${year}-${month}-${day}`);
    } else {
        dob = new Date(dobValue);
    }
    if (isNaN(dob.getTime())) {
        showError('Invalid date format. Please use dd/mm/yyyy.');
        return false;
    }
    const now = new Date();
    if (dob > now) {
        showError('Date of birth cannot be in the future.');
        return false;
    }
    return dob;
}

function showError(msg) {
    resultCards.style.display = 'none';
    if (!document.getElementById('result')) {
        const resultDiv = document.createElement('div');
        resultDiv.id = 'result';
        resultDiv.style.marginTop = '18px';
        resultDiv.style.color = 'red';
        resultDiv.innerHTML = msg;
        resultCards.parentNode.insertBefore(resultDiv, resultCards);
    } else {
        document.getElementById('result').style.color = 'red';
        document.getElementById('result').innerHTML = msg;
    }
    if (intervalId) clearInterval(intervalId);
}

function clearError() {
    const resultDiv = document.getElementById('result');
    if (resultDiv) resultDiv.innerHTML = '';
}

function updateAge(dob) {
    const now = new Date();
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();
    let hours = now.getHours() - dob.getHours();
    let minutes = now.getMinutes() - dob.getMinutes();
    let seconds = now.getSeconds() - dob.getSeconds();

    if (seconds < 0) {
        seconds += 60;
        minutes--;
    }
    if (minutes < 0) {
        minutes += 60;
        hours--;
    }
    if (hours < 0) {
        hours += 24;
        days--;
    }
    if (days < 0) {
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
        days += prevMonth;
        months--;
    }
    if (months < 0) {
        months += 12;
        years--;
    }

    yearsEl.textContent = years;
    monthsEl.textContent = months;
    daysEl.textContent = days;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
    resultCards.style.display = 'flex';
    clearError();

    // Calendar and formatted age display
    if (calendarAge) {
        const dobDay = String(dob.getDate()).padStart(2, '0');
        const dobMonth = String(dob.getMonth() + 1).padStart(2, '0');
        const dobYear = dob.getFullYear();
        calendarAge.innerHTML = `<strong>Date of Birth:</strong> ${dobDay}/${dobMonth}/${dobYear}<br>
        <strong>Current Age:</strong> ${years} years, ${months} months, ${days} days, ${minutes} minutes, ${seconds} seconds`;
    }
}


function startLiveAge() {
    if (intervalId) clearInterval(intervalId);
    const dob = validateDob(dobInput.value);
    if (!dob) return;
    updateAge(dob);
    intervalId = setInterval(() => {
        updateAge(dob);
    }, 1000);
}

// Support dd/mm/yyyy input format
dobInput.addEventListener('input', startLiveAge);
dobInput.addEventListener('change', startLiveAge);
