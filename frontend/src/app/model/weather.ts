import { Pollen } from './user-context';

export interface OutdoorWeatherData {
    temperature: number // in °C
    maxTemperature: number, //TODO: external database required "forecast" 
    minTemperature: number, //TODO: external database required "forecast" 
    humidity: number, // in %
    timestamp: Date, 
    weather: WeatherType, // TODO: external API required
    apparentTemperature: number, // in °C ---> die "gefühlte" Temperatur
    //textTTS: string // TODO: Generate in frontend (with i18n ?)
    location: string, // e.g. "Stuttgart"
}

//Using our own sensors 
//TODO: How precise is the measurement? How many days can we forecast with our own sensors?
export interface WeatherForecastData {
    forecast: string,
    //time?
}

//From external API
export interface PollenData {
    name: string, // TODO: Maybe we should use the same Pollen enum as in user-context.ts
    type: Pollen
    today: number, // -1 <--> 3
    tomorrow: number, // -1 <--> 3
}

export interface IndoorRoomData {
    roomID: string,
    roomName: string,
    airQuality: number, // in %
    //status: string, //TODO: Clarify
    temperature: number // in °C 
    humidity: number, // in %
    timestamp: Date, 
}

export interface WeatherHistoryData {
    datapoints: OutdoorWeatherData[],
}

export interface WeatherHistoryByDayData {
    averageTemperature: number, // in °C
    averageHumidity: number, // in %
}

export enum WeatherType {
    sunny,
    rainy,
    cloudy,
    windy
}

export enum Daytime {
    noon,
    night,
    dawn,
}