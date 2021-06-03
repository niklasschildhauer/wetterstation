import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { INITIAL_USER_CONTEXT, PollenType, UserContext } from '../model/user-context';

@Injectable({
  providedIn: 'root'
})
export class UserContextApiService {
  private loginURL = '/auth/login'
  private checkTokenURL = '/auth/checkToken'
  private allPollenTypesURL = '/pollen/all'

  constructor(private httpClient: HttpClient) { }

  public postLogin(password: string, username: string): Observable<{token: string, userContext: UserContext}> {
    let returnObservable = new Observable<{token: string, userContext: UserContext}>((observer) => {
      let response = this.httpClient.post<LoginResponse>(this.loginURL, 
                                                        {username: username, password: password}, {observe: 'response'});
      response.subscribe((response) => {
        let body = response.body
        let status = response.statusText
        console.log(status);

        if(body){
            if(body.success) {
              observer.next({
                token: body.token,
                userContext: INITIAL_USER_CONTEXT // FIXME
              });
            } else {
              observer.error(body.message);
            }
          }
        },
        (error)=> {
          observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.");
        },() => {
          observer.complete();
        }

      );
    }
  );
  return returnObservable;
  }

  public loadPollenTypes(): Observable<PollenType[]>{
    let returnObservable = new Observable<PollenType[]>((observer) => {
      let response = this.httpClient.get<PollenType[]>(this.allPollenTypesURL);
      response.subscribe(data => {
        observer.next(data);
        observer.complete();
      })
    });
    return returnObservable;
  }

  public postIsTokenValid(token: string): Observable<boolean> {
    let returnObservable = new Observable<boolean>((observer) => {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      };
      let response = this.httpClient.post<CheckTokenResponse>(this.checkTokenURL, httpOptions);
      response.subscribe(data => {
        console.log(data);
        observer.next(true);
        observer.complete();
      })
    });
    return returnObservable;
  }
}


interface LoginResponse {
  success: boolean,
  message: string,
  user: string,
  token: string,
}

interface CheckTokenResponse {
  success: boolean,
  message: string,
}

