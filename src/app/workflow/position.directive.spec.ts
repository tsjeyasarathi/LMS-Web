/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Directive, ElementRef, HostListener, Input, Renderer } from '@angular/core';
import {PositionDirective} from "./position.directive";

describe('Component: PositionDirective', () => {
  it('should create an instance', () => {
    let el: ElementRef;
    let component = new PositionDirective(el);
    expect(component).toBeTruthy();
  });

});
