import './bootstrap';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import { fetchWeather } from './services/weatherService';

function App() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const handleSearch = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchWeather(city);
            setWeather(data);
        } catch (err) {
            setError("Impossible de trouver cette ville. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch('Casablanca');
    }, []);

    const getBackgroundClass = () => {
        if (!weather) return 'from-blue-500 to-blue-700';
        const code = weather.current.weatherCode;
        if (code === 0 || code === 1) return 'from-amber-400 to-orange-500'; // Sunny
        if (code >= 61 && code <= 65) return 'from-slate-500 to-blue-800'; // Rainy
        return 'from-blue-600 to-indigo-800'; // Cloudy/Default
    };

    return (
        <div className={`min-h-screen transition-colors duration-1000 bg-gradient-to-br ${getBackgroundClass()} py-12 px-4 font-sans text-white`}>
            <div className="max-w-xl mx-auto text-center">
                <header className="mb-12">
                    <h1 className="text-5xl font-extrabold mb-2 drop-shadow-lg">Météo App</h1>
                    <p className="text-white/80 font-medium">L'élégance au service de la précision</p>
                </header>

                <main className="space-y-8">
                    <SearchBar onSearch={handleSearch} />
                    
                    {loading && (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/20 backdrop-blur-md border border-red-500/50 p-4 rounded-xl text-white font-medium">
                            {error}
                        </div>
                    )}

                    {!loading && !error && weather && (
                        <>
                            <WeatherCard 
                                city={weather.city}
                                temp={weather.current.temp}
                                humidity={weather.current.humidity}
                                wind={weather.current.wind}
                                description={weather.current.description}
                                weatherCode={weather.current.weatherCode}
                            />
                            <Forecast items={weather.hourly} />
                        </>
                    )}
                </main>

                <footer className="mt-16 text-white/50 text-sm">
                    &copy; 2026 Formation Météo - Design by Antigravity
                </footer>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
