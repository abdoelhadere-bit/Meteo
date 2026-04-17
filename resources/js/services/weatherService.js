import axios from 'axios';

const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

export const fetchWeather = async (city) => {
    try {
        // 1. Get coordinates
        const geoResponse = await axios.get(GEO_API_URL, {
            params: {
                name: city,
                count: 1,
                language: 'fr',
                format: 'json'
            }
        });

        if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
            throw new Error('Ville non trouvée');
        }

        const { latitude, longitude, name, country } = geoResponse.data.results[0];

        // 2. Get weather data
        const weatherResponse = await axios.get(WEATHER_API_URL, {
            params: {
                latitude,
                longitude,
                current_weather: true,
                hourly: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
                timezone: 'auto'
            }
        });

        return {
            city: `${name}, ${country}`,
            current: {
                temp: Math.round(weatherResponse.data.current_weather.temperature),
                wind: Math.round(weatherResponse.data.current_weather.windspeed),
                description: getWeatherDescription(weatherResponse.data.current_weather.weathercode),
                weatherCode: weatherResponse.data.current_weather.weathercode,
                humidity: weatherResponse.data.hourly.relative_humidity_2m[0], // simplified
            },
            hourly: weatherResponse.data.hourly.time.slice(0, 4).map((time, index) => ({
                time: new Date(time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
                temp: Math.round(weatherResponse.data.hourly.temperature_2m[index]),
                weatherCode: weatherResponse.data.hourly.weather_code[index]
            }))
        };
    } catch (error) {
        console.error("Error fetching weather:", error);
        throw error;
    }
};

const getWeatherDescription = (code) => {
    const descriptions = {
        0: 'Ciel clair',
        1: 'Principalement clair',
        2: 'Partiellement nuageux',
        3: 'Couvert',
        45: 'Brouillard',
        48: 'Brouillard givrant',
        51: 'Bruine légère',
        53: 'Bruine modérée',
        55: 'Bruine dense',
        61: 'Pluie faible',
        63: 'Pluie modérée',
        65: 'Pluie forte',
        71: 'Neige légère',
        73: 'Neige modérée',
        75: 'Neige forte',
        80: 'Averses de pluie faibles',
        81: 'Averses de pluie modérées',
        82: 'Averses de pluie violentes',
        95: 'Orage',
    };
    return descriptions[code] || 'Inconnu';
};
