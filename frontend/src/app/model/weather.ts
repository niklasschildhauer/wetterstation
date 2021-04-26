export interface OutdoorWeather {
    temperature: number;
    maxTemperature: number,
    minTemperature: number,
    humidity: number,
    timestamp: Date,
    weather: string,
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
    status: string,
    textTTS: string,
}

export interface WeatherHistory {
    date: Date,
    hours: OutdoorWeather[],
    temperatureAverage: number,
    humidityAverage: number,
    weather: string,
    textTTS: string,
}

export interface WeatherData {
    outdoor: OutdoorWeather,
    forecast: WeatherForecast[],
    pollen: Pollen[],
    indoorAirQuality: IndoorAirQuality[],
    history: WeatherHistory[],
}