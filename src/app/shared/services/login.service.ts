import { Injectable } from '@angular/core';

import { HttpClientService } from './http-client.service';
import { ConfigurationService } from './configuration.service';
import 'rxjs/Rx';

@Injectable()
export class LoginService {

  constructor(private http: HttpClientService, private configurationService: ConfigurationService) { }

  logout() {
    let url = this.configurationService.getHost() + '/auth/logout';
    return this.http.get(url);
  }
}
