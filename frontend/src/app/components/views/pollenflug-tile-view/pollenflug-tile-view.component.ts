import { Component, OnInit } from '@angular/core';
import { Pollen } from 'src/app/model/weather';
import { WeatherService } from '../../../services/weather.service'

@Component({
  selector: 'app-pollenflug-tile-view',
  templateUrl: './pollenflug-tile-view.component.html',
  styleUrls: ['./pollenflug-tile-view.component.scss']
})
export class PollenflugTileViewComponent implements OnInit {
  pollen?: Pollen[];

  constructor(private weatherService: WeatherService ) { }

  ngOnInit(): void {
    this.getPollen()
  }

  getPollen(): void {
    this.weatherService.getPollen()
      .subscribe(pollen => this.pollen = pollen);
  }


}
