import { Injectable } from '@angular/core';
import { IndoorRoomData, OutdoorWeatherData, PollenData, Tile, TileType, WeatherForecastData } from '../model/weather';
import { WeatherData } from '../model/weather';

@Injectable({
  providedIn: 'root'
})

// Class to test the TTS from Firefox
export class SpeechAPIService {
  synth = window.speechSynthesis;
  constructor() {

  }
  init() {
  }

  readAloudTiles(data: Tile<WeatherData>[]) {
    var readAloud = ""
    data.forEach(element => {
      switch(element.type){
        case TileType.pollenList: 
          let pollenDataArray = element.data as PollenData[];
          pollenDataArray.forEach(element => {
            readAloud = readAloud + this.createPollenString(element);
          });
        break;
        case TileType.indoorRoom: 
        break;
        case TileType.forecast: 
        break;
        case TileType.pollenSmall: 
          let pollenData = element.data as PollenData;
          readAloud = readAloud + this.createPollenString(pollenData);
        break
        default: "Not implemented"
      }
    });

    console.log(readAloud);
  }
  readAloudOutdoorWeatherData(data: OutdoorWeatherData) {

  }
  readAloudForecastWeatherData(data: WeatherForecastData) {

  }

  createForecastString(data: WeatherForecastData): string {

    return ""
  }

  createIndoorRoomString(data: IndoorRoomData): string {
    return ""
  }

  createPollenString(data: PollenData): string {
    // CHANGE VALUE OF 1 to LEICH, MITTEL, STARK und KEINE
    let name = data.name
    let value = data.today
    return "Pollen der Art " + name + " hat heute eine Belastung von " + value +  ". ";
  }

  createOutdoorReadAloudString(data: OutdoorWeatherData): string {
    // NOT FINISHED
    let temperature = data.temperature
    return "Aktuell hat es " + temperature + " Grad Celsius. ";
  }

  getGermanVoice() : SpeechSynthesisVoice {
    let voices = this.synth.getVoices();
    return voices[4];
  }

  startOutput(readAloud: string) {
    var utterThis = new SpeechSynthesisUtterance(readAloud);
    utterThis.voice = this.getGermanVoice();

    utterThis.pitch = 1;
    utterThis.rate = 1;

    this.synth.speak(utterThis);
  }

  stopOutput() {

  }
}
