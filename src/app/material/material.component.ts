import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {
  showTimeline:  boolean;
  constructor() {
    this.showTimeline =  true;
  }

  ngOnInit() {
  }

  toggleTimeline(state) {
    this.showTimeline = state;
  }

}
