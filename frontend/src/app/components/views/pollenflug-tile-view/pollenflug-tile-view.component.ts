import { Component, OnInit, Input } from '@angular/core';
import { PollenData } from 'src/app/model/weather';
import { WeatherService } from '../../../services/weather.service'

@Component({
  selector: 'app-pollenflug-tile-view',
  templateUrl: './pollenflug-tile-view.component.html',
  styleUrls: ['./pollenflug-tile-view.component.scss']
})
export class PollenflugTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  pollen?: PollenData[];

  constructor(private weatherService: WeatherService ) { }

  ngOnInit(): void {
    this.getPollen()
  }

  getPollen(): void {
    this.weatherService.getPollen()
      .subscribe(pollen => this.pollen = pollen);
  }


}
