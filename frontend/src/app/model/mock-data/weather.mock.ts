import { IndoorRoomData, OutdoorWeatherData, WeatherHistoryByDayData, PollenData, WeatherForecastData, WeatherHistoryData, WeatherType } from '../weather';
import { Pollen } from '../user-context';

export var OUTDOORWEATHER: OutdoorWeatherData = {
    temperature: 14,
    maxTemperature: 20,
    minTemperature: 4,
    humidity: 66,
    timestamp: new Date,
    weather: WeatherType.cloudy,
    apparentTemperature: 12,
    location: "Stuttgart"
};

export var FORECAST: WeatherForecastData = {
    forecast: "Besser"
}

export var POLLEN: PollenData[] = [
    {
        name: "Esche",
        type: Pollen.Esche,
        today: 1,
        tomorrow: 0,
    },
    {
        name: "Roggen",
        type: Pollen.Roggen,
        today: 0,
        tomorrow: 2 ,
    },

    {
        name: "Hasel",
        type: Pollen.Hasel,
        today: 2,
        tomorrow: 0,
    },

    {
        name: "Birke",
        type: Pollen.Birke,
        today: 3,
        tomorrow: 0,
    },

    {
        name: "Ambrosia",
        type: Pollen.Ambrosia,
        today: 3,
        tomorrow: 0,
    },

    {
        name: "Beifuß",
        type: Pollen.Beifuss,
        today: 0,
        tomorrow: 0,
    },

    {
        name: "Gräser",
        type: Pollen.Graeser,
        today: 1,
        tomorrow: 0,
    },

    {
        name: "Erle",
        type: Pollen.Erle,
        today: 0,
        tomorrow: 0,
    },
];

export var INDOORAIRQUALITY: IndoorRoomData[] = [
    {
        roomID: "328959845524",
        roomName: "Wohnzimmer",
        airQuality: 42,
        temperature: 22,
        humidity: 50,
        timestamp: new Date(),
    },
    {
        roomID: "15359845524",
        roomName: "Schlafzimmer",
        airQuality: 122,
        temperature: 22,
        humidity: 50,
        timestamp: new Date(),
    }
];

export var WEATHERHISTORY: WeatherHistoryData = {
    datapoints: [
        OUTDOORWEATHER,
        OUTDOORWEATHER,
        OUTDOORWEATHER,
    ]
}

export var WEATHERHISTORYBYDAY: WeatherHistoryByDayData = {
    averageHumidity: 40,
    averageTemperature: 20,
}


