import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SENSOR1, SENSOR2 } from 'src/app/model/mock-data/weather.mock';
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
  private allConfigs = environment.baseURL + 'espconfig/all';
  private changeConfig = environment.baseURL + 'espconfig/change';
  private calibration = environment.baseURL + 'calibration/insert';

  constructor(private httpClient: HttpClient) { }

  /**
   * @returns an observable with ESPConfigurations[] object
   */
  public loadESPConfigs(): Observable<ESPConfiguration[]> {
    if (environment.testData) {
      return of([SENSOR1, SENSOR2]) 
    }
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
    });
    return returnObservable;
  }

  /**
   * Starts the Calibration worker for the given sensor kit
   * @param sensorId  the device id of the sensor
   * @returns an observable with a boolean
   */
     public startConfiguration(sensorId: number): Observable<boolean>{
      let returnObservable = new Observable<boolean>((observer) => {
        let httpOptions = {
          params: new HttpParams().set('deviceID', sensorId + ''),
        };
        let response = this.httpClient.get(this.calibration, httpOptions);
        response.subscribe(() => {
          observer.next(true);
          observer.complete();
        },
        () => {
          observer.next(false);
          observer.complete();
        })
      });
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
  sensorType: string,
  postalCode: string, 
}
