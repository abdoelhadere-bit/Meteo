import React from 'react';

function ForecastItem({ hour, temp, weatherCode }) {
    const getWeatherEmoji = (code) => {
        if (code === 0) return '☀️';
        if (code <= 3) return '🌤️';
        if (code >= 51 && code <= 65) return '🌧️';
        if (code >= 95) return '⛈️';
        return '☁️';
    };

    return (
        <div className="flex flex-col items-center bg-white/10 backdrop-blur-md p-4 rounded-2xl min-w-[100px] border border-white/10 shadow-lg">
            <span className="text-white/70 font-medium mb-1">{hour}</span>
            <span className="text-3xl mb-1 drop-shadow-sm">{getWeatherEmoji(weatherCode)}</span>
            <span className="text-xl font-bold text-white">{temp}°</span>
        </div>
    );
}

export default function Forecast({ items }) {
    if (!items) return null;

    return (
        <div className="max-w-md mx-auto">
            <h3 className="text-white/80 font-semibold mb-4 text-left px-2 uppercase tracking-wider text-sm">Prévisions (prochaines heures)</h3>
            <div className="flex justify-start gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {items.map((item, index) => (
                    <ForecastItem 
                        key={index} 
                        hour={item.time} 
                        temp={item.temp} 
                        weatherCode={item.weatherCode} 
                    />
                ))}
            </div>
        </div>
    );
}
