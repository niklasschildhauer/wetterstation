import { Component, OnInit, Input } from '@angular/core';
import { PollenData, WeatherData } from 'src/app/model/weather';
import { CardSize } from '../../ui-elements/card-element/card-element.component';

@Component({
  selector: 'app-pollenflug-small-tile',
  templateUrl: './pollenflug-small-tile.component.html',
  styleUrls: ['./pollenflug-small-tile.component.scss']
})
export class PollenflugSmallTileComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input()
  set data(data: WeatherData) {
    this._pollen = data as PollenData;

    // REMOVE THE FOLLOWING -> DOPPELT
    switch(this._pollen.today) {
      case 1:
        this.textValue = "leicht";
        this.emojiName = "everythingFine";
        this.colorValue = "green";
        break;
      case 2:
        this.textValue = "mittel";
        this.emojiName = "yield";
        this.colorValue = "orange";
        break;
      case 3: 
        this.textValue = "schwer";
        this.emojiName = "almostDeath";
        this.colorValue = "red";
        break;
      default:
        this.textValue = "n/a";
        this.emojiName = "death";
        this.colorValue = "blue";
    }

  }
  _pollen?: PollenData;
  cardSizeType = CardSize;
  public emojiName?: string;
  public textValue?: string;
  public colorValue?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
