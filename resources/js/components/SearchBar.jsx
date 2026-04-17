import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
    const [city, setCity] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            onSearch(city);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md mx-auto mb-8">
            <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Entrez une ville..." 
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-md active:scale-95 transform transition-transform"
            >
                Rechercher
            </button>
        </form>
    );
}
