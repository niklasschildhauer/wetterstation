import { Injectable } from '@angular/core';
import { INITIAL_USER_CONTEXT, UserContext } from '../model/user-context';
import { UserContextService } from './user-context.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private static userContextIdentifier = "wetterstation-user-context"
  private static tokenIdentifier = "wetterstation-token"


  constructor() { }

  public saveUserContext(object: UserContext) {
    let objectString = JSON.stringify(object)
    this.setItem(LocalStorageService.userContextIdentifier, objectString);
    console.log("SAVED USER CONTEXT");
  }

  public getUserContext(): UserContext {
    let objectString = this.getItem(LocalStorageService.userContextIdentifier);
    if (objectString) {
      let userContext = JSON.parse(objectString) as UserContext;
      return userContext
    } 
    return INITIAL_USER_CONTEXT
  }

  public saveToken(token: string) {
    this.setItem(LocalStorageService.tokenIdentifier, token);
    console.log(token);
    console.log("SAVED TOKEN");
  }

  public getToken(): string {
    let token = this.getItem(LocalStorageService.tokenIdentifier);
    return token ? token : "";
  }

  private setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
    
  private getItem(key: string){ 
    return localStorage.getItem(key)
  }
  private removeItem(key:string) {
    localStorage.removeItem(key);
  }
  public clear(){
    localStorage.clear(); 
  }
}