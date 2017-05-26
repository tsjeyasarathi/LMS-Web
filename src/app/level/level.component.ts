import { trigger, state, style, transition, animate, Component, OnInit, TemplateRef, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import { Http, Headers, Response } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.css']
})
export class LevelComponent implements OnInit {
level:string;
showTimeline:  boolean;
showTimelineSection: boolean;


  constructor(private route: ActivatedRoute, public router: Router, public renderer: Renderer ,private http: Http) {this.showTimeline =  true;
    this.showTimelineSection = false; }

  ngOnInit() { this.route.params.forEach((params: Params) => {

            this.level = params['name'];

        });

  }
  toggleTimeline(state) {
    this.showTimeline = state;
  }

  toggleTimelineSection() {
    this.showTimelineSection = !this.showTimelineSection;
  }



Leveldate(courseid,flag=0,level) {
     var resp;

        if (flag == 1){
           console.log('1st level call'); this.http.post('http://localhost:8080/user/levelupd',{ 'course_id':courseid,'level':level,'user_id':1772 })

            .subscribe((res) => {

                resp=res;

                console.log('response is',resp);

            });

        }




    }
}
