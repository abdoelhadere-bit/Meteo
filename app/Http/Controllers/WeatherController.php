<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class WeatherController extends Controller
{
    const GEO_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
    const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

    public function fetch(Request $request)
    {
        $city = $request->query('city', 'Casablanca');

        try {
            // 1. Get coordinates
            $geoResponse = Http::get(self::GEO_API_URL, [
                'name' => $city,
                'count' => 1,
                'language' => 'fr',
                'format' => 'json'
            ]);

            if (!$geoResponse->successful() || empty($geoResponse->json()['results'])) {
                return response()->json(['error' => 'Ville non trouvée'], 404);
            }

            $geo = $geoResponse->json()['results'][0];

            // 2. Get weather data
            $weatherResponse = Http::get(self::WEATHER_API_URL, [
                'latitude' => $geo['latitude'],
                'longitude' => $geo['longitude'],
                'current_weather' => true,
                'hourly' => 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
                'timezone' => 'auto'
            ]);

            if (!$weatherResponse->successful()) {
                return response()->json(['error' => 'Erreur API Météo'], 500);
            }

            $current = $weatherResponse->json()['current_weather'];
            $hourly = $weatherResponse->json()['hourly'];

            return response()->json([
                'city' => "{$geo['name']}, {$geo['country']}",
                'current' => [
                    'temp' => round($current['temperature']),
                    'wind' => round($current['windspeed']),
                    'description' => $this->getWeatherDescription($current['weathercode']),
                    'weatherCode' => $current['weathercode'],
                    'humidity' => $hourly['relative_humidity_2m'][0],
                ],
                'hourly' => collect($hourly['time'])->slice(0, 4)->map(function ($time, $index) use ($hourly) {
                    return [
                        'time' => date('H:i', strtotime($time)),
                        'temp' => round($hourly['temperature_2m'][$index]),
                        'weatherCode' => $hourly['weather_code'][$index]
                    ];
                })
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function getWeatherDescription($code)
    {
        $descriptions = [
            0 => 'Ciel clair',
            1 => 'Principalement clair',
            2 => 'Partiellement nuageux',
            3 => 'Couvert',
            45 => 'Brouillard',
            48 => 'Brouillard givrant',
            51 => 'Bruine légère',
            53 => 'Bruine modérée',
            55 => 'Bruine dense',
            61 => 'Pluie faible',
            63 => 'Pluie modérée',
            65 => 'Pluie forte',
            71 => 'Neige légère',
            73 => 'Neige modérée',
            75 => 'Neige forte',
            80 => 'Averses de pluie faibles',
            81 => 'Averses de pluie modérées',
            82 => 'Averses de pluie violentes',
            95 => 'Orage',
        ];
        return $descriptions[$code] ?? 'Inconnu';
    }
}
