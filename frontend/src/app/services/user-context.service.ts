import { Injectable } from '@angular/core';
import { UserContext, Themes, INITIAL_USER_CONTEXT, PollenType } from '../model/user-context';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { UserContextAPIService } from './api/user-context-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  set token(value: string) {
    this.localStorageService.token = value
  }
  get token(): string {
    return this.localStorageService.token
  }

  get userLoggedIn(): boolean {
    return this.localStorageService.token !== "" && this.localStorageService.token !== undefined
  }

  set disableLogin(value: boolean) {
    this.localStorageService.disableLogin = value
  }
  get disableLogin(): boolean {
    return this.localStorageService.disableLogin
  }

  set userContext(object: UserContext) {
    this._userContext.next(object);
    this.saveUserContext();
  }
  get userContext(): UserContext {
    return this._userContext.getValue();
  }
  private _userContext: BehaviorSubject<UserContext> = new BehaviorSubject<UserContext>(INITIAL_USER_CONTEXT); 
  public getUserContextSubject(): BehaviorSubject<UserContext> {
    return this._userContext;
  }

  get theme() {
    return this.userContext.theme;
  }
  set theme(value: Themes) {
    let userContext = this.userContext;
    userContext.theme = value;
    this.userContext = userContext;
  }
  set reduceMotion(value: boolean) {
    let userContext = this.userContext;
    userContext.reduceMotion = value;
    this.userContext = userContext;
  }
  set selfVoicingEnabled(value: boolean) {
    let userContext = this.userContext;
    userContext.selfVoicingEnabled = value;
    this.userContext = userContext;
  }
  set doVentilationReminder(value: boolean) {
    let userContext = this.userContext;
    userContext.doVentilationReminder = value;
    this.userContext = userContext;
  }
  set fontSize(value: number) {
    let userContext = this.userContext;
    userContext.fontSize = value;
    this.userContext = userContext;
  }
  set pollen(value: string[]) {
    let userContext = this.userContext;
    userContext.pollen = value;
    this.userContext = userContext;
  }
  get pollen() {
    return this.userContext.pollen;
  }
  set pollenTypes(value: PollenType[]) {
    this._pollenTypes.next(value);
  }
  get pollenTypes(): PollenType[] {
    return this._pollenTypes.value
  }
  private _pollenTypes: BehaviorSubject<PollenType[]> = new BehaviorSubject<PollenType[]>([]); 

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private userContextAPI: UserContextAPIService) { 
    this._userContext.next(this.localStorageService.userContext);
    this.loadPollenTypes()

  }
  
  public login(username: string, password: string): Promise<{success: boolean, error: string}>  {  
    let promise = new Promise<{success: boolean, error: string}>((resolve) => {
      this.resetUserContext()
      let response = this.userContextAPI.postLogin(password, username)
      response.subscribe((data) => {
        this.token = data.token;
        this.userContext = data.userContext;
        this.disableLogin = false;

        resolve({success: true, error:""})
      },
      (error) => {
        resolve({success: false, error: error})
      })
    });
    return promise
  }

  public register(username: string, password: string): Promise<{success: boolean, error: string}> {
    let promise = new Promise<{success: boolean, error: string}>((resolve) => {
      this.resetUserContext();
      this.userContextAPI.postRegister(password, username).subscribe((registerData) => {
        if(registerData.success) {
          this.login(username, password).then(loginData => {
            resolve(loginData);
          })
        } else {
          resolve(registerData)
        }
      },
      (error) => {
        resolve({success: false, error: error})
      })
    });
    return promise
  }

  public logout() {
    this.resetUserContext();
    this.showLoginScreen();
  }
  public refreshUserContextIfNeeded(): Observable<boolean> {
    console.log("Refresh if needed")      
    let returnObservable = new Observable<boolean>((observer) => {
      console.log("token", this.token)

      if(this.disableLogin || this.token === '') {
        observer.next(true);
        observer.complete(); 
      }
      console.log("Wir checken den token")
      this.userContextAPI.postIsTokenValid(this.token).subscribe((data) => {
        if(data) {
          this.userContextAPI.loadUserContext(this.token).subscribe(data => {
            this.userContext = data
            observer.next(true);
            observer.complete(); 
          });
        } else {
          observer.next(false);
          observer.complete(); 
        }
      })
    });
    return returnObservable
  }

  private showLoginScreen() {
    this.router.navigateByUrl('/onboarding/login');
  }

  private resetUserContext() {
    this.localStorageService.clear();
    this.userContext = INITIAL_USER_CONTEXT;
    this.token = "";
    this.disableLogin = false;
  }

  private saveUserContext() {
    this.saveUserContextToLocalStorage()
    // FIXME: server post request
  }

  private saveUserContextToLocalStorage() {
    this.localStorageService.userContext = this._userContext.getValue();
  }

  private loadPollenTypes() {
    this.userContextAPI.loadPollenTypes().subscribe((data) => {
      this.pollenTypes = data;
    });
  }
}


