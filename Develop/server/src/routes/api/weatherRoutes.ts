import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

//POST Request with city name to retrieve weather data
router.post('/', async (req, res) => {
  try {
    const city = req.body.cityName;
    if (!city) {
      return res.status(400).json({error: 'City name is required.'});
    }
    const weatherData = await WeatherService.getWeatherForCity(city);
    const existingCity = await HistoryService.getCities().then((cities) => 
    cities.find((existingCity: {name: string}) => existingCity.name === city)
  );

  if (!existingCity) {
    await HistoryService.addCity(city);
    console.log(`City "${city}" added to history`);
  } else {
    console.log(`City "${city} already in search history.`);
  }

  return res.status(200).json(weatherData);
  } catch (error) {
    return res.status(500).json({ message: 'Faied to get weather data.'});
  }
});

//GET search history
router.get('/history', async (req, res) => {
  try {
    const city = req.query.city;
    console.log('Queried city test:', city);
    const cities = await HistoryService.getCities();
    res.json(cities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const cityId = req.params.id;
    await HistoryService.removeCity(cityId);
    res.json({ message: 'City removed from search history' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete city from search history' });
  }
});

export default router;
