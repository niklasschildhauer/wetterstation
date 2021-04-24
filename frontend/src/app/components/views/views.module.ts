import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PollenflugTileViewComponent } from './pollenflug-tile-view/pollenflug-tile-view.component';
import { UiElementsModule } from '../ui-elements/ui-elements.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    PollenflugTileViewComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    UiElementsModule,
  ],
  exports: [
    PollenflugTileViewComponent
  ]
})
export class ViewsModule { }
