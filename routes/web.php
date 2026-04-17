<?php

use App\Http\Controllers\WeatherController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/api/weather', [WeatherController::class, 'fetch']);
