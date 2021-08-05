import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { POLLENTYPES } from 'src/app/model/mock-data/weather.mock';
import { environment } from 'src/environments/environment';
import { PollenType, Themes, UserContext, UserIdentifikation } from '../../model/user-context';

/**
 * User context api service injectable
 * 
 * Use this service to access the network. It implements all routes for 
 * user context data
 */
@Injectable({
  providedIn: 'root'
})
export class UserContextAPIService {
  private loginURL = environment.baseURL + 'auth/login';
  private registerURL = environment.baseURL + 'user/register';
  private checkTokenURL = environment.baseURL + 'auth/checkToken';
  private currentUserContextURL = environment.baseURL + 'user/currentUser';
  private saveUserContextURL = environment.baseURL + 'user/save';
  private allPollenTypesURL = environment.baseURL + 'pollen/all';
  private deletePollenURL = environment.baseURL + 'allergies/delete';
  private savePollenURL = environment.baseURL + 'allergies/save';
  private openAPEURL = environment.baseURL + 'user/loadOpenAPESettingsAndSave';
  private openSaveContextAPEURL = environment.baseURL + 'user/writeOpenAPESettings';


  constructor(private httpClient: HttpClient) { }

  /**
   * @returns an observable with the user identifikation and the user context
   */
  public postLogin(password: string, username: string): Observable<{userID: UserIdentifikation, userContext: UserContext}> {
    let returnObservable = new Observable<{userID: UserIdentifikation, userContext: UserContext}>((observer) => {
      let response = this.httpClient.post<LoginResponse>(this.loginURL, 
                                                        {username: username, password: password}, {observe: 'response'});
      response.subscribe((response) => {
        let body = response.body
        if(body){
          if(body.success) {
            observer.next({
              userID: {
                token: body.token,
                id: body.userContext.id
              },
              userContext: this.createUserContextFromServerResponse(body.userContext)
            });
          } else {
            observer.error(body.message);
          }
        }
      },
      (error)=> {
        observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut. ");
        console.log(error);
        observer.complete();
      },() => {
        observer.complete();
      });
    }
  );
  return returnObservable;
  }

