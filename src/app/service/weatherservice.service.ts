import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherserviceService {

  progressFlag:boolean = true;

  API_KEY_ = `45933dc516704ff493b111701232707`


  API_KEY = "d9bc6c02c4393d05537b02f0dcd6da1d";
  API_URL = "https://api.openweathermap.org/data/2.5/weather";
  API_FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast";
  UNITS = "metric"
  acceskey = "tUAXqn-SoOYD0uY8PS5JZnv7gNnERAuW8qkkZNgJul8"

  // https://api.openweathermap.org/data/2.5/weather?lat=44.34&lon=10.99&appid={API key}
  // api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}

  constructor(private http: HttpClient) { }

  getForecastData(city:string){
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${this.API_KEY_}&q=${city}&days=1&aqi=no&alerts=no`;
    return this.http.get<any>(url);
  }

  get5daysForecastData(city:string){
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${this.API_KEY_}&q=${city}&days=6&aqi=no&alerts=no`;
    return this.http.get<any>(url);
  }

  // getWeather(city: string){
  //   const url = `${this.API_URL}?q=${city}&units=${this.UNITS}&appid=${this.API_KEY}&days=1&aqi=no&alerts=no`;
  //   return this.http.get<any>(url);
  // }

  // get4DaysForecast(city: string){
  //   const url = `${this.API_FORECAST_URL}?q=${city}&units=${this.UNITS}&appid=${this.API_KEY}`;
  //   return this.http.get<any>(url);
  // }

  // getPhotos(keyword:string){
  //   const url = `https://api.unsplash.com/search/photos?page=1&query=${keyword}&client_id=${this.acceskey}`;
  //   return this.http.get<any>(url);
  // }

  // getnewPhotos(keyword:string){
  //   const url = `https://api.teleport.org/api/urban_areas&query=${keyword}`
  //   return this.http.get<any>(url)
  // }

}
