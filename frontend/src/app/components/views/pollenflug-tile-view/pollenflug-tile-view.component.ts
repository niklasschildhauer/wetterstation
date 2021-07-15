import { Component, OnInit, Input } from '@angular/core';
import { PollenData, WeatherData } from 'src/app/model/weather';

/**
 * Pollenflug tile view component 
 * 
 * Displays a list of the given pollen and its value. 
 * This component is used for all pollen the user is 
 * not allergic to it.
 * This component has no data connection. The displayed
 * data is passed by the parent component. 
 */
@Component({
  selector: 'app-pollenflug-tile-view',
  templateUrl: './pollenflug-tile-view.component.html',
  styleUrls: ['./pollenflug-tile-view.component.scss']
})
export class PollenflugTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input() hideSubtitle: boolean = false;
  @Input()
  set data(data: WeatherData) {
    this._pollen = data as PollenData[];
  }
  _pollen?: PollenData[];

  constructor() { }

  ngOnInit(): void {
  }
}
