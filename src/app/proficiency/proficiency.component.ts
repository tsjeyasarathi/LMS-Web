import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proficiency',
  templateUrl: './proficiency.component.html',
  styleUrls: ['./proficiency.component.css']
})
export class ProficiencyComponent implements OnInit {
  showTimeline:  boolean;
  showTimelineSection: boolean;
  tech: string;
  level: number;
  step: number;

  constructor() {
    this.showTimeline =  true;
    this.showTimelineSection = false;
    this.tech = 'SQL';
    this.level = 1;
    this.step = 1;
  }

  ngOnInit() {
  }

  toggleTimeline(state) {
    this.showTimeline = state;
  }

  toggleTimelineSection() {
    this.showTimelineSection = !this.showTimelineSection;
  }

  setStep(step) {
    this.step = step;
  }

  nextStep() {
    this.step += 1;
  }

  previousStep() {
    if (this.step != 1) {
      this.step -= 1;
    }
  }

  complete() {
    this.level += 1;
  }
}
