import { trigger, state, style, transition, animate, Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer } from '@angular/core';
//import { Node }  from './node';
//import { FlowchartComponent } from './../shared/components/flowchart/flowchart.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-intermediate',
  templateUrl: './intermediate.component.html',
  styleUrls: ['./intermediate.component.css']
})
export class IntermediateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
