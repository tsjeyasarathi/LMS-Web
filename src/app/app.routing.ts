import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent }   from './login/login.component';
import { HomeComponent }   from './home/home.component';
import { OverviewComponent }   from './overview/overview.component';
import { ProficiencyComponent }   from './proficiency/proficiency.component';
import { MaterialComponent }   from './material/material.component';
import { WorkflowComponent } from "./workflow/workflow.component";
import { LevelComponent } from './level/level.component';

const appRoutes: Routes = <Routes>[
  {
    path: '',
    children: [
      { path: '', component: HomeComponent },
      { path: 'overview', component: OverviewComponent },
      { path: 'level', component: LevelComponent },
      { path: 'proficiency/:name', component: ProficiencyComponent },
      { path: 'material/:name', component: MaterialComponent },
      { path: 'tech/:name/:level', component: WorkflowComponent },
    ],
    component: HomeComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
