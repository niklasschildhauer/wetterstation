import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wetterstation';

  //Dummy - delete all below

  constructor(private http: HttpClient){

  }
  message: string = "";
  clickMe(): void{
    var schmurx : Observable<any> = this.http.post("http://localhost:4201/v1/auth/login", {"username":"admin", "password":"admin"});
    
    schmurx.subscribe((res) => {
      console.log(res);
      this.message = res["message"]
    })
  }
}
