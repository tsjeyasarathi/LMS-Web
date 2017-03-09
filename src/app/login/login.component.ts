import { trigger, state, style, transition, animate, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('toggleAlertPanel', [
      state('in', style({opacity: 1, transform: 'translateY(0)'})),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(5%)'
        }),
        animate('0.5s ease-in')
      ]),
      transition('* => void', [
        animate('0.5s 10 ease-in', style({
          opacity: 0,
          transform: 'translateY(-15%)'
        }))
      ])

    ])
  ]
})
export class LoginComponent implements OnInit {

  showLogin: boolean;

  constructor() {
    this.showLogin = true;
  }

  toggleLogin() {
    if(this.showLogin) {
      this.showLogin = false;
    } else {
      this.showLogin = true;
    }
  }

  ngOnInit() {
  }

}
