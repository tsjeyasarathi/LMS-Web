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
import { FlowchartComponent } from './shared/components/flowchart/flowchart.component';
import { WorkflowComponent } from './workflow/workflow.component';
import { OperatorsComponent } from './workflow/operators/operators.component';
import { PositionDirective } from './workflow/position.directive';
import { DndModule } from 'ng2-dnd';
import { AuthenticationComponent } from './authentication/authentication.component';
import { LevelComponent } from './level/level.component';
import { IntermediateComponent } from './workflow/intermediate/intermediate.component';

import { AuthService } from './shared/services/auth.service';
import { AuthGuardService } from './shared/services/auth-guard.service';
import { HttpClientService } from './shared/services/http-client.service';
import { LoginService } from './shared/services/login.service';
import { UrlService } from './shared/services/url.service';
import { ConfigurationService } from './shared/services/configuration.service';
import { UsersService } from './shared/services/users.service';

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
    OperatorsComponent,
    AuthenticationComponent,
    LevelComponent,
    IntermediateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    DndModule.forRoot(),
    routing
  ],
  providers: [UrlService, ConfigurationService, AuthService, AuthGuardService, LoginService, UsersService, HttpClientService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
