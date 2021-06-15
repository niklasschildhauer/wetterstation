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
import { PersonalizationSettingsViewComponent } from './personalization-settings-view/personalization-settings-view.component';
import { LoginViewComponent } from './login-view/login-view.component';
import { RegistrationViewComponent } from './registration-view/registration-view.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PersonalizationViewComponent } from './personalization-view/personalization-view.component';
import { OutdoorWeatherDetailViewComponent } from './outdoor-weather-detail-view/outdoor-weather-detail-view.component';
import { HumidityTileViewComponent } from './humidity-tile-view/humidity-tile-view.component';
import { ApparentTemperatureTileViewComponent } from './apparent-temperature-tile-view/apparent-temperature-tile-view.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SimpleTileViewComponent } from './simple-tile-view/simple-tile-view.component';
import { ChartsModule } from "@rinminase/ng-charts";
import { ConfigurationViewComponent } from './configuration-view/configuration-view.component';
import { ConfigurationTileViewComponent, ConfigurationTilePopUpDialogView } from './configuration-tile-view/configuration-tile-view.component';
import { NgxSpinnerModule } from "ngx-spinner";



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
    PollenflugSmallTileComponent,
    PersonalizationSettingsViewComponent,
    LoginViewComponent,
    RegistrationViewComponent,
    PersonalizationViewComponent,
    OutdoorWeatherDetailViewComponent,
    HumidityTileViewComponent,
    ApparentTemperatureTileViewComponent,
    ConfigurationTilePopUpDialogView,
    SimpleTileViewComponent,
    ConfigurationViewComponent,
    ConfigurationTileViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UiElementsModule,
    FormsModule, 
    ReactiveFormsModule,
    MatDialogModule,
    ChartsModule,
    NgxSpinnerModule,
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
    PollenflugSmallTileComponent,
    PersonalizationSettingsViewComponent,
    LoginViewComponent,
    RegistrationViewComponent,
    OutdoorWeatherDetailViewComponent,
    HumidityTileViewComponent,
    ApparentTemperatureTileViewComponent,
  ]
})
export class ViewsModule { }