  /**
   * @returns an observable with an user context object
   */
  public postLoginOpenAPE(username: string, password: string, userID: UserIdentifikation): Observable<UserContext> {
    let returnObservable = new Observable<UserContext>((observer) => {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + userID.token }),
      };
      let response = this.httpClient.post<UserContextResponse>(this.openAPEURL, 
                                                              {openApeUser: username, openApePassword: password}, httpOptions);
      response.subscribe((response) => {
        if(response){
            observer.next(this.createUserContextFromServerResponse(response));
        }
      },
      (error)=> {
        observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut. ");
        console.log(error);
        observer.complete();
      },() => {
        observer.complete();
      });
    }
  );
  return returnObservable;
  }

   /**
   * @returns an observable if the post to open ape succeeded or not
   */
    public postContextToOpenAPE(username: string, password: string, userID: UserIdentifikation): Observable<Boolean> {
      let returnObservable = new Observable<Boolean>((observer) => {
        let httpOptions = {
          headers: new HttpHeaders({ 'Authorization': 'Bearer ' + userID.token }),
        };
        let response = this.httpClient.post<String>(this.openSaveContextAPEURL, 
                                                                {openApeUser: username, openApePassword: password}, httpOptions);
        response.subscribe((response) => {
          if(response === "ok"){
              observer.next(true);
          } else {
            observer.next(false);
          }
        },
        (error)=> {
          observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut. ");
          console.log(error);
          observer.complete();
        },() => {
          observer.complete();
        });
      }
    );
    return returnObservable;
    }

  /**
   * @returns an observable with a boolean if the register was successful or not
   */
  public postRegister(password: string, username: string): Observable<boolean> {
    let returnObservable = new Observable<boolean>((observer) => {
      let response = this.httpClient.post<UserContextResponse>(this.registerURL, 
                                                              {username: username, password: password}, {observe: 'response'});
      response.subscribe((response) => {
        let body = response.body
        if(body){
          if(body.id) {
            observer.next(true);
          } else {
            observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut");
          }
        }
      },
      (error)=> {
        observer.error("Ein Fehler ist aufgetreten. Bitte versuche es später erneut");
        console.log(error);
        observer.complete();
      },
      () => {
        observer.complete();
      });
    }
  );
  return returnObservable;
  }

  /**
   * @returns an observable with a boolean if the saving user context was successful or not
   */
  public putSaveUserContext(userID: UserIdentifikation, userContext: UserContext): Observable<boolean>{
    let body = {
      theme: Themes[userContext.theme],
      fontSize: userContext.fontSize,
      selfVoicingEnabled: userContext.selfVoicingEnabled,
      doVentilationReminder: userContext.doVentilationReminder,
      reduceMotion: userContext.reduceMotion
    }
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + userID.token }),
      params: new HttpParams().set('id', userID.id + ''),
    };
    let returnObservable = new Observable<boolean>((observer) => {
      let response = this.httpClient.put<UserContextResponse>(this.saveUserContextURL, body, httpOptions);
      response.subscribe((response) => {
        let body = response
        if(body && body.id) {
          observer.next(true);
          observer.complete();
        } else {
          observer.error("POST - SAVE USER CONTEXT - Ein Fehler ist aufgetreten.");
        }
      },
      (error)=> {
        observer.error("POST - SAVE USER CONTEXT - Ein Fehler ist aufgetreten.");
        console.log(error);
        observer.complete();
      }, 
      () => {
        observer.complete();
      });
    });
    return returnObservable;
  }

  /**
   * @returns an observable with a boolean if the deletion user context was successful or not
   */
  public deletePolleFromUserContext(userID: UserIdentifikation, pollenID: number): Observable<boolean>  {
    let body = {
      userID: userID.id,
      pollenID: pollenID
    }
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + userID.token }), body: body
    };
    let returnObservable = new Observable<boolean>((observer) => {
      let response = this.httpClient.delete(this.deletePollenURL, httpOptions);
      response.subscribe(() => {
        observer.next(true);
      },
      (error) => {
        observer.error("DELETE - Polle");
        console.log(error);
        observer.complete();
      }, 
      () => {
        observer.complete();
      });

    });
    return returnObservable;
  }

  /**
   * @returns an observable with a boolean if the insertion was successful or not
   */
  public postPolleToUserContext(userID: UserIdentifikation, pollenID: number): Observable<boolean> {
    let body = {
      userID: userID.id,
      pollenID: pollenID
    }
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + userID.token }),
    };
    let returnObservable = new Observable<boolean>((observer) => {
      let response = this.httpClient.post(this.savePollenURL, body, httpOptions);
      response.subscribe(() => {
        observer.next(true);
      },
      (error)=> {
        observer.error("DELETE - Polle");
        console.log(error);
        observer.complete();
      }, 
      () => {
        observer.complete();
      });
    });
    return returnObservable;
  }
  /**
   * @returns an observable with a boolean if the token is valid or not
   */
  public postIsTokenValid(token: string): Observable<boolean> {
    let returnObservable = new Observable<boolean>((observer) => {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      };
      let response = this.httpClient.get<CheckTokenResponse>(this.checkTokenURL, httpOptions);
      response.subscribe(data => {
        observer.next(data.success);
        observer.complete();
      }, 
      () => {
        observer.next(false);
        observer.complete();
      })
    });
    return returnObservable;
  }

  /**
   * @returns an observable with an user context object
   */
  public loadUserContext(token: string): Observable<UserContext>{
    let returnObservable = new Observable<UserContext>((observer) => {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      };
      let response = this.httpClient.get<UserContextResponse>(this.currentUserContextURL, httpOptions);
      response.subscribe(context => {
        observer.next(this.createUserContextFromServerResponse(context));
        observer.complete();
      }, 
      () => {
        observer.error("An error occured")
        observer.complete();
      })
    });
    return returnObservable;
  }

  /**
   * @returns an observable with pollen types array
   */
  public loadPollenTypes(): Observable<PollenType[]>{
    if (environment.testData) {
      return of(POLLENTYPES)
    }
    let returnObservable = new Observable<PollenType[]>((observer) => {
      let response = this.httpClient.get<PollenType[]>(this.allPollenTypesURL);
      response.subscribe(data => {
        observer.next(data);
      });
    });
    return returnObservable
  }

  /**
   * Helper function to create user context object from server response.
   * @param userContext 
   * @returns an user context object
   */
  private createUserContextFromServerResponse(userContext: UserContextResponse): UserContext {
    return {
      theme: this.getThemeTypeFromServerResponse(userContext.theme),
      fontSize: userContext.fontSize,
      pollen: userContext.pollen, 
      doVentilationReminder: userContext.doVentilationReminder,
      reduceMotion: userContext.reduceMotion,
      selfVoicingEnabled: userContext.selfVoicingEnabled
    }
  }

  /**
   * Helper function to convert theme String to Theme type
   * @return the converted Theme
   */
  private getThemeTypeFromServerResponse(theme: string): Themes {
    switch(theme) {
      case "Dark": return Themes.Dark;
      case "Light": return Themes.Light;
      case "HighContrast": return Themes.HighContrast;
      default: return Themes.Automatic;
    }
  }
}

/**
 * Model of the login response
 */
interface LoginResponse {
  success: boolean,
  message: string,
  userContext: UserContextResponse,
  token: string,
}

/**
 * Model of the user context response
 */
interface UserContextResponse {
  id: number,
  username: string,
  theme: string,
  fontSize: number,
  selfVoicingEnabled: boolean,
  doVentilationReminder: boolean,
  reduceMotion: boolean,
  pollen: string[]
}

/**
 * Model of the check token response
 */
interface CheckTokenResponse {
  success: boolean,
  message: string,
}

