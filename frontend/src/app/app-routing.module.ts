import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardScreenComponent } from './components/screens/dashboard-screen/dashboard-screen.component';
import { DetailScreenComponent } from './components/screens/detail-screen/detail-screen.component';


const routes: Routes = [
  { path: 'dashboard', component: DashboardScreenComponent },
  { path: 'detail', component: DetailScreenComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
