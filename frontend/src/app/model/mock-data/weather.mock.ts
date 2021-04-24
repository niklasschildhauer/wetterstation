import { OutdoorWeather, Pollen } from '../weather';

export var OUTDOORWEATHER: OutdoorWeather = {
    temperature: 14,
    humidity: 66,
    timestamp: new Date,
    weather: "sunny",
    textTTS: "Aktuell hat es 14 Grad Celsius mit einer Höchsttemperatur von 20 Grad.",
    forecast: [{
        date: new Date,
        temperature: 23,
        weather: "rainy",
        day: "Tue",
        textTTS: "Am Mittwoch wird es regnen",
    }, 
    {
        date: new Date,
        temperature: 23,
        weather: "rainy",
        day: "Wed",
        textTTS: "Am Mittwoch wird es regnen",
    }]
}

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
]