import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardScreenComponent } from './dashboard-screen/dashboard-screen.component';
import { DetailScreenComponent } from './detail-screen/detail-screen.component';
import { UiElementsModule } from '../ui-elements/ui-elements.module';
import { ViewsModule } from '../views/views.module'
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    DashboardScreenComponent,
    DetailScreenComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    UiElementsModule,
    ViewsModule,
  ]
})
export class ScreensModule { }
