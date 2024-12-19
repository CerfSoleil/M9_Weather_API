class Weather {
    city: string;
    date: string;
    icon: string;
    iconDescription: string;
    temp: number;
    windSpeed: number;
    humidity: number;

    constructor (
        city: string,
        date: string,
        icon: string,
        iconDescription: string,
        temp: number,
        windSpeed: number,
        humidity: number,
    ) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.temp = temp;
        this.windSpeed = windSpeed;
        this.humidity = humidity;
    }
}

//This is currently used in weatherService
export default Weather;