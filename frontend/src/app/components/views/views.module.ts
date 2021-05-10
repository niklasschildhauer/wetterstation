import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollenflugTileViewComponent } from './pollenflug-tile-view/pollenflug-tile-view.component';
import { UiElementsModule } from '../ui-elements/ui-elements.module';
import { RouterModule } from '@angular/router';
import { OutdoorWeatherViewComponent } from './outdoor-weather-view/outdoor-weather-view.component';
import { HistoryTileViewComponent } from './history-tile-view/history-tile-view.component';
import { IndoorTileViewComponent } from './indoor-tile-view/indoor-tile-view.component';
import { IndoorDetailViewComponent } from './indoor-detail-view/indoor-detail-view.component';
import { PollenflugDetailViewComponent } from './pollenflug-detail-view/pollenflug-detail-view.component';
import { HistoryDetailViewComponent } from './history-detail-view/history-detail-view.component';
import { ForecastDetailViewComponent } from './forecast-detail-view/forecast-detail-view.component';
import { ForecastTileViewComponent } from './forecast-tile-view/forecast-tile-view.component';
import { PollenflugSmallTileComponent } from './pollenflug-small-tile/pollenflug-small-tile.component';


@NgModule({
  declarations: [
    PollenflugTileViewComponent,
    OutdoorWeatherViewComponent,
    HistoryTileViewComponent,
    IndoorTileViewComponent,
    IndoorDetailViewComponent,
    PollenflugDetailViewComponent,
    HistoryDetailViewComponent,
    ForecastDetailViewComponent,
    ForecastTileViewComponent,
    PollenflugSmallTileComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UiElementsModule,
  ],
  exports: [
    PollenflugTileViewComponent,
    OutdoorWeatherViewComponent,
    HistoryTileViewComponent,
    IndoorTileViewComponent,
    IndoorDetailViewComponent,
    PollenflugDetailViewComponent,
    HistoryDetailViewComponent,
    ForecastDetailViewComponent,
    ForecastTileViewComponent,
    PollenflugSmallTileComponent
  ]
})
export class ViewsModule { }
