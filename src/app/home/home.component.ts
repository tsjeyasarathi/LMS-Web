import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from  '@angular/router';

import { AuthService } from './../shared/services/auth.service';
import { UsersService } from './../shared/services/users.service';
import { LoginService } from './../shared/services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sidePanelClosed: boolean;
  userInfo: any;

  constructor(private authService: AuthService, private usersService: UsersService,
              private router: Router, private loginService: LoginService) {
    this.userInfo = {
      created_at: "",
      email: "",
      first_name: "",
      id: "",
      last_name: "",
      username: ""
    };

    this.sidePanelClosed = true;
  }

  toggleSidePanel() {
    this.sidePanelClosed = !this.sidePanelClosed;

  }

  ngOnInit() {
    // Fetch logged in user information
    this.getUserInfo();
  }

  getUserInfo() {
    let id = this.authService.getId();
    if (id != undefined || id != "" || id != null) {
      this.usersService.getUser(id).subscribe((data)=>{
        if (data.json() != null && data.json() != "" && data.json() != undefined) {
          this.userInfo = data.json();
        }
      });
    }
  }

  logout() {
    this.loginService.logout().subscribe((data)=>{
      this.authService.clearToken();
      this.router.navigate(["/login"]);
    });

  }
}
