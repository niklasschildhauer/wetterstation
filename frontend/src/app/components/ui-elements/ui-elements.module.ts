import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonElementComponent } from './back-button-element/back-button-element.component';



@NgModule({
  declarations: [
    BackButtonElementComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BackButtonElementComponent
  ]
})
export class UiElementsModule { }
