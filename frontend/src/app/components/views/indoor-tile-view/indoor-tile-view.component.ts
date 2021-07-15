import { Component, Input, OnInit } from '@angular/core';
import { IndoorRoomData, WeatherData } from 'src/app/model/weather';

/**
 * Indoor tile view component
 * 
 * This component displays in form of a tile (widget) the indoor room 
 * information. It takes an object of the type IndoorRoomData as 
 * information source. Itself has no connection to any
 * service. It uses the card-view-element to define the layout.
 */
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

  /** 
   * @returns the Quality value as percent. 100% is bad, 0% is good @Carina 
   */
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

  /**
   * @returns based on the calibration value the value when the
   * air quality is bad
   */
  getMaxValue(): number {
    if(this._indoorRoom){
      const calibrationValue = this._indoorRoom.calibrationValue
      return calibrationValue + 5;
    }
    return 100
  }

  /**
   * @returns the calibration value as optimal value
   */
  getOptimalValue(): number {
    if(this._indoorRoom){
      const calibrationValue = this._indoorRoom.calibrationValue
      return calibrationValue;
    }
    return 25;
  }

  /**
   * @returns the quality status as a string
   */
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


