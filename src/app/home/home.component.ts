import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sidePanelClosed: boolean;
  constructor() {
    this.sidePanelClosed = true;
  }

  ngOnInit() {
  }

  toggleSidePanel() {
    this.sidePanelClosed = !this.sidePanelClosed;

  }
}
