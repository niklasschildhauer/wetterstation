import { Component, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserContextService } from './services/user-context.service';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { routeTransitionAnimations } from './route-transition-animation';
import { Themes, UserContext } from './model/user-context';
import { Router } from '@angular/router';
import { BreakpointObserver, BreakpointState} from '@angular/cdk/layout';

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
  desktop: boolean = false;

  constructor(private renderer: Renderer2,
              private userContextService: UserContextService,
              private http: HttpClient,
              private breakpointObserver: BreakpointObserver,
              private router: Router) { }

  ngOnInit(): void {
    this.loadDefaultFontSize();
    this.loadUserContext();
    this.listenToThemeChange();  
    this.desktopBreakpointObserver();
  }


  ngOnChanges(): void {
    this.loadDefaultFontSize() // Brauchen wir das?
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animationState'];
  }

  clickedOutdoorWeatherView() {
    this.router.navigateByUrl('/dashboard'); //FIXME: Zu detail screen wenn schon in Dashboard ansicht
  }

  private desktopBreakpointObserver() {
    this.breakpointObserver
    .observe(['(min-width: 770px)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.desktop = true;
      } else {
        this.desktop = false;
      }
    });
  }

  private loadDefaultFontSize() {
    this.userContextService.getUserContextSubject()
    .subscribe(data => {
      let fontSize = data.fontSize
      this.setDefaultFontSize(fontSize);
      });
  }

  private loadUserContext() {
    this.userContextService.getUserContextSubject()
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
