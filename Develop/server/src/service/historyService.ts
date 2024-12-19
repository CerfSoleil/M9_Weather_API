import fs from 'node:fs/promises';
import {v4 as uuidv4} from 'uuid';


//City class & constructor
class City {
  name: string;
  id: string;

  constructor (name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

//searchHistory.json read
class HistoryService {
  private async read() {
    const filePath = 'db/searchHistory.json';
    try {
      const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
      console.error('Failed to read file:', error);
      return;
    }
  }
  // searchHistory.json file write
private async write(cities: City[]) {
  const filePath = './db/searchHistory.json';
  try {
    await fs.writeFile(filePath, JSON.stringify(cities, null, 2));
  } catch (error) {
    console.error ('Problem writing file:', error);
  }
}
 //Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    try {
      return await this.read();
    } catch (error) {
      console.error('Error returning city objects:', error);
      return;
    }
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    try {
      const newCity = new City(city, uuidv4());
      const cities = await this.read();
      cities.push(newCity);
      await this.write(cities);
      return newCity;
    } catch (error) {
      console.error('Error adding city:', error);
      return;
    }
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    try {
      const cities = await this.read();
      const filteredCities = cities.filter((city: City) => city.id !== id);
      await this.write(filteredCities);
    } catch (error) {
      console.error('Error deleting city:', error);
    }
  }
}

export default new HistoryService();
