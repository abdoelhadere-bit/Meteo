import React from 'react';

export default function WeatherCard({ city, temp, humidity, wind, description, weatherCode }) {
    const getWeatherEmoji = (code) => {
        if (code === 0) return '☀️';
        if (code <= 3) return '🌤️';
        if (code === 45 || code === 48) return '🌫️';
        if (code >= 51 && code <= 65) return '🌧️';
        if (code >= 71 && code <= 77) return '❄️';
        if (code >= 80 && code <= 82) return '🌦️';
        if (code >= 95) return '⛈️';
        return '🌡️';
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-md mx-auto mb-8 border border-white/20 text-center transform transition-all hover:scale-[1.02]">
            <h2 className="text-3xl font-bold text-white mb-1 drop-shadow-md">{city}</h2>
            <p className="text-white/70 capitalize mb-6 text-lg">{description}</p>
            
            <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-7xl">{getWeatherEmoji(weatherCode)}</span>
                <div className="text-7xl font-black text-white drop-shadow-lg">
                    {temp}°
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-white/50 text-xs uppercase tracking-widest mb-1">Humidité</span>
                    <span className="text-2xl font-bold text-white">{humidity}%</span>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <span className="block text-white/50 text-xs uppercase tracking-widest mb-1">Vent</span>
                    <span className="text-2xl font-bold text-white">{wind} <small className="text-sm font-normal">km/h</small></span>
                </div>
            </div>
        </div>
    );
}
