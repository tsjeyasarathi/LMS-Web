import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {

  host: string;
  datasetPath : string;
  constructor() {
    this.host = "http://localhost:4040";
    this.datasetPath = '/datasets/';
  }

  getHost() {
    return this.host;
  }

  getDatasetPath() {
    return this.datasetPath;
  }

}
