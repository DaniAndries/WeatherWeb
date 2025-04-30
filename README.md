<h1 align="center">WeatherWeb</h1>

<p align="center">
  <b>A responsive web application built with Flask and Bootstrap that fetches real-time weather data using the OpenWeatherMap API.</b>
</p>

---

## 🌦️ Features

- **Frontend**: Clean and responsive interface styled with **Bootstrap 5**.
- **Backend**: Built with **Flask** in **Python**, interacting with the **OpenWeatherMap API**.
- **Functionality**:
  - Search weather by city name.
  - Display temperature, humidity, wind speed, weather description, and icons.
  - Error handling for invalid or unreachable locations.

## 🔧 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DaniAndries/weather-dashboard.git
   cd weather-dashboard
   ```
2. **Create a virtual environment and install dependencies:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # En Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. **Add your API key:**
  Crea un archivo .env en la raíz del proyecto con el contenido:
   ```ini
   OPENWEATHER_API_KEY=tu_api_key_aqui
   ```
4. **Run the application:**
   ```bash
  	flask run
   ```
## 📂 Project Structure
    weatherweb/
    ├── static/
    │   └── css/
    │       └── styles.css
    │   └── js/
    │       └── script.js
    ├── templates/
    │   └── index.html
    ├── translations/
    │   └── es/
    │       └── lc_messagess/
    │                     └──mesages.po
    │   └── fr/
    │       └── lc_messagess/
    │                     └──mesages.po
    ├── app.py
    ├── babel.cfg
    ├── config.py
    ├── messages.pot
    ├── LICENSE
    ├── requirements.txt
    └── README.md
    
## 📜 License
  This project is licensed under the [GNU General Public License](LICENSE).

## 👥 Author
- **[Dani Andries](https://github.com/DaniAndries)**

 ---

<p align="center">
  <i>Thank you for visiting this repository! If you have any suggestions or improvements, feel free to contribute.</i>
</p>
