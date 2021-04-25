import { Injectable } from '@angular/core';
import { UserContext } from '../model/user-context';
import { Observable, of } from 'rxjs';
import { USERCONTEXT } from '../model/mock-data/user-context.mock';


@Injectable({
  providedIn: 'root'
})
export class UserContextService {

  constructor() { }

  getFontSize(): Observable<number> {
    const fontSize = of(USERCONTEXT.fontSize);
    console.log(" font");

    return fontSize;
  }

  setFontSize(fontSize: number) {
    console.log("increase font");
    USERCONTEXT.fontSize = fontSize;
  }

}
