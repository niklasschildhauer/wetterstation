import { Injectable } from '@angular/core';
import { UserContext, Themes, INITIAL_USER_CONTEXT, Pollen } from '../model/user-context';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { WeatherDataService } from './weather-data.service';
import { HttpClient } from '@angular/common/http';

export interface UserContextDelegte {
  updatedUserContext(from: UserContextService): void
}

@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  public delegate?: UserContextDelegte;
  private _token: string;
  private _userContext: BehaviorSubject<UserContext> = new BehaviorSubject<UserContext>(INITIAL_USER_CONTEXT); // FIXME
  
  set token(value: string) {
    this._token = value;
    this.saveTokenToLocalStorage();
  }
  get token(): string {
    return this._token;
  }
  set userContext(object: UserContext) {
    this._userContext.next(object);
    this.saveUserContext();
  }
  get theme() {
    return this._userContext.getValue().theme;
  }
  set theme(value: Themes) {
    let userContext = this._userContext.getValue()
    userContext.theme = value;
    this.userContext = userContext;
  }
  set reduceMotion(value: boolean) {
    let userContext = this._userContext.getValue()
    userContext.reduceMotion = value;
    this.userContext = userContext;
  }
  set selfVoicingEnabled(value: boolean) {
    let userContext = this._userContext.getValue()
    userContext.selfVoicingEnabled = value;
    this.userContext = userContext;
  }
  set doVentilationReminder(value: boolean) {
    let userContext = this._userContext.getValue()
    userContext.doVentilationReminder = value;
    this.userContext = userContext;
  }
  set fontSize(value: number) {
    let userContext = this._userContext.getValue()
    userContext.fontSize = value;
    this.userContext = userContext;
  }
  set pollen(value: Pollen[]) {
    let userContext = this._userContext.getValue()
    userContext.pollen = value;
    this.userContext = userContext;
  }
  get pollen() {
    return this._userContext.getValue().pollen;
  }

  private loginURL = '/auth/login'

  constructor(private localStorageService: LocalStorageService,
    private router: Router,
    private httpClient: HttpClient) { 
    this._userContext.next(this.localStorageService.getUserContext());
    this._token = this.localStorageService.getToken();
  }
  
  login(username: string, password: string): Observable<any> {
    console.log(username + password)
    let response = this.httpClient.post<LoginResponse>(this.loginURL, {username: username, password: password});
    response.subscribe(data => {
      this.token = data.token;
    })
    this.resetUserContext()

    return response;
  }

  // DELETE ME
  register(): Promise<UserContext> {
    this.resetUserContext();
    console.log(INITIAL_USER_CONTEXT);
    return new Promise((resolve) => {
      resolve(this._userContext.getValue());
    });
  }

  logout() {
    this.resetUserContext();
    this.router.navigateByUrl('/onboarding/login'); //FIXME
  }

  getUserContext(): BehaviorSubject<UserContext> {
    return this._userContext;
  }

  private resetUserContext() {
    this.userContext = INITIAL_USER_CONTEXT;
  }

  private saveUserContext() {
    this.saveUserContextToLocalStorage()
    this.delegate?.updatedUserContext(this);
  }

  private saveTokenToLocalStorage() {
    this.localStorageService.saveToken(this._token);
  }

  private saveUserContextToLocalStorage() {
    this.localStorageService.saveUserContext(this._userContext.getValue())
  }
}

interface LoginResponse {
    success: boolean,
    message: string,
    user: string,
    token: string,
  }

