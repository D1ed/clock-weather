
const apiKey = 'a061c5cf224dc563e73ce50c27c99bd4'; // API ключ для доступа к OpenWeatherMap
const city = 'Dobryanka'; // Город для отображения погоды


function updateTimeAndDate() {
    const now = new Date();
    const options = { month: 'long' };
    const monthName = new Intl.DateTimeFormat('ru-RU', options).format(now);

    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    const time = `${hours}:${minutes}`;
    const timeWithSeconds = `${time}:${seconds}`;
    const date = `${now.getDate()} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${now.getFullYear()}`;

    document.getElementById('current-time').textContent = time;
    document.getElementById('current-seconds').textContent = `:${seconds}`;
    document.getElementById('current-date').textContent = date;
}

updateTimeAndDate();
setInterval(updateTimeAndDate, 1000);


function fetchWeatherData() {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const currentWeatherDiv = document.getElementById('current-weather');
            const temp = data.main.temp.toFixed(1);
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
            const description = data.weather[0].description;

            currentWeatherDiv.innerHTML = `
                <div id="current-temp">${temp} °C</div>
                <img src="${iconUrl}" alt="weather icon">
            `;
        })
        .catch(error => console.error("Error fetching current weather data: ", error));

    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const forecastDiv = document.getElementById('forecast');
            forecastDiv.innerHTML = '';
            
            // Берем данные для прогнозов с интервалом в 24 часа
            data.list.filter((entry, index) => index % 8 === 0).slice(1, 4).forEach(item => {
                const date = new Date(item.dt * 1000).toLocaleDateString('ru-RU');
                const temp = item.main.temp.toFixed(1);
                const iconCode = item.weather[0].icon;
                const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

                forecastDiv.innerHTML += `
                    <div>
                        <strong>${date}</strong>
                        <img src="${iconUrl}" alt="weather icon">${temp} °C
                    </div>
                `;
            });
        })
        .catch(error => console.error("Error fetching forecast weather data: ", error));
}

fetchWeatherData();
setInterval(fetchWeatherData, 900000); // Обновление данных каждые 15 минут
