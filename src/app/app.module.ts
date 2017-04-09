import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { routing }  from './app.routing';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProficiencyComponent } from './proficiency/proficiency.component';
import { OverviewComponent } from './overview/overview.component';
import { MaterialComponent } from './material/material.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { OperatorsComponent } from './workflow/operators/operators.component';
import { FlowchartComponent } from './shared/components/flowchart/flowchart.component';
import { PositionDirective } from './workflow/position.directive';
import { DndModule } from 'ng2-dnd';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ProficiencyComponent,
    OverviewComponent,
    MaterialComponent,
    WorkflowComponent,
    FlowchartComponent,
    PositionDirective,
    OperatorsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    DndModule.forRoot(),
    routing
  ],
  providers: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
