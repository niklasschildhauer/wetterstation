import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardScreenComponent } from './components/screens/dashboard-screen/dashboard-screen.component';
import { DetailScreenComponent } from './components/screens/detail-screen/detail-screen.component';
import { OnboardingScreenComponent } from './components/screens/onboarding-screen/onboarding-screen.component';
import { SettingsScreenComponent } from './components/screens/settings-screen/settings-screen.component';
import { CalibrationInfoDetailViewComponent } from './components/views/calibration-info-detail-view/calibration-info-detail-view.component';
import { ConfigurationViewComponent } from './components/views/configuration-view/configuration-view.component';
import { ForecastDetailViewComponent } from './components/views/forecast-detail-view/forecast-detail-view.component';
import { HistoryDetailViewComponent } from './components/views/history-detail-view/history-detail-view.component';
import { IndoorDetailViewComponent } from './components/views/indoor-detail-view/indoor-detail-view.component';
import { LoginViewComponent } from './components/views/login-view/login-view.component';
import { OutdoorWeatherDetailViewComponent } from './components/views/outdoor-weather-detail-view/outdoor-weather-detail-view.component';
import { PersonalizationSettingsViewComponent } from './components/views/personalization-settings-view/personalization-settings-view.component';
import { PersonalizationViewComponent } from './components/views/personalization-view/personalization-view.component';
import { PollenflugDetailViewComponent } from './components/views/pollenflug-detail-view/pollenflug-detail-view.component';
import { RegistrationViewComponent } from './components/views/registration-view/registration-view.component';

const routes: Routes = [
  { path: 'dashboard', 
    component: DashboardScreenComponent, 
    data: { animationState: 'Dashboard' }
  },
  { path: 'detail', 
    component: DetailScreenComponent,  
    children: [
      {
        path: 'indoorrooms',
        component: IndoorDetailViewComponent, 
      },
      {
        path: 'forecast',
        component: ForecastDetailViewComponent, 
      },
      {
        path: 'pollen',
        component: PollenflugDetailViewComponent, 
      },
      {
        path: 'history',
        component: HistoryDetailViewComponent, 
      },
      {
        path: 'outdoor',
        component: OutdoorWeatherDetailViewComponent, 
      },
    ], 
    data: { animationState: 'Detail' }
  },
  { path: 'settings', 
    component: SettingsScreenComponent, 
    children: [
      {
        path: 'configuration',
        component: ConfigurationViewComponent, 
        data: { animationState: 'Configuration' }
      },
      {
        path: 'personalization',
        component: PersonalizationViewComponent, 
      },
      {
        path: 'calibration-info',
        component: CalibrationInfoDetailViewComponent, 
        data: { animationState: 'Calibration' }
      },
    ], 
    data: { animationState: 'Detail' }
  },
  { path: 'onboarding', 
    component: OnboardingScreenComponent, 
    children: [
      {
        path: 'login',
        component: LoginViewComponent, 
        data: { animationState: 'Login' }
      },
      {
        path: 'registration',
        component: RegistrationViewComponent, 
        data: { animationState: 'Registration' }
      },
      {
        path: 'personalization',
        component: PersonalizationViewComponent, 
        data: { animationState: 'Personalization' }
      },
    ], 
    data: { animationState: 'Detail' }
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, 
    { scrollPositionRestoration: 'top' }
    )],
  exports: [RouterModule]
})
export class AppRoutingModule { }
