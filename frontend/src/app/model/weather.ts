export interface OutdoorWeather {
    temperature: number // in °C
    maxTemperature: number, //TODO: external database required "forecast" 
    minTemperature: number, //TODO: external database required "forecast" 
    humidity: number, // in %
    timestamp: Date, 
    weather: WeatherType, // TODO: external API required
    //textTTS: string // TODO: Generate in frontend (with i18n ?)
}

//Using our own sensors 
//TODO: How precise is the measurement? How many days can we forecast with our own sensors?
export interface WeatherForecast {
    day: string,
    //time?
}

//From external API
export interface Pollen {
    name: string,
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

export interface WeatherHistory {
    datapoints: OutdoorWeather[],
}

export interface WeatherHistoryByDay {
    averageTemperature: number, // in °C
    averageHumidity: number, // in %
}

export enum WeatherType {
    sunny,
    rainy,
    cloudy,
    windy
}