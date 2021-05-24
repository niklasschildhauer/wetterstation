import { Injectable } from '@angular/core';
//import { read } from 'node:fs';
import { IndoorRoomData, OutdoorWeatherData, PollenData, Tile, TileType, WeatherForecastData } from '../model/weather';
import { WeatherData } from '../model/weather';

@Injectable({
  providedIn: 'root'
})

export class SpeechAPIService {
  synth = window.speechSynthesis;
  delegate?: SpeechServiceDelegate

  constructor() {}
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
          let indoorArray = element.data as IndoorRoomData;
          readAloud = readAloud + this.createIndoorRoomString(indoorArray);
        break;
        case TileType.forecast: 
          let forecastData = element.data as WeatherForecastData;
          readAloud = readAloud + this.createForecastString(forecastData);
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
    let forecast = data.forecast
    return "Heute wird es " + forecast + ". ";
  }

  createIndoorRoomString(data: IndoorRoomData): string {
    let room = data.roomName
    let quality = data.airQuality
    let temperature = data.temperature

    return "Im " + room + " hat es " + temperature + " Grad Celsius und die Luftqualität liegt bei " + quality + ". ";
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


  startOutput(text: string) {
    var utterThis = new SpeechSynthesisUtterance(text);
    utterThis.lang = "de-DE"
    utterThis.pitch = 1;
    utterThis.rate = 1;

    this.synth.cancel();
    this.synth.speak(utterThis);
    this.synth.resume();
  }

  stopOutput() {
    this.synth.pause()
  }

  isOutputRunning(): boolean{
    return this.synth.speaking
  }
}

export interface SpeechServiceDelegate {
  outputFinished(): void
}

