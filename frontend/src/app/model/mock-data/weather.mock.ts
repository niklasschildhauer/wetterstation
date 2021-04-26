import { IndoorAirQuality, OutdoorWeather, Pollen, WeatherForecast, WeatherHistory, WeatherData} from '../weather';

export var OUTDOORWEATHER: OutdoorWeather = {
    temperature: 14,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 66,
    timestamp: new Date,
    weather: "sunny",
    textTTS: "Aktuell hat es 14 Grad Celsius mit einer Höchsttemperatur von 20 Grad.",
};

export var FORECAST: WeatherForecast[] = [
    {
        date: new Date,
        temperature: 23,
        weather: "rainy",
        day: "Tue",
        textTTS: "Am Dienstag wird es regnen",
    }, 
    {
        date: new Date,
        temperature: 21,
        weather: "sunny",
        day: "Wed",
        textTTS: "Am Mittwoch ist es sonnig",
    }
];

export var POLLEN: Pollen[] = [
    {
        name: "Esche",
        today: 1,
        tomorrow: 0,
        textTTS: "Esche ist sehr schlecht"
    },
    {
        name: "Roggen",
        today: 0,
        tomorrow: 2 ,
        textTTS: "Roggend ist gut"
    }
];

export var INDOORAIRQUALITY: IndoorAirQuality[] = [
    {
        roomID: "32895984u5z524",
        roomName: "Wohnzimmer",
        airQuality: 42,
        status: "good",
        textTTS: "Die Innenraumluftqalität ist im Normbereich",
    },
    {
        roomID: "1535984u5z524",
        roomName: "Schlafzimmer",
        airQuality: 122,
        status: "bad",
        textTTS: "Die Innenraumluftqalität ist sehr schlecht, bitte Lüften!",
    }
];

export var WEATHERHISTORY: WeatherHistory[] = [
    {
        date: new Date,
        hours: [OUTDOORWEATHER, OUTDOORWEATHER, OUTDOORWEATHER],
        temperatureAverage: 20,
        humidityAverage: 40,
        weather: "sunny",
        textTTS: "Es war ein sonnig Tag mit einer Durchschnittstemperatur von 20 Grad Celsius."
    },
    {
        date: new Date,
        hours: [OUTDOORWEATHER, OUTDOORWEATHER, OUTDOORWEATHER],
        temperatureAverage: 10,
        humidityAverage: 30,
        weather: "cloudy",
        textTTS: "Es war ein sonnig Tag mit einer Durchschnittstemperatur von 10 Grad Celsius."
    }
];

export var WEATHERDATA: WeatherData = {
    outdoor: OUTDOORWEATHER,
    forecast: FORECAST,
    pollen: POLLEN,
    indoorAirQuality: INDOORAIRQUALITY,
    history: WEATHERHISTORY,
}