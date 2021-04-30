import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonElementComponent } from './back-button-element/back-button-element.component';
import { NavBarElementComponent } from './nav-bar-element/nav-bar-element.component';



@NgModule({
  declarations: [
    BackButtonElementComponent,
    NavBarElementComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BackButtonElementComponent,
    NavBarElementComponent
  ]
})
export class UiElementsModule { }
