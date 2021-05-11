import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardScreenComponent } from './dashboard-screen/dashboard-screen.component';
import { DetailScreenComponent } from './detail-screen/detail-screen.component';
import { LoginScreenComponent } from './login-screen/login-screen.component';
import { UiElementsModule } from '../ui-elements/ui-elements.module';
import { ViewsModule } from '../views/views.module'
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { PersonalizationScreenComponent } from './personalization-screen/personalization-screen.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    DashboardScreenComponent,
    DetailScreenComponent,
    PersonalizationScreenComponent,
    LoginScreenComponent
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule,
    UiElementsModule,
    ViewsModule,
    LayoutModule,
    FormsModule,
    ReactiveFormsModule
  ]
})

export class ScreensModule { }
