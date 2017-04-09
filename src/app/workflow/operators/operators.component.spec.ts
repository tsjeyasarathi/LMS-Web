/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { OperatorsComponent } from './operators.component';

describe('Component: Operators', () => {
  it('should create an instance', () => {
    let component = new OperatorsComponent();
    expect(component).toBeTruthy();
  });

  it('should toggle node state', () => {
    let component = new OperatorsComponent();
    let node = {state: true, iconClass: 'fa-caret-down'};
    let newNode = component.toggleSlide(node);
    expect(newNode.state).toBeFalsy();
    expect(newNode.iconClass).toEqual('fa-caret-right');
  });

  it('should toggle node state', () => {
    let component = new OperatorsComponent();
    let node = {state: false, iconClass: 'fa-caret-right'};
    let newNode = component.toggleSlide(node);
    expect(newNode.state).toBeTruthy();
    expect(newNode.iconClass).toEqual('fa-caret-down');
  });

  it('should clear search results', async(() => {
    let component = new OperatorsComponent();
    component.clearSearchResults();
    setTimeout(function () {
      expect(component.clearSearchResultsStatus).toBeFalsy();
      expect(component.searchOperatorFilter).toBe('');
    }, 1000);
  }));

  it('should toggle search results status to false', async(() => {
    let component = new OperatorsComponent();
    component.searchOperatorFilter = '';
    component.changeSearchResultsStatus();
    setTimeout(function () {
      expect(component.clearSearchResultsStatus).toBeFalsy();
    }, 1000);
  }));

  it('should toggle search results status to true', async(() => {
    let component = new OperatorsComponent();
    component.searchOperatorFilter = 'test';
    component.changeSearchResultsStatus();
    setTimeout(function () {
      expect(component.clearSearchResultsStatus).toBeTruthy();
    }, 1000);
  }));

});
