import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonElementComponent } from './back-button-element/back-button-element.component';
import { NavBarElementComponent } from './nav-bar-element/nav-bar-element.component';
import { CardElementComponent } from './card-element/card-element.component';



@NgModule({
  declarations: [
    BackButtonElementComponent,
    NavBarElementComponent,
    CardElementComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BackButtonElementComponent,
    NavBarElementComponent,
    CardElementComponent
  ]
})
export class UiElementsModule { }
