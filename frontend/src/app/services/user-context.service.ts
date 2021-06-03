import { Injectable } from '@angular/core';
import { UserContext, Themes, INITIAL_USER_CONTEXT, PollenType } from '../model/user-context';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  private loginURL = '/auth/login'
  private allPollenTypesURL = '/pollen/all'

  set token(value: string) {
    this._token = value;
    this.saveTokenToLocalStorage();
  }
  get token(): string {
    return this._token;
  }
  private _token: string;

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
    private httpClient: HttpClient) { 
    this._userContext.next(this.localStorageService.userContext);
    this._token = this.localStorageService.token;
    this.loadPollenTypes();
  }
  
  public login(username: string, password: string): Observable<any> {
    console.log(username + password)
    let response = this.httpClient.post<LoginResponse>(this.loginURL, {username: username, password: password});
    response.subscribe(data => {
      this.token = data.token;
    })
    this.resetUserContext()

    return response;
  }

  // DELETE ME
  public register(): Promise<UserContext> {
    this.resetUserContext();
    console.log(INITIAL_USER_CONTEXT);
    return new Promise((resolve) => {
      resolve(this._userContext.getValue());
    });
  }

  public logout() {
    this.resetUserContext();
    this.router.navigateByUrl('/onboarding/login'); //FIXME
  }

  private resetUserContext() {
    this.userContext = INITIAL_USER_CONTEXT;
  }

  private saveUserContext() {
    this.saveUserContextToLocalStorage()
  }

  private saveTokenToLocalStorage() {
    this.localStorageService.token = this._token;
  }

  private saveUserContextToLocalStorage() {
    this.localStorageService.userContext = this._userContext.getValue();
  }

  private loadPollenTypes() {
    let response = this.httpClient.get<PollenType[]>(this.allPollenTypesURL);
    response.subscribe(data => {
      this.pollenTypes = data
    })
  }
}

interface LoginResponse {
  success: boolean,
  message: string,
  user: string,
  token: string,
}


