import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollenflugTileViewComponent } from './pollenflug-tile-view/pollenflug-tile-view.component';
import { UiElementsModule } from '../ui-elements/ui-elements.module';
import { RouterModule } from '@angular/router';
import { OutdoorWeatherViewComponent } from './outdoor-weather-view/outdoor-weather-view.component';


@NgModule({
  declarations: [
    PollenflugTileViewComponent,
    OutdoorWeatherViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UiElementsModule,
  ],
  exports: [
    PollenflugTileViewComponent,
    OutdoorWeatherViewComponent
  ]
})
export class ViewsModule { }
