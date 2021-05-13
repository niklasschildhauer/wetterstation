import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserContextService } from './services/user-context.service';
import { SpeechAPIService } from './services/speech-api.service';
import { HttpClient } from "@angular/common/http";
import { Observable, VirtualTimeScheduler } from 'rxjs';
import { routeTransitionAnimations } from './route-transition-animation';
import { DOCUMENT } from '@angular/common';
import { Themes, UserContext } from './model/user-context';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [routeTransitionAnimations],
})
export class AppComponent {
  title = 'wetterstation';
  userContext?: UserContext
  ThemeType = Themes;

  constructor(private renderer: Renderer2,
              private userContextService: UserContextService,
              private http: HttpClient,
              private speechAPI: SpeechAPIService) { }

  ngOnInit(): void {
    this.loadDefaultFontSize();
    this.loadUserContext();
    this.listenToThemeChange();
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animationState'];
  }

  private loadDefaultFontSize() {
    this.userContextService.getUserContext()
    .subscribe(data => {
      let fontSize = data.fontSize
      this.setDefaultFontSize(fontSize);
      });
  }

  private loadUserContext() {
    this.userContextService.getUserContext()
    .subscribe(data => this.userContext = data);
  }

  private setDefaultFontSize(fontSize: number) {
    this.renderer.setStyle(document.body, "font-size", fontSize + "%");  
  }

  private listenToThemeChange(){
    const query1 = window.matchMedia("(prefers-color-scheme: dark)")
    const query2 = window.matchMedia("(prefers-color-scheme: ligth)")

    query1.addEventListener( "change", (e) => {
      window.location.reload();
    });
    query2.addEventListener( "change", (e) => {
      window.location.reload();
    });

    // FIXME: Bug wenn von Explizit Dark Mode auf Autoatic Mode switch -> Reload needed!
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
