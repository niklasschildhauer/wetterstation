import { Component, Input, OnInit } from '@angular/core';
import { IndoorRoomData, WeatherData } from 'src/app/model/weather';

@Component({
  selector: 'app-indoor-tile-view',
  templateUrl: './indoor-tile-view.component.html',
  styleUrls: ['./indoor-tile-view.component.scss']
})
export class IndoorTileViewComponent implements OnInit {
  @Input()
  set data(data: WeatherData) {
    this._indoorRoom = data as IndoorRoomData;
  }
  @Input() pressable: boolean = false;
  @Input() hideSubtitle: boolean = false;
  _indoorRoom?: IndoorRoomData

  constructor() { }

  ngOnInit(): void { }

  getQualityValue(): number {
    if(this._indoorRoom){
      const calibrationValue = this._indoorRoom.calibrationValue
      const airQualityValue = this._indoorRoom.airQuality
      if(calibrationValue === -1) {
        return 0
      }
      if(calibrationValue + 5 < airQualityValue) {
        return 100
      }
      if(calibrationValue <= airQualityValue) {
        return 40
      }
      if(calibrationValue > airQualityValue) {
        return 1
      }
    } 
    return 50
  }

  getMaxValue(): number {
    if(this._indoorRoom){
      const calibrationValue = this._indoorRoom.calibrationValue
      return calibrationValue + 5;
    }
    return 100
  }

  getQualityString(): string {
    if(this._indoorRoom){
      const calibrationValue = this._indoorRoom.calibrationValue
      const airQualityValue = this._indoorRoom.airQuality
      if(calibrationValue === -1) {
        return ""
      }
      if(this.getMaxValue() < airQualityValue) {
        return 'schlecht'
      }
      if(calibrationValue <= airQualityValue) {
        return 'gut'
      }
      if(calibrationValue > airQualityValue) {
        return 'sehr gut'
      }
    } 
    return ''
  }
}


