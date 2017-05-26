import { Injectable } from '@angular/core';

import { ConfigurationService } from './configuration.service';

@Injectable()
export class UrlService {
  constructor(private configurationService: ConfigurationService) {

  }

  getAuthURL() {
    let url = encodeURIComponent("http://localhost:4201/#/login");
    return this.configurationService.getHost() + "/auth/google-oauth/"+url;
  }

}
