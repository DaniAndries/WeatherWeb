from flask import Flask, render_template, request, jsonify
from flask_babel import Babel
import requests
import config

app = Flask(__name__)

LANGUAGES = ['en', 'es', 'fr']

def get_locale():
    return request.accept_languages.best_match(LANGUAGES)

babel = Babel(app, locale_selector=get_locale)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/weather")
def get_weather():
    lat = request.args.get("lat")
    lon = request.args.get("lon")
    city = request.args.get("city")
    api_key = config.API_KEY

    # Construcción de la URL de la API de OpenWeatherMap
    if city:
        url = f"http://api.openweathermap.org/data/2.5/weather?q={city}&appid={api_key}&units=metric&lang=en"
    elif lat and lon:
        url = f"http://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={api_key}&units=metric&lang=en"
    else:
        return jsonify({"error": "Parameters are missing"}), 400

    # Petición a la API
    response = requests.get(url).json()

    # Manejo de errores si la API no devuelve datos válidos
    if response.get("cod") != 200:
        return jsonify({"error": "City not found"}), 404
    
    return show_weather(response)

def show_weather(response):
    """Extrae los datos relevantes del clima y los devuelve en JSON."""
    wind_data = response.get("wind", {})
    wind_speed = wind_data.get("speed", 0)
    wind_deg = wind_data.get("deg", 0)

    weather_data = {
        "city": response.get("name", "Unknown"),
        "description": response.get("weather", [{"description": "No description"}])[0]["description"].capitalize(),
        "temp": response.get("main", {}).get("temp", "N/A"),
        "icon": f"http://openweathermap.org/img/wn/{response.get('weather', [{'icon': '01d'}])[0]['icon']}@2x.png",
        "wind_speed": wind_speed if 'wind_speed' in locals() else "N/A",
        "wind_direction": get_wind_direction(wind_deg) if 'wind_deg' in locals() else "N/A",
        "wind_deg": wind_deg if 'wind_deg' in locals() else "N/A",
        "pressure": response.get("main", {}).get("pressure", "N/A"),
        "humidity": response.get("main", {}).get("humidity", "N/A"),
        "visibility": response.get("visibility", "N/A"),
        "country": response.get("sys", {}).get("country", "N/A"),
        "sunrise": response.get("sys", {}).get("sunrise", "N/A"),
        "sunset": response.get("sys", {}).get("sunset", "N/A"),
        "feels_like": response.get("main", {}).get("feels_like", "N/A"),
    }


    return jsonify(weather_data)

def get_wind_direction(degrees):
    """Convierte grados en direcciones cardinales."""
    directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
    index = int((degrees + 22.5) // 45) % 8
    return directions[index]

if __name__ == "__main__":
    app.run(debug=True)
