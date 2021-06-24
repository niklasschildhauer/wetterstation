import { Component, OnInit, Input } from '@angular/core';
import { WeatherData, WeatherForecastData } from 'src/app/model/weather';
import { ImageService } from 'src/app/services/image.service';
import { TextService } from 'src/app/services/text.service';

@Component({
  selector: 'app-forecast-tile-view',
  templateUrl: './forecast-tile-view.component.html',
  styleUrls: ['./forecast-tile-view.component.scss']
})
export class ForecastTileViewComponent implements OnInit {
  @Input() pressable: boolean = false;
  @Input() hideSubtitle: boolean = false;
  @Input()
  set data(data: WeatherData) {
    this._forecast = data as WeatherForecastData;
  }
  _forecast?: WeatherForecastData
  constructor(private imageService: ImageService,
    private textService: TextService) { }

  ngOnInit(): void {
  }

  getForecastIcon(): string | undefined {
    let iconString = this._forecast?.weatherIcon;
    return this.imageService.getWeatherIconString(iconString);
  }

  getForecastTitle(): string | undefined {
    return this.textService.createForecastTitle(this._forecast);
  }

  getForecastDescription(): string | undefined {
    return this.textService.createForecastText(this._forecast);
  }
}
