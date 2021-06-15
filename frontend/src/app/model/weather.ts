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

export interface TileArrays {
    dashboard: Tile<WeatherData>[],
    pollen : Tile<WeatherData>[],
    indoorRooms: Tile<WeatherData>[]
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
    pollenName: string, // TODO: Maybe we should use the same Pollen enum as in user-context.ts
    id: number,
    today: string, // -1 <--> 3
    tomorrow: string, // -1 <--> 3
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

export interface GraphDataSet extends WeatherData {
    temperatureDataPoints: number[];
    humidityDataPoints: number[];
    xAxisLabel: string[];
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