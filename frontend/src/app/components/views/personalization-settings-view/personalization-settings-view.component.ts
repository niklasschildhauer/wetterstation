import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserContextService } from 'src/app/services/user-context.service';
import { Themes, UserContext, PollenType } from 'src/app/model/user-context';
import { Router } from '@angular/router';



@Component({
  selector: 'app-personalization-settings-view',
  templateUrl: './personalization-settings-view.component.html',
  styleUrls: ['./personalization-settings-view.component.scss']
})
export class PersonalizationSettingsViewComponent implements OnInit {
  desktop: boolean = false;
  userContextData?: UserContext;
  themesType = Themes  

  constructor(
    public userContextService: UserContextService,
    private renderer: Renderer2,
    private router: Router) { }
    
  ngOnInit(): void {
    this.getUserContext();
    this.userContextService.refreshUserContextIfNeeded().subscribe((data => {
      if(!data) {
        this.router.navigateByUrl('/onboarding/login');
      }
    }));;
  }

  getUserContext() {
    this.userContextService.getUserContextSubject()
      .subscribe(data => this.userContextData = data)
  }

  setFontSize(value: number) {
    this.userContextService.fontSize = value;
    if(this.userContextData) {
      this.setDefaultFontSize(this.userContextData.fontSize);
    }
  }

  numberOfThemes(): any[] {
    let count = Object.keys(Themes).length / 2;
    return new Array(count);
  }

  getThemeTypeAt(index: number): Themes {
    let themesString = Themes[index];
    switch (themesString) {
      case "Dark": return Themes.Dark
      case "Light": return Themes.Light
      case "Automatic": return Themes.Automatic
      case "HighContrast": return Themes.HighContrast
      default: return Themes.Automatic
    }
  }

  getThemeStringAt(index: number): string {
    return Themes[this.getThemeTypeAt(index)]
  }

  numberOfPollen(): any[] {
    let count = this.userContextService.pollenTypes.length
    return new Array(count);
  }

  getPollenValueAt(index: number): boolean {
    return this.userContextService.getPollenValueAt(index);
  }

  getPollenStringAt(index: number): string {
    return this.userContextService.pollenTypes[index].pollenName
  }

  togglePollenValueAt(index: number) {
    this.userContextService.tooglePollenValueAt(index);
  }

  loginDisabled(): boolean {
    return this.userContextService.disableLogin;
  }

  // FIXME: 
  // change the default font size
  // Maybe we can solve this problem in another way.
  private setDefaultFontSize(fontSize: number) {
    this.renderer.setStyle(document.body, "font-size", fontSize + "%");  
  }

}
