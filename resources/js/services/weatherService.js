import axios from 'axios';

export const fetchWeather = async (city) => {
    try {
        const response = await axios.get('/api/weather', {
            params: { city }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching weather from proxy:", error);
        throw error;
    }
};
