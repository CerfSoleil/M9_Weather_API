class Weather {
    city: string;
    date: string;
    temp: string;
    iconDescription: string;
    description: number;
    windSpeed: number;
    humidity: number;

    constructor (
        city: string,
        date: string,
        temp: string,
        iconDescription: string,
        description: number,
        windSpeed: number,
        humidity: number,
    ) {
        this.city = city;
        this.date = date;
        this.temp = temp;
        this.iconDescription = iconDescription;
        this.description = description;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}

//This is currently used in weatherService
export default Weather;