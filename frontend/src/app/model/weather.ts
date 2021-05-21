import { Pollen } from './user-context';

export interface WeatherData { }

export enum TileType {
    indoorRoom,
    pollenSmall,
    pollenList,
    history,
    forecast,
    humidity,
    apparentTemperature,
}

export enum TilePriority {
    important, //Highest 
    high,
    middle,
    low,
}

export interface Tile<A> {
    type: TileType;
    data: A;
    id: string;
    priority: TilePriority
}

export interface OutdoorWeatherData extends WeatherData {
    temperature: number // in °C
    maxTemperature: number, //TODO: external database required "forecast"  --> // TODO: Move to "daily" data structure
    minTemperature: number, //TODO: external database required "forecast"  --> // TODO: Move to "daily" data structure
    humidity: number, // in %
    timestamp: Date, 
    weather: WeatherType, // TODO: external API required
    apparentTemperature: number, // in °C ---> die "gefühlte" Temperatur
    //textTTS: string // TODO: Generate in frontend (with i18n ?)
    location: string, // e.g. "Stuttgart" TODO: Make configurable in ESP Wlan-Board
}

//Using our own sensors 
//TODO: How precise is the measurement? How many days can we forecast with our own sensors?
export interface WeatherForecastData extends WeatherData {
    forecast: string,
    //time?
}

//From external API
export interface PollenData extends WeatherData {
    name: string, // TODO: Maybe we should use the same Pollen enum as in user-context.ts
    type: Pollen
    today: number, // -1 <--> 3
    tomorrow: number, // -1 <--> 3
}

export interface IndoorRoomData extends WeatherData {
    roomID: string,
    roomName: string,
    airQuality: number, // in %
    //status: string, //TODO: Clarify
    temperature: number // in °C 
    humidity: number, // in %
    timestamp: Date, 
}

export interface WeatherHistoryData extends WeatherData {
    datapoints: OutdoorWeatherData[],
}

export interface GraphDataPoints {
    name: string;
    value: number;
}

export interface WeatherGraphDataSet extends WeatherData {
    temperatureDataPoints: GraphDataPoints[];
    humidityDataPoints: GraphDataPoints[];
    label: string;
    temperatureAverage: number;
    humidityAverage: number;
}

export interface WeatherHistoryByDayData extends WeatherData  {
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