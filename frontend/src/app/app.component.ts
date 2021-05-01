import { Component, Renderer2, OnInit } from '@angular/core';
import { UserContextService } from './services/user-context.service';
import { SpeechAPIService } from './services/speech-api.service';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wetterstation';

  constructor(private renderer: Renderer2,
              private userContextService: UserContextService,
              private http: HttpClient,
              private speechAPI: SpeechAPIService) { }

  ngOnInit(): void {
    this.loadDefaultFontSize();
  }

  private loadDefaultFontSize() {
    this.userContextService.getFontSize()
    .subscribe(fontSize => {
      this.setDefaultFontSize(fontSize);
      });
  }

  private setDefaultFontSize(fontSize: number) {
    this.renderer.setStyle(document.body, "font-size", fontSize + "%");
  }

  bigFontSize() {
    this.userContextService.setFontSize(150);
    this.loadDefaultFontSize();

    this.speechAPI.startOutput();
  }
  smallFontSize() {
    this.userContextService.setFontSize(62.5);
    this.loadDefaultFontSize();
  }
  normalFontSize() {
    this.userContextService.setFontSize(100);
    this.loadDefaultFontSize();
  }

  
  //Dummy - delete all below
  
  message: string = "";
  clickMe(): void{
    var schmurx : Observable<any> = this.http.post("http://localhost:4201/v1/auth/login", {"username":"admin", "password":"admin"});
    
    schmurx.subscribe((res) => {
      console.log(res);
      this.message = res["message"]
    })
  }
}
