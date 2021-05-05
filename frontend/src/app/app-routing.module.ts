import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardScreenComponent } from './components/screens/dashboard-screen/dashboard-screen.component';
import { DetailScreenComponent } from './components/screens/detail-screen/detail-screen.component';
import { PersonalizationScreenComponent } from './components/screens/personalization-screen/personalization-screen.component';
import { ForecastDetailViewComponent } from './components/views/forecast-detail-view/forecast-detail-view.component';
import { HistoryDetailViewComponent } from './components/views/history-detail-view/history-detail-view.component';
import { IndoorDetailViewComponent } from './components/views/indoor-detail-view/indoor-detail-view.component';
import { PollenflugDetailViewComponent } from './components/views/pollenflug-detail-view/pollenflug-detail-view.component';

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
    ], 
    data: { animationState: 'Detail' }
  },
  { path: 'personalization', 
    component: PersonalizationScreenComponent, 
    data: { animationState: 'Detail' }
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
