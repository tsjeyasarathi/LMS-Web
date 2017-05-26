import { Injectable } from '@angular/core';
import {Http, XHRBackend, RequestOptions, Request, RequestOptionsArgs, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthService } from './auth.service';
import { Router } from  '@angular/router';

@Injectable()
export class HttpClientService extends Http {

  authService: AuthService;
  router: Router;

  constructor (backend: XHRBackend, options: RequestOptions, authService: AuthService, router: Router) {

    let token = authService.getToken();
    options.headers.set('Authorization', `${token}`);
    super(backend, options);
    this.authService = authService;
    this.router = router;
  }

  request(url: string|Request, options?: RequestOptionsArgs): Observable<Response> {
    let token = this.authService.getToken();
    if (typeof url === 'string') {
      if (!options) {
        // let's make option object
        options = {headers: new Headers({'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'})};
      }
      options.headers.set('Authorization', `${token}`);
    } else {
      url.headers.set('Authorization', `${token}`);
    }
    return super.request(url, options).catch(this.catchAuthError(this));
  }

  private catchAuthError (self: HttpClientService) {
    // we have to pass HttpService's own instance here as `self`
    return (res: Response) => {
      console.log(res);
      if (res.status === 401 || res.status === 403) {
        // if not authenticated
        this.authService.clearToken();
        this.router.navigate(["/login", res.status]);
      }
      return Observable.throw(res);
    };
  }
}
