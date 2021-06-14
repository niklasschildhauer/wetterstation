import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PollenType, Themes, UserContext, UserIdentifikation } from '../../model/user-context';

@Injectable({
  providedIn: 'root'
})
export class UserContextAPIService {
  private loginURL = '/auth/login';
  private registerURL = '/user/register';
  private checkTokenURL = '/auth/checkToken';
  private currentUserContextURL = '/user/currentUser';
  private saveUserContextURL = '/user/save';
  private allPollenTypesURL = '/pollen/all';
  private deletePollenURL = '/pollen/delete';
  private savePollenURL = '/allergies/save';

  constructor(private httpClient: HttpClient) { }

  public postLogin(password: string, username: string): Observable<{userID: UserIdentifikation, userContext: UserContext}> {
    let returnObservable = new Observable<{userID: UserIdentifikation, userContext: UserContext}>((observer) => {
      let response = this.httpClient.post<LoginResponse>(this.loginURL, 
                                                        {username: username, password: password}, {observe: 'response'});
      response.subscribe((response) => {
        let body = response.body
        let status = response.statusText
        console.log(status);

        if(body){
          if(body.success) {
            console.log(this.createUserContextFromServerResponse(body.userContext));
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


  public postRegister(password: string, username: string): Observable<{success: boolean, error: string}> {
    let returnObservable = new Observable<{success: boolean, error: string}>((observer) => {
      let response = this.httpClient.post<UserContextResponse>(this.registerURL, 
                                                              {username: username, password: password}, {observe: 'response'});
      response.subscribe((response) => {
        let body = response.body
        let status = response.statusText
        console.log(status);

        if(body){
          if(body.id) {
            observer.next({success: true, error: ""});
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

  public putSaveUserContext(userID: UserIdentifikation, userContext: UserContext): Observable<{success: boolean, error: string}>{
    let body = {
      password: "string",
      username: "string",
      theme: Themes[userContext.theme],
      fontSize: userContext.fontSize,
      selfVoicingEnabled: userContext.selfVoicingEnabled,
      doVentilationReminder: userContext.doVentilationReminder,
      reduceMotion: userContext.reduceMotion
    }
    console.log(Themes[userContext.theme]);
    console.log(userID.token);
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + userID.token }),
      params: new HttpParams().set('id', userID.id + ''),
    };
    let returnObservable = new Observable<{success: boolean, error: string}>((observer) => {
      let response = this.httpClient.put<UserContextResponse>(this.saveUserContextURL, body, httpOptions);
      response.subscribe((response) => {
        let body = response
        if(body && body.id) {
          observer.next({success: true, error: ""});
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
      console.log(response);

    });
    return returnObservable;
  }

  public deletePolleFromUserContext(userID: UserIdentifikation, pollenID: number): Observable<{success: boolean, error: string}>  {
    let body = {
      userID: userID.id,
      pollenID: pollenID
    }
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + userID.token }), body: body
    };
    let returnObservable = new Observable<{success: boolean, error: string}>((observer) => {
      let response = this.httpClient.delete(this.deletePollenURL, httpOptions);
      response.subscribe(() => {
        observer.next({success: true, error: ''});
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

  public postPolleToUserContext(userID: UserIdentifikation, pollenID: number): Observable<{success: boolean, error: string}>  {
    let body = {
      userID: userID.id,
      pollenID: pollenID
    }
    let httpOptions = {
      headers: new HttpHeaders({ 'Authorization': 'Bearer ' + userID.token }),
    };
    let returnObservable = new Observable<{success: boolean, error: string}>((observer) => {
      let response = this.httpClient.post(this.savePollenURL, body, httpOptions);
      response.subscribe(() => {
        observer.next({success: true, error: ''})
      },
      (error)=> {
        observer.error("DELETE - Polle");
        console.log(error);
        observer.complete();
      }, 
      () => {
        observer.complete();
      });
      console.log(response);

    });
    return returnObservable;
  }

  public postIsTokenValid(token: string): Observable<boolean> {
    let returnObservable = new Observable<boolean>((observer) => {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      };

      console.log(httpOptions);
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

  public loadUserContext(token: string): Observable<UserContext>{
    let returnObservable = new Observable<UserContext>((observer) => {
      let httpOptions = {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + token })
      };
      let response = this.httpClient.get<UserContextResponse>(this.currentUserContextURL, httpOptions);
      response.subscribe(context => {
        console.log(this.createUserContextFromServerResponse(context));
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

  public loadPollenTypes(): Observable<PollenType[]>{
    let returnObservable = new Observable<PollenType[]>((observer) => {
      let response = this.httpClient.get<PollenType[]>(this.allPollenTypesURL);
      response.subscribe(data => {
        observer.next(data);
      });
    });
    return returnObservable
  }


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

  private getThemeTypeFromServerResponse(theme: string): Themes {
    switch(theme) {
      case "Dark": return Themes.Dark;
      case "Light": return Themes.Light;
      case "HighContrast": return Themes.HighContrast;
      default: return Themes.Automatic;
    }
  }

  private createThemeTypeForServerRequest(theme: Themes) {
    switch(theme) {
      case Themes.Dark: return "dark";
      case Themes.Light: return "light";
      case Themes.HighContrast: return "highContrast";
      default: return "automatic";
    }
  }
}


interface LoginResponse {
  success: boolean,
  message: string,
  userContext: UserContextResponse,
  token: string,
}

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

interface CheckTokenResponse {
  success: boolean,
  message: string,
}

