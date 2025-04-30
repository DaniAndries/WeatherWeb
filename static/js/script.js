document.addEventListener("DOMContentLoaded", () => {
    const dropdownItems = document.querySelectorAll(".dropdown-item");
    const dropdownButton = document.getElementById("dropdownMenuButton");

    // Escuchar cambios en la selección del dropdown y obtener el clima
    dropdownItems.forEach(item => {
        item.addEventListener("click", function () {
            let selectedCity = this.getAttribute("data-value");
            dropdownButton.textContent = selectedCity; // Cambia el texto del botón
            fetchWeather(`city=${selectedCity}`); // Llama a la función para actualizar el clima
        });
    });

    // Obtener clima según la ubicación si el navegador lo permite
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            fetchWeather(`lat=${lat}&lon=${lon}`);
        }, (error) => {
            console.warn("❌ Unable to get location:", error);
            showMessage("❌ Unable to get location.", "text-warning");
        });
    } else {
        console.warn("⚠️ Geolocation is not supported by this browser.");
        showMessage("⚠️ Geolocation not supported.", "text-warning");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("search-input");

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault(); // Evita el envío del formulario
        let city = searchInput.value.trim(); // Obtener el valor del input

        if (city) {
            fetchWeather(`city=${city}`);
        } else {
            alert("Please enter a city name.");
        }
    });
});

async function fetchWeather(query) {
    try {
        showMessage("", "text-info");
        let response = await fetch(`/weather?${query}`);

        // Verificar el estado de la respuesta antes de intentar parsear JSON
        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        let text = await response.text();  // Obtener la respuesta como texto

        let data;
        try {
            data = JSON.parse(text);  // Intentar parsear el JSON manualmente
        } catch (e) {
            console.error("Error parseando JSON:", e);
            showMessage("❌ Error procesando respuesta del servidor.", "text-danger");
            return;  // Salimos para evitar más errores
        }

        // Mostrar los datos del clima y asegurarse de que el div esté visible
        displayWeather(data);
        document.getElementById("weather-result").style.display = "block";

        // Vaciar el campo de búsqueda después de actualizar el clima
        document.getElementById("search-input").value = "";

    } catch (error) {
        // Manejo del error
        showMessage("❌ Error getting weather.", "text-danger");
        console.error("Error en fetch:", error);
        // Vaciar el campo de búsqueda después de actualizar el clima
        document.getElementById("search-input").value = "";
    }
}

// Función para mostrar los datos del clima
function displayWeather(data) {
    document.getElementById("city-name").innerText = data.city;
    document.getElementById("description").innerHTML = `🌥️ <strong>Weather:</strong> ${data.description}`;
    document.getElementById("temperature").innerHTML = `🌡️ <strong>Temperature:</strong> ${Math.round(data.temp)}°C`;
    document.getElementById("feels-like").innerHTML = `🤲 <strong>Feels Like:</strong> ${Math.round(data.feels_like)}°C`;
    document.getElementById("pressure").innerHTML = `📊 <strong>Pressure:</strong> ${data.pressure} hPa`;
    document.getElementById("humidity").innerHTML = `💧 <strong>Humidity:</strong> ${data.humidity}%`;
    document.getElementById("visibility").innerHTML = `🌫️ <strong>Visibility:</strong> ${data.visibility / 1000} km`;
    
    // Manejo de la salida y puesta del sol
    const sunriseTime = new Date(data.sunrise * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const sunsetTime = new Date(data.sunset * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    
    document.getElementById("sunrise").innerHTML = `🌅 <strong>Sunrise:</strong> ${sunriseTime}`;
    document.getElementById("sunset").innerHTML = `🌇 <strong>Sunset:</strong> ${sunsetTime}`;

    // Obtener dirección del viento y ángulo correcto
    const windDirection = data.wind_direction;
    const windAngle = getWindAngle(windDirection);

    // Actualizar HTML con la flecha del viento
    document.getElementById("wind").innerHTML = `💨 <strong>Wind:</strong> ${data.wind_speed} m/s (${windDirection}) <span id="wind-arrow" class="wind-arrow" style="font-size: 1.2rem;">➤</span>`;

    // Aplicar rotación a la flecha
    setTimeout(() => {
        const windArrow = document.getElementById("wind-arrow");
        if (windArrow) {
            windArrow.style.display = "inline-block";
            windArrow.style.transform = `rotate(${windAngle}deg)`;
        }
    }, 50);

    // Mostrar el ícono del clima
    let iconElement = document.getElementById("weather-icon");
    iconElement.src = data.icon;
    iconElement.style.display = "block";
}

// Función para obtener el ángulo correcto según la dirección cardinal
function getWindAngle(direction) {
    const angles = {
        "N": -90,
        "NE": -45,
        "E": 1,
        "SE": 45,
        "S": 90,
        "SW": 135,
        "W": 180,
        "NW": -135
    };

    return angles[direction] || -90;
}

// Función para mostrar mensajes de error o advertencia
function showMessage(message, className) {
    let errorMsg = document.getElementById("error-message");
    errorMsg.innerHTML = `<p class="${className}">${message}</p>`;
    errorMsg.style.display = message ? "block" : "none";
}  

<script crossorigin="anonymous" src="https://cdn.amcapi.com/translation/cloudtranslation-1.0.0.min.js"></script>