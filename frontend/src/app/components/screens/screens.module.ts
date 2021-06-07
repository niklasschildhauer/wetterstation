import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardScreenComponent } from './dashboard-screen/dashboard-screen.component';
import { DetailScreenComponent } from './detail-screen/detail-screen.component';
import { OnboardingScreenComponent } from './onboarding-screen/onboarding-screen.component';
import { UiElementsModule } from '../ui-elements/ui-elements.module';
import { ViewsModule } from '../views/views.module'
import { RouterModule } from '@angular/router';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SettingsScreenComponent } from './settings-screen/settings-screen.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



@NgModule({
  declarations: [
    DashboardScreenComponent,
    DetailScreenComponent,
    SettingsScreenComponent,
    OnboardingScreenComponent,
  ],
  imports: [
    CommonModule,
    AppRoutingModule,
    RouterModule,
    UiElementsModule,
    ViewsModule,
    LayoutModule,
    BrowserAnimationsModule,
  ]
})

export class ScreensModule { }
