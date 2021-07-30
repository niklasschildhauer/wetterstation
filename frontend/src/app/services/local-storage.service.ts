import { Injectable } from '@angular/core';
import { INITIAL_USER_CONTEXT, INITIAL_USER_IDENTIFIKATION, UserContext, UserIdentifikation } from '../model/user-context';

/**
 * Local storage service injectable
 * 
 * Use this service to get access to the local storage of the browser.
 */
@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  /**
  * Save user context to local storage
  * 
  * @param {UserContext} object  UserContext object to save
  */
  set userContext(object: UserContext) {
    const objectString = JSON.stringify(object)
    this.setItem(USER_CONTEXT_IDENTIFIER, objectString);
  }

  /**
  * Load user context from local storage
  */
  get userContext(): UserContext {
    const objectString = this.getItem(USER_CONTEXT_IDENTIFIER);
    if (objectString) {
      const userContext = JSON.parse(objectString) as UserContext;
      return userContext
    } 
    return INITIAL_USER_CONTEXT
  }

  /**
  * Save userID to local storage
  * 
  * @param {UserIdentifikation} value  Token string to save
  */
  set userID(value: UserIdentifikation) {
    const objectString = JSON.stringify(value)
    this.setItem(USER_IDENTIFIKATION, objectString);
  }

  /**
  * Load userID from local storage
  */
   get userID(): UserIdentifikation {
    const objectString = this.getItem(USER_IDENTIFIKATION);
    if (objectString) {
      const userID = JSON.parse(objectString) as UserIdentifikation;
      return userID
    } 
    return INITIAL_USER_IDENTIFIKATION
  }  

  /**
  * Load disable open ape value from local storage
  */
  get disableLogin(): boolean {
    const disableOpenApeValue = this.getItem(DISABLE_LOGIN_IDENTIFIER);
    if(disableOpenApeValue) {
      return JSON.parse(disableOpenApeValue)
    }
    return true;
  }

  /**
  * Save disable open ape value to local storage
  * 
  * @param {boolean} value  Disable open ape value to save
  */
  set disableLogin(value: boolean) {
    this.setItem(DISABLE_LOGIN_IDENTIFIER, value + '');
  }

  constructor() { }

  /**
   * Use this function to clear the local storage, e.g. if the use logs out.
   */
  public clear(): void {
    localStorage.clear(); 
  }

  /**
   * Helper function to set item in local storage
   */
  private setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  /**
   * Helper function to get item in local storage
   */ 
  private getItem(key: string): string | null{ 
    return localStorage.getItem(key)
  }

  /**
   * Helper function to remove item in local storage
   */
  private removeItem(key:string): void {
    localStorage.removeItem(key);
  }
}

/**
 * Identifier key constants
 */
const USER_IDENTIFIKATION = 'wetterstation-user-identifikation';
const USER_CONTEXT_IDENTIFIER = 'wetterstation-user-context'
const DISABLE_LOGIN_IDENTIFIER = 'wetterstation-disable-login'