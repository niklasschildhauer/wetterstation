import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackButtonElementComponent } from './back-button-element/back-button-element.component';
import { NavBarElementComponent } from './nav-bar-element/nav-bar-element.component';
import { CardElementComponent } from './card-element/card-element.component';
import { MenuBarElementComponent } from './menu-bar-element/menu-bar-element.component';
import { MenuButtonElementComponent } from './menu-button-element/menu-button-element.component';
import { ProgressChartElementComponent } from './progress-chart-element/progress-chart-element.component';
import { CheckboxSwitcherElementComponent } from './checkbox-switcher-element/checkbox-switcher-element.component';



@NgModule({
  declarations: [
    BackButtonElementComponent,
    NavBarElementComponent,
    CardElementComponent,
    MenuBarElementComponent,
    MenuButtonElementComponent,
    ProgressChartElementComponent,
    CheckboxSwitcherElementComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BackButtonElementComponent,
    NavBarElementComponent,
    CardElementComponent,
    MenuBarElementComponent,
    MenuButtonElementComponent,
    ProgressChartElementComponent,
    CheckboxSwitcherElementComponent,
  ]
})
export class UiElementsModule { }
