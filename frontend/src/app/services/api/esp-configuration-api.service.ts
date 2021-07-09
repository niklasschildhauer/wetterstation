import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * ESP configuration api service injectable
 * 
 * Use this service to access the network
 */
@Injectable({
  providedIn: 'root'
})
export class ESPConfigurationAPIService {
  private allConfigs = environment.baseURL + '/espconfig/all';
  private changeConfig = environment.baseURL + '/espconfig/change';

  constructor(private httpClient: HttpClient) { }

  /**
   * @returns an observable with ESPConfigurations[] object
   */
  public loadESPConfigs(): Observable<ESPConfiguration[]>{
    let returnObservable = new Observable<ESPConfiguration[]>((observer) => {
      let response = this.httpClient.get<ESPConfiguration[]>(this.allConfigs);
      response.subscribe(data => {
        observer.next(data);
        observer.complete();
      })
    });
    return returnObservable;
  }

  /**
   * @returns an observable with the updatet ESPConfiguration
   */
  public postESPConfiguration(configuration: ESPConfiguration): Observable<ESPConfiguration> {
    let returnObservable = new Observable<ESPConfiguration>((observer) => {
      let response = this.httpClient.post<ESPConfiguration>(this.changeConfig, configuration,{observe: 'response'});
      response.subscribe((response) => {
        let body = response.body
        let status = response.statusText
        console.log(status);

        if(body){
          observer.next(body);
          observer.complete();
        }
    
        },
        (error)=> {
          observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut. ");
          console.log(error);
          observer.complete();
        },() => {
          observer.complete();
        }
      );
    }
  );
  return returnObservable;
  }
}

/**
 * Model of ESPConfiguration response
 */
export interface ESPConfiguration {
  id: number,
  roomName: string,
  transmissionFrequency: number,
}
