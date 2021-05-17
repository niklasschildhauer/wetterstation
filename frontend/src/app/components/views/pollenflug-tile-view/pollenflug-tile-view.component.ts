import { Component, OnInit, Input } from '@angular/core';
import { PollenData, WeatherData } from 'src/app/model/weather';

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
