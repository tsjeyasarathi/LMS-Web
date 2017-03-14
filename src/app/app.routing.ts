import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }   from './login/login.component';
import { HomeComponent }   from './home/home.component';
import { OverviewComponent }   from './overview/overview.component';
import { ProficiencyComponent }   from './proficiency/proficiency.component';

const appRoutes: Routes = <Routes>[
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'proficiency/:name', component: ProficiencyComponent },

    ],
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
