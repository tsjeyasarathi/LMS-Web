import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

  constructor() { }

  loggedIn() {
    return (this.getToken() == undefined || this.getToken() == "" || this.getToken() == null) ?  false: true
  }

  clearToken() {
    localStorage.removeItem('lv-lms-g-token');
    localStorage.removeItem('lv-lms-u-id');
  }

  setToken(id, token) {
    localStorage.setItem('lv-lms-u-id', id);
    localStorage.setItem('lv-lms-g-token', token);
  }

  getId() {
    return localStorage.getItem('lv-lms-u-id');
  }

  getToken() {
    return localStorage.getItem('lv-lms-g-token');
  }
}
