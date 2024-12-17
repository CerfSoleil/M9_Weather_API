import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  long: number;
}

// TODO: Define a class for the Weather object
import Weather from './weatherClass.js';

// TODO: Complete the WeatherService class
class WeatherService {
  // Define the baseURL, API key, and city name properties
  protected baseURL?: string;
  protected APIKey?: string;
  private cityName: string = '';

  constructor () {
    this.baseURL = process.env.API_BASE_URL || '';
    this.APIKey = process.env.API_KEY || '';
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
  // destructureLocationData method
  private destructureLocationData(locationData: Coordinates): Coordinates {
    const { lat, long } = locationData;
    return { lat, long };
  }
    // buildGeocodeQuery method
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
    const { lat, long } = coordinates;
    return `${this.baseURL}/data/2.5/forecast?lat=${lat}&long=${long}&units=imperial&appid=${this.APIKey}`;
  }
  // fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
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
    const { tempF, humidity } = response.main;
    const { speed: windSpeed } = response.wind;
    const { description, icon } = response.weather[0];
    return new Weather(this.cityName, response.dt_txt, tempF, icon, description, windSpeed, humidity)
  }
  //buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    let filteredDays = weatherData.filter((day: any) => day.dt_txt.includes('12:00:00'));

    const forecast: Weather[] = filteredDays.map((day: any) => {
      const {tempF, humidity } = day.main;
      const { speed: windSpeed } = day.wind;
      const {description, icon } = day.weather[0];
      return new Weather(this.cityName, day.dt_txt, icon, description, tempF, windSpeed, humidity);
    });
    return {currentWeather, forecast};
  }
  // getWeatherForCity method
  async getWeatherForCity(city: string) {
    if (!city) {
      throw new Error('City name is missing');
    }
    try {
      this.cityName = city;
      const coordinates = await this.fetchAndDestructureLocationData();
      const weatherData: any = this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      const forecast = this.buildForecastArray(currentWeather, weatherData.list);

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
