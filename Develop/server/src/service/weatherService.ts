import dotenv from 'dotenv';
dotenv.config();

//interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

//Weather object defined in weatherClass.js
import Weather from './weatherClass.js';

//WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  protected baseURL?: string;
  protected APIKey?: string;
  private cityName: string = '';

  constructor () {
    this.baseURL = process.env.API_BASE_URL ?? '';
    this.APIKey = process.env.API_KEY ?? '';
  }
  // fetchLocationData method
  private async fetchLocationData(query: string) {
    try {
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`Error getting location data: ${response.statusText}`);
      }
      const data = await response.json();
      if (data.length === 0) {
        throw new Error('No location data found.');
      }
      return data[0];
    } catch (error) {
      console.error(error);
      throw new Error('Failed to get location data.');
    }
  }
  // Turns lat and lon gotten from __ into locationData
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, lon } = locationData;
    return { lat, lon };
  }
    // buildGeocodeQuery method
    //something about the api key is erroring...
  private buildGeocodeQuery(): string {
    if (!this.cityName || !this.APIKey) {
      throw new Error('City or API key is missing.');
    }
    return `${this.baseURL}/geo/1.0/direct?q=${this.cityName}&appid=${this.APIKey}`;
  }
  // buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    if (!this.APIKey) {
      throw new Error('API key is missing.');
    }
    const { lat, lon } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${this.APIKey}`;
  }
  // fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = await this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }
  //fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {
    try {
      const query = this.buildWeatherQuery(coordinates);
      const response = await fetch(query);
      if (!response.ok) {
        throw new Error(`Error fetching weather data: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw new Error('Failed to fetch weather data.');
    }
  }
  //parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const { temp, humidity } = response.main;
    const { speed: windSpeed } = response.wind;
    const { description, icon } = response.weather[0];
    console.log(`from parseCurrentWeather | Temp ${temp}, Humidity ${humidity}, description ${description}, icon ${icon}, windspeed ${windSpeed}`)
    return new Weather(this.cityName, response.dt_txt, temp, icon, description, windSpeed, humidity)
  }
  //buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let filteredDays = weatherData.filter((day: any) => day.dt_txt.includes('12:00:00'));

    //Fixing misplaced variables happens in weatherClass.ts
    const forecast: Weather[] = filteredDays.map((day: any) => {
      const { speed: windSpeed, temp } = day.main;
      const { humidity } = day.wind;
      const { description, icon } = day.weather[0];
      //console.log(`From buildForecastArray | ${this.cityName}, ${day.dt_txt}, ${icon}, ${description}, ${temp}, ${humidity}, ${windSpeed}`);
      return new Weather(this.cityName, day.dt_txt, icon, description, temp, humidity, windSpeed);
    });
    return [currentWeather, forecast];
  }
  // getWeatherForCity method
  async getWeatherForCity(city: string) {
    if (!city) {
      throw new Error('City name is missing');
    }
    try {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData: any = await this.fetchWeatherData(coordinates);
      const currentWeather = await this.parseCurrentWeather(weatherData.list[0]);
      const forecast = await this.buildForecastArray(currentWeather, weatherData.list);

      if (!currentWeather || !forecast) {
        throw new Error('Failed to parse weather data.');
      } return forecast;
    } catch (error) {
      console.error('Error getting weather data', error);
      throw new Error('Unable to get weather data.');
    }
  }
}

export default new WeatherService();
