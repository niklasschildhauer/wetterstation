import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ESPConfigurationAPIService {
  private allConfigs = '/espconfig/all'
  private changeConfig = '/espconfig/change'

  constructor(private httpClient: HttpClient) { }

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
          observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut. " + error);
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

export interface ESPConfiguration {
  id: number,
  roomName: string,
  transmissionFrequency: number,
}
