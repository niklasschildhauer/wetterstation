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
    }
];

export var INDOORAIRQUALITY: IndoorRoomData[] = [
    {
        roomID: "32895984u5z524",
        roomName: "Wohnzimmer",
        airQuality: 42,
        temperature: 22,
        humidity: 50,
        timestamp: new Date(),
    },
    {
        roomID: "1535984u5z524",
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
