export interface OutdoorWeather {
    temperature: number;
    humidity: number,
    timestamp: Date,
    weather: string,
    forecast: WeatherForecast[],
    textTTS: string
}

export interface WeatherForecast {
    day: string,
    date: Date,
    temperature: number,
    weather: string,
    textTTS: string,
}

export interface Pollen {
    name: string,
    today: number,
    tomorrow: number,
    textTTS: string,
}

export interface IndoorAirQuality {
    roomID: string,
    roomName: string,
    airQuality: number,
    textTTS: string,
}

export interface weatherData {
    outdoor: OutdoorWeather,
    forecast: WeatherForecast[],
    pollen: Pollen[],
    indoorAirQuality: IndoorAirQuality[],
}