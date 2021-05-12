import { Injectable } from '@angular/core';
import { INITIAL_USER_CONTEXT, UserContext } from '../model/user-context';
import { UserContextService } from './user-context.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private static userContextIdentifier = "wetterstation-user-context"

  constructor() { }

  public saveUserContext(object: UserContext) {
    let objectString = JSON.stringify(object)
    this.setItem(LocalStorageService.userContextIdentifier, objectString);
  }

  public getUserContext(): UserContext {
    let objectString = this.getItem(LocalStorageService.userContextIdentifier);
    if (objectString) {
      let userContext = JSON.parse(objectString) as UserContext;
      console.log(userContext); // DELETE ME
      return userContext
    } 
    return INITIAL_USER_CONTEXT
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