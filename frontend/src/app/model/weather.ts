/**
 * Marker interface. Marks all Weather data. In this way they all can be stored 
 * in a tiles array [].
 */
export interface WeatherData { }

/**
 * Enum to identify the type of the tile. 
 */
export enum TileType {
    indoorRoom,
    pollenSmall,
    pollenList,
    history,
    forecast,
    humidity,
    apparentTemperature,
}

/**
 * This interface bundles the three tile arrays
 */
export interface TileArrays {
    dashboard: Tile<WeatherData>[],
    pollen : Tile<WeatherData>[],
    indoorRooms: Tile<WeatherData>[]
}
  
/**
 * Enum to set the priority of a tile
 */
export enum TilePriority {
    important, //Highest 
    high,
    middle,
    low,
}

/**
 * Tile model -
 * Every tile (widget) needs data and a prioriy. The priority is 
 * used to determine the position of the tiles on the dashboard. The tiles themselves do not load the data.
 * The data is passed from the parent view of the tiles.
 */
export interface Tile<A> {
    type: TileType;
    data: A;
    id: string;
    priority: TilePriority
}

/**
 * Model of the outdoor weather data. It contains all information about the current 
 * outdoor weather including temperature, humidity and weather type. 
 */
export interface OutdoorWeatherData extends WeatherData {
    temperature: number // in °C
    maxTemperature: number,
    minTemperature: number, 
    humidity: number, // in %
    timestamp: Date, 
    weather: string, 
    apparentTemperature: number, // in °C ---> die "gefühlte" Temperatur
    location: string, // e.g. "Stuttgart" TODO: Make configurable in ESP Wlan-Board
    postCode: string,
}

/**
 * Model of the weather forecast data. It contains all information about 
 * the forecast including weather and trend. 
 */
export interface WeatherForecastData extends WeatherData {
    trend: string,
    weatherDescription: string,
    weatherIcon: string,
  }

/**
 * Model of the pollen data. It contains all information about 
 * the current pollen count.
 */
export interface PollenData extends WeatherData {
    pollenName: string, 
    id: number,
    today: string, // -1 <--> 3
    tomorrow: string, // -1 <--> 3
}

/**
 * Model of the indoor room data. It contains all information about 
 * the temperature, humidity, roomname, airQuality of the current room. 
 */
export interface IndoorRoomData extends WeatherData {
    roomID: string,
    roomName: string,
    airQuality: number, // in %
    temperature: number // in °C 
    humidity: number, // in %
    timestamp: Date, 
    calibrationValue: number
}

/**
 * Model of the indoor room data. It contains all information about 
 * the temperature, humidity, roomname, airQuality of the current room. 
 */
export interface WeatherHistoryData extends WeatherData {
    datapoints: OutdoorWeatherData[],
}

/**
 * Model of the indoor room data. It contains all information about 
 * the temperature, humidity, roomname, airQuality of the current room. 
 */
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

export enum Daytime {
    noon,
    night,
    dawn,
}