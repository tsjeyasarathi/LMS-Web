import { trigger, state, style, transition, animate, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from  '@angular/router';

/**
 * Imports amplifyr's generic services.
 */
import { AuthService } from './../shared/services/auth.service';
import { UrlService } from './../shared/services/url.service';

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

  constructor(private route: ActivatedRoute, private authService: AuthService,
              public urlService: UrlService, private router: Router) {

    this.showLogin = true;
  }

  toggleLogin() {
    this.showLogin = !this.showLogin;
  }


  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      if (params['token'] != undefined) {
        let user = params['user'];
        let token = params['token'];
        this.checkStatus(user, token);
      }
    });

    this.checkAuthentication();
  }

  /**
   * Checks the status of users and do related actions
   * @param user User id
   * @param token Access token of user
   * @returns none
   */
  checkStatus(user, token) {

    this.authService.setToken(user, token);
  }

  /**
   * Checks wether used is logged in
   * and Redirects to users repository
   */
  checkAuthentication() {
    // if user is logged in - redirect to home
    // else show error in log in
    if (this.authService.loggedIn()) {
      // route to home component
      this.router.navigate(['/overview']);
    }
  }
}
