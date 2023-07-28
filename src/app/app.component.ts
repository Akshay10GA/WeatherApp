import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { WeatherserviceService } from './service/weatherservice.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    public weatherService: WeatherserviceService,
    private datepipe: DatePipe,
    private http: HttpClient,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  country: any;
  videoSource: any;
  flag: any;
  date: any;
  forecast: any;
  fivedaysforecast: any;
  CurrentCity: any;
  DayMonth: any;
  CurrentTemp: any; //current.temp_c
  CurrentWeather: String=''; //current.condition.text
  CurrentIcon: any; //current.condition.icon
  MaxTemp: any; //forecast.forecastday[0].day.maxtemp_c
  MinTemp: any; //forecast.forecastday[0].day.mintemp_c
  Wind: any; //current.condition.wind_mph
  SunRise: any; //forecast.forecastday[0].day.astro.sunrise
  SunSet: any; //forecast.forecastday[0].day.astro.sunset
  WillRain: any; //forecast.forecastday[0].day.daily_will_it_rain
  fivedaysdatearr: any = [];
  fivedaysmaxtemparr: any = [];
  fivedaysmintemparr: any = [];
  fivedayscondition: any = [];
  fivedaysicon: any = [];
  errorMessage: string = '';

  ngOnInit(): void {
    this.startLoading();
    this.http.get<any>(`https://api.ipify.org?format=json`).subscribe((IP) => {
      this.http
        .get<any>(`https://ip-api.com/json/${IP.ip}`)
        .subscribe((CurLoc) => {
          this.CurrentCity = `${CurLoc.city}`;
          this.date = new Date();
          const options: Intl.DateTimeFormatOptions = {
            day: 'numeric', // Get the day of the month as a number (e.g., "15")
            month: 'long', // Get the full name of the month (e.g., "August")
            weekday: 'long', // Get the full name of the day (e.g., "Monday")
          };
          this.DayMonth = this.date.toLocaleDateString(undefined, options);
          this.date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
          this.serachCityWeather(this.CurrentCity);
          this.searchfivedaysforecast(this.CurrentCity);
          this.stopLoading();
        });
    });
  }

  onKeydown(event: { key: string; },value: any){
    if (event.key === "Enter") {
      this.serachCityWeather(value);
      this.searchfivedaysforecast(value);
    }
  }

  startLoading() {
    this.flag = true;
    this.changeDetectorRef.detectChanges();
  }
  stopLoading() {
    this.flag = false;
    this.changeDetectorRef.detectChanges();
  }

  serachCityWeather(event: any) {
    if(event==""){
      this.ngOnInit();
      this.errorMessage='';
    }
    setTimeout(() => {
      this.errorMessage = '';
    }, 2000); 
    this.country = '';
    this.startLoading();
    this.weatherService.getForecastData(event).subscribe((res: any) => {
      this.forecast = res;
      this.CurrentCity = `${this.forecast.location.name}, ${this.forecast.location.country}`;
      this.CurrentTemp = this.forecast.current.temp_c;
      this.CurrentWeather = this.forecast.current.condition.text;
      this.CurrentIcon = this.forecast.current.condition.icon;
      this.MaxTemp = this.forecast.forecast.forecastday[0].day.maxtemp_c;
      this.MinTemp = this.forecast.forecast.forecastday[0].day.mintemp_c;
      this.Wind = this.forecast.current.wind_mph;
      this.SunRise = this.forecast.forecast.forecastday[0].astro.sunrise;
      this.SunSet = this.forecast.forecast.forecastday[0].astro.sunset;
      if (this.forecast.forecast.forecastday[0].day.daily_will_it_rain == 1) {
        this.WillRain = 'Yes';
      } else {
        this.WillRain = 'No';
      }
      this.setVideoBackground();
      this.stopLoading();
    });
  }

  searchfivedaysforecast(event: any) {
    this.weatherService.get5daysForecastData(event).subscribe(
      (res) => {
        this.fivedaysforecast = res;

        for (let index = 0; index < 5; index++) {
          this.fivedaysdatearr[index + 1] =
            this.fivedaysforecast.forecast.forecastday[index + 1].date;
          this.fivedaysmaxtemparr[index + 1] =
            this.fivedaysforecast.forecast.forecastday[index + 1].day.maxtemp_c;
          this.fivedaysmintemparr[index + 1] =
            this.fivedaysforecast.forecast.forecastday[index + 1].day.mintemp_c;
          this.fivedayscondition[index + 1] =
            this.fivedaysforecast.forecast.forecastday[
              index + 1
            ].day.condition.text;
          this.fivedaysicon[index + 1] =
            this.fivedaysforecast.forecast.forecastday[
              index + 1
            ].day.condition.icon;
        }
        this.fivedaysdatearr[0] =
          this.fivedaysforecast.forecast.forecastday[0].date;
      },
      (error) => {
        if(event==""){
          this.errorMessage='';
        }else{
        this.errorMessage = `No data available for ${event}`;
        this.flag = false;}
      }
    );
  }

  setVideoBackground() {
    if(this.WillRain=="Yes"){this.videoSource="assets/Rain Background.mp4"}
    if(this.WillRain=="No"){this.videoSource="assets/sunnyday.mp4"}
    if(this.WillRain=="Yes" && this.CurrentWeather.includes("thunder")){this.videoSource="assets/thunder.mp4"}
    if(this.WillRain=="Yes" && this.CurrentWeather.includes("snow")){this.videoSource="assets/snow.mp4"}
    if(this.WillRain=="No" && this.CurrentWeather.includes("cloud") || this.CurrentWeather.includes("Mist")){this.videoSource="assets/rainyclouds.mp4"}
    localStorage.setItem("video",this.videoSource);
    this.changeDetectorRef.detectChanges();
  }
}
