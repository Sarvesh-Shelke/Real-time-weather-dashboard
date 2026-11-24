import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface Place { name: string; country: string; latitude: number; longitude: number; }

export interface WeatherData {
  current: {
    temperature_2m: number; apparent_temperature: number;
    relative_humidity_2m: number; wind_speed_10m: number;
    weather_code: number; time: string;
  };
  daily: {
    time: string[]; weather_code: number[];
    temperature_2m_max: number[]; temperature_2m_min: number[];
  };
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly KEY = 'favorite-cities';
  constructor(private http: HttpClient) {}

  // City name -> coordinates (Open-Meteo geocoding, no API key needed)
  geocode(city: string): Observable<Place | undefined> {
    return this.http
      .get<any>(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`)
      .pipe(map(r => r.results?.[0]));
  }

  // Coordinates -> live weather + 5 day forecast
  getWeather(lat: number, lon: number): Observable<WeatherData> {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`;
    return this.http.get<WeatherData>(url);
  }

  describe(code: number): { text: string; icon: string } {
    if (code === 0) return { text: 'Clear sky', icon: '☀️' };
    if (code <= 2) return { text: 'Partly cloudy', icon: '⛅' };
    if (code === 3) return { text: 'Overcast', icon: '☁️' };
    if (code <= 48) return { text: 'Fog', icon: '🌫️' };
    if (code <= 57) return { text: 'Drizzle', icon: '🌦️' };
    if (code <= 67) return { text: 'Rain', icon: '🌧️' };
    if (code <= 77) return { text: 'Snow', icon: '❄️' };
    if (code <= 82) return { text: 'Rain showers', icon: '🌧️' };
    if (code <= 86) return { text: 'Snow showers', icon: '🌨️' };
    return { text: 'Thunderstorm', icon: '⛈️' };
  }

  // Favorites (localStorage)
  getFavorites(): string[] {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]');
  }
  addFavorite(city: string) {
    const f = this.getFavorites();
    if (!f.some(c => c.toLowerCase() === city.toLowerCase())) {
      f.push(city);
      localStorage.setItem(this.KEY, JSON.stringify(f));
    }
  }
  removeFavorite(city: string) {
    localStorage.setItem(this.KEY, JSON.stringify(this.getFavorites().filter(c => c !== city)));
  }
}
