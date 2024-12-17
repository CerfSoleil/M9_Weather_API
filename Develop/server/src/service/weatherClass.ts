class Weather {
    city: string;
    date: string;
    icon: string;
    iconDescription: string;
    tempF: number;
    humidity: number;
    windSpeed: number;

    constructor (
        city: string,
        date: string,
        icon: string,
        iconDescription: string,
        tempF: number,
        humidity: number,
        windSpeed: number,
    ) {
        this.city = city;
        this.date = date;
        this.icon = icon;
        this.iconDescription = iconDescription;
        this.tempF = tempF;
        this.humidity = humidity;
        this.windSpeed = windSpeed;
    }
}

export default Weather;