/* tslint:disable:no-unused-variable */

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalModule } from 'angular2-modal';
import { BootstrapModalModule } from 'angular2-modal/plugins/bootstrap';
import { VexModalModule } from 'angular2-modal/plugins/vex';

import { CustomModalVexComponent } from '../../../shared/components/custom-modal-vex/custom-modal-vex.component';
import { FlowchartComponent } from '../../../shared/components/flowchart/flowchart.component';

describe('Component: Flowchart', () => {
  let comp:    FlowchartComponent;
  let fixture: ComponentFixture<FlowchartComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      declarations: [
        FlowchartComponent
      ],
      imports: [
        ModalModule.forRoot(),
        BootstrapModalModule,
        VexModalModule
      ],
      providers: [CustomModalVexComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });

    // create component and test fixture
    fixture = TestBed.createComponent(FlowchartComponent);

    // get test component from the fixture
    comp = fixture.componentInstance;
  });

  it('should create an instance', () => {
    expect(comp).toBeTruthy();
  });

  it('should create an jsplumb instance', () => {
    let instance = comp.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 1000},
      ConnectionsDetachable: true,
      ReattachConnections: true
    });

    expect(instance).toBeTruthy();
  });

  it('should initialize jsplumb graph component', () => {
    let instance = comp.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 1000},
      ConnectionsDetachable: true,
      ReattachConnections: true
    });

    comp.initGraph('.dynamic-demo .node', {}, function(){}, function(){}, function(){});

    expect(instance).toBeTruthy();
  });

  it('should get connections from the jsPlumb', () => {
    let instance = comp.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 1000},
      ConnectionsDetachable: true,
      ReattachConnections: true
    });

    let connections = comp.getConnections();

    expect(connections).toBeTruthy();
  });

  it('should update the graph on change', () => {
    let instance = comp.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 1000},
      ConnectionsDetachable: true,
      ReattachConnections: true
    });

    let connections = comp.updateGraph('.node');

    expect(connections).toBeTruthy();
  });

  it('should delete the node in graph and connections if it matches the sourceId in connections array', () => {
    let instance = comp.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 1000},
      ConnectionsDetachable: true,
      ReattachConnections: true
    });

    comp.instance = jasmine.createSpyObj('Instance spy', ['getConnections', 'detach', 'deleteEndpoint', 'remove']);
    comp.instance.getConnections.and.returnValue([{'sourceId': 'test123'}]);
    comp.endpoints = { 'test123': {}};

    let deleteNode = comp.deleteNode('test123');

    expect(deleteNode).toBeTruthy();
  });

  it('should delete the node in graph and connections if it matches the targetId in connections array', () => {
    let instance = comp.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 1000},
      ConnectionsDetachable: true,
      ReattachConnections: true
    });

    comp.instance = jasmine.createSpyObj('Instance spy', ['getConnections', 'detach', 'deleteEndpoint', 'remove']);
    comp.instance.getConnections.and.returnValue([{'targetId': 'test123'}]);
    comp.endpoints = { 'test123': {}};

    let deleteNode = comp.deleteNode('test123');

    expect(deleteNode).toBeTruthy();
  });

  it('should return false on bad connection object', () => {
    let instance = comp.getInstance({
      DragOptions: {cursor: 'pointer', zIndex: 1000},
      ConnectionsDetachable: true,
      ReattachConnections: true
    });

    let detach = comp.detach({});

    expect(detach).toEqual({});
  });

  it('should get all the endpoints', () => {
    comp.endpoints = [{ id: 1}, {id: 2}];
    let endpoints = comp.getEndpoints();

    expect(endpoints).toBe(comp.endpoints);
  });

});
