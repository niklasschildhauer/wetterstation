import { Injectable } from '@angular/core';
import { UserContext, Themes, INITIAL_USER_CONTEXT, PollenType, UserIdentifikation } from '../model/user-context';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { Router } from '@angular/router';
import { UserContextAPIService } from './api/user-context-api.service';

/**
 * User context service injectable
 * 
 * Use this service to access the user context object of the logged in user
 */
@Injectable({
  providedIn: 'root'
})
export class UserContextService {
  /**
  * The user Identifikation from the logged in user
  */
  set userID(value: UserIdentifikation) {
    this.localStorageService.userID = value
  }
  get userID(): UserIdentifikation {
    return this.localStorageService.userID
  }

  /**
  * Value if a user is logged in or not
  */
  get userLoggedIn(): boolean {
    return this.userID.token !== "" && this.userID.token !== undefined
  }

  /**
  * Value if the user has disabled the log in or not
  */
  set disableLogin(value: boolean) {
    this.localStorageService.disableLogin = value
  }
  get disableLogin(): boolean {
    return this.localStorageService.disableLogin
  }

  /**
  * Source of truth of the user context object.
  * The BehaviorSubject is accessible through the getUserContextSubject() function.
  * There are several setter functions to make the setting of a new value easier. 
  */
  private _userContext: BehaviorSubject<UserContext> = new BehaviorSubject<UserContext>(INITIAL_USER_CONTEXT); 
  set userContext(object: UserContext) {
    this._userContext.next(object);
    this.saveUserContext();
  }
  get userContext(): UserContext {
    return this._userContext.getValue();
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

  /**
  * This array contains all PollenTypes which are knwon from the backend. 
  */
  private _pollenTypes: BehaviorSubject<PollenType[]> = new BehaviorSubject<PollenType[]>([]); 
  set pollenTypes(value: PollenType[]) {
    this._pollenTypes.next(value);
  }
  get pollenTypes(): PollenType[] {
    return this._pollenTypes.value
  }

  constructor(private localStorageService: LocalStorageService,
              private router: Router,
              private userContextAPI: UserContextAPIService) { 
    this._userContext.next(this.localStorageService.userContext);
    this.loadPollenTypes()

  }
  
  /**
  * Calls the network to log a user in with username and password and returns success or an error message
  * 
  * @param {string} username    
  * @param {string} password  
  * @returns a promise with the success state and if failed an error message  
  */
  public login(username: string, password: string): Promise<{success: boolean, error: string}>  {  
    let promise = new Promise<{success: boolean, error: string}>((resolve) => {
      this.resetUserContext()
      let response = this.userContextAPI.postLogin(password, username)
      response.subscribe((data) => {
        this.userID = data.userID;
        this.userContext = data.userContext;
        this.disableLogin = false;
        resolve({success: true, error: ""})
      },
      (error) => {
        resolve({success: false, error: error})
      })
    });
    return promise
  }

  /**
  * Calls the network to register a user in with username and password and returns success or an error message
  * 
  * @param {string} username    
  * @param {string} password  
  * @returns a promise with the success state and if failed an error message  
  */
  public register(username: string, password: string): Promise<{success: boolean, error: string}> {
    let promise = new Promise<{success: boolean, error: string}>((resolve) => {
      this.resetUserContext();
      this.userContextAPI.postRegister(password, username).subscribe((success) => {
        if(success) {
          this.login(username, password).then(loginData => {
            resolve(loginData);
          })
        } else {
          resolve({success: success, error: 'Die Registrierung ist fehlgeschlagen'})
        }
      },
      (error) => {
        resolve({success: false, error: error})
      })
    });
    return promise
  }

  /**
  * Calls the network to load the user context from open ape. 
  * 
  * @param {string} username   username for openape 
  * @param {string} password   password for openape
  * @returns a promise with the success state and if failed an error message  
  */
  public loginToOpenApe(username: string, password: string): Promise<{success: boolean, error: string}> {
    let promise = new Promise<{success: boolean, error: string}>((resolve) => {
      this.userContextAPI.postLoginOpenAPE(username, password, this.userID).subscribe((userContextResponse) => {
        if(userContextResponse) {
          let userContext = this.userContext
          userContext.doVentilationReminder = userContextResponse.doVentilationReminder;
          userContext.fontSize = userContextResponse.fontSize;
          userContext.reduceMotion = userContextResponse.reduceMotion;
          userContext.selfVoicingEnabled = userContextResponse.selfVoicingEnabled;
          userContext.theme = userContextResponse.theme;

          this.userContext = userContext;
          resolve({success: true, error: ""})
        } else {
          resolve({success:  false, error: 'Ein Fehler ist aufgetreten, beim Einloggen zu OpenAPE.'})
        }
      },
      (error) => {
        resolve({success: false, error: error})
      })
    });
    return promise
  }

  /**
  * Calls the network to post the user context to open ape. 
  * 
  * @param {string} username   username for openape 
  * @param {string} password   password for openape
  * @returns a promise with the success state and if failed an error message  
  */
    public postToOpenApe(username: string, password: string): Promise<{success: boolean, error: string}> {
      let promise = new Promise<{success: boolean, error: string}>((resolve) => {
        this.userContextAPI.postContextToOpenAPE(username, password, this.userID).subscribe((result) => { 
          if (result) {
            resolve({success: true, error: ""})
          } else {
            resolve({success: true, error: "There went something wrong"})
          }
        },
        (error) => {
          resolve({success: false, error: error})
        })
      });
      return promise
    }

  /**
  * Function to toggle the pollen value at index. This function also checks
  * if the pollen values are safed in the backend or in the frontend. 
  * 
  * @param {number} index  index of the pollen type
  */
  public tooglePollenValueAt(index: number): void {
    let polle: PollenType = this.pollenTypes[index]
    let oldValue = this.getPollenValueAt(index);  
    let newValue = !oldValue;

    if(this.pollen){
      if(this.disableLogin){
        if(newValue && !this.pollen.includes(polle.pollenName)) {
          let pollen = this.pollen;
          pollen.push(polle.pollenName);
          this.pollen = pollen;
        }
        if(oldValue && this.pollen.includes(polle.pollenName)) {
          this.pollen = this.pollen.filter(item => item != polle.pollenName)
        }
      } else {
        if(newValue && !this.pollen.includes(polle.pollenName)) {
          this.userContextAPI.postPolleToUserContext(this.userID, polle.id).subscribe(() => {
            this.refreshUserContextIfNeeded().subscribe();
          });
        }
        if(oldValue && this.pollen.includes(polle.pollenName)) {
          this.userContextAPI.deletePolleFromUserContext(this.userID, polle.id).subscribe(()=> {
            this.refreshUserContextIfNeeded().subscribe();
          });
        }
      }
    }
  }

  /**
  * Returns a boolean if the user is allergic against the requested polle or not
  * 
  * @param {number} index  index of the pollen type
  */
  public getPollenValueAt(index: number): boolean {
    let polle: PollenType = this.pollenTypes[index]

    if(this.pollen && this.pollen.includes(polle.pollenName)) {
      return true
    }
    return false;
  }

  /**
  * Logs the user out and resets the user context. 
  */
  public logout() {
    this.resetUserContext();
    this.showLoginScreen();
  }

  /**
  * Checks if the user is logged in or not. If an user is logged in it checks if the token
  * is valid or not. If the token is not valid it returns false. If the token is valid
  * it refreshs the user context 
  * 
  * @returns an obervable with a boolean if the request was successful or not. If it returns false
  * then is the token not valid and the user needs to log in again
  */
  public refreshUserContextIfNeeded(): Observable<boolean> {
    let returnObservable = new Observable<boolean>((observer) => {
      if(this.disableLogin || this.userID.token === '') {
        observer.next(true);
        observer.complete(); 
      }
      this.userContextAPI.postIsTokenValid(this.userID.token).subscribe((data) => {
        if(data) {
          this.userContextAPI.loadUserContext(this.userID.token).subscribe(data => {
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

  /**
  * @returns the behavior subject of the user context object
  */  
  public getUserContextSubject(): BehaviorSubject<UserContext> {
    return this._userContext;
  }

  /**
   * Helpfer function to forward the user to the login page
   */
  private showLoginScreen() {
    this.router.navigateByUrl('/onboarding/login');
  }

  /**
   * Helper function to reset the user context and clears the local storage
   */
  private resetUserContext() {
    this.localStorageService.clear();
    this._userContext.next(this.localStorageService.userContext);
  }

  /**
   * Helper function to save the user context. It saves the user context to the local storage
   * and if needed in the backend.
   */
  private saveUserContext() {
    this.saveUserContextToLocalStorage()
    if(!this.disableLogin) {
      this.userContextAPI.putSaveUserContext(this.userID, this.userContext).subscribe();
    }
  }

  /**
   * Helper function to save the user context to the local storage
   */
  private saveUserContextToLocalStorage() {
    this.localStorageService.userContext = this._userContext.getValue();
  }

  /**
   * Helper function to load the pollen types from the backend.
   */
  private loadPollenTypes() {
    this.userContextAPI.loadPollenTypes().subscribe((data) => {
      this.pollenTypes = data;
    });
  }
}


