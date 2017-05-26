import { Injectable } from '@angular/core';

import { HttpClientService } from './http-client.service';
import { ConfigurationService } from './configuration.service';
import 'rxjs/Rx';

@Injectable()
export class UsersService {

  constructor(private http: HttpClientService, private configurationService: ConfigurationService) { }

  getUsers () {
    let url = this.configurationService.getHost() + '/users';
    return this.http.get(url);
  }

  getUser (id: string) {
    let url = this.configurationService.getHost() + '/users/'+id;
    return this.http.get(url);
  }

}
