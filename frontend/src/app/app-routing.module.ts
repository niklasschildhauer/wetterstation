import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardScreenComponent } from './components/screens/dashboard-screen/dashboard-screen.component';
import { DetailScreenComponent } from './components/screens/detail-screen/detail-screen.component';
import { IndoorDetailViewComponent } from './components/views/indoor-detail-view/indoor-detail-view.component';

const routes: Routes = [
  { path: 'dashboard', 
    component: DashboardScreenComponent, 
    // data: { animation: 'slideInOut' }
  },
  { path: 'detail', 
    component: DetailScreenComponent,  
    children: [
      {
        path: 'indoorrooms',
        component: IndoorDetailViewComponent, 
      },
    ], 
    // data: { animation: 'slideInOut' }
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
