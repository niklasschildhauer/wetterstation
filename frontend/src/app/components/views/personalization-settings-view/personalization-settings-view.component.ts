import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserContextService } from 'src/app/services/user-context.service';
import { Themes, UserContext, PollenType } from 'src/app/model/user-context';
import { Router } from '@angular/router';

/**
 * Personalization settings view component
 * 
 * This component displays all setting option for the 
 * personalization features of the web app.
 */
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
    this.loadUserContext();
    this.userContextService.refreshUserContextIfNeeded().subscribe((data => {
      if(!data) {
        this.router.navigateByUrl('/onboarding/login');
      }
    }));;
  }

  /**
   * Subscribes to the user context subject.
   */
  private loadUserContext() {
    this.userContextService.getUserContextSubject()
      .subscribe(data => this.userContextData = data)
  }

  /**
   * @param value the new font size value
   */
  setFontSize(value: number) {
    this.userContextService.fontSize = value;
    if(this.userContextData) {
      this.setDefaultFontSize(this.userContextData.fontSize);
    }
  }

  /**
   * @returns the number of themes 
   */
  numberOfThemes(): any[] {
    let count = Object.keys(Themes).length / 2;
    return new Array(count);
  }

  /**
   * @param index of the theme
   * @returns the theme of the asked index
   */
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

  /**
   * @param index of the theme
   * @returns the theme String 
   */
  getThemeStringAt(index: number): string {
    return Themes[this.getThemeTypeAt(index)]
  }

  /**
   * @returns the number of pollen 
   */
  numberOfPollen(): any[] {
    let count = this.userContextService.pollenTypes.length
    return new Array(count);
  }

  /**
   * @param index of the polle
   * @returns the value of the polle for the given index.
   */
  getPollenValueAt(index: number): boolean {
    return this.userContextService.getPollenValueAt(index);
  }

  /**
   * @param index of the pollen
   * @returns the pollen string of the given index
   */
  getPollenStringAt(index: number): string {
    return this.userContextService.pollenTypes[index].pollenName
  }

  /**
   * Toggles the pollen value at the given index.
   * 
   * @param index of the polle
   */
  togglePollenValueAt(index: number) {
    this.userContextService.tooglePollenValueAt(index);
  }

  /**
   * @returns false if the login to open ape is possible
   */
  loginDisabled(): boolean {
    return this.userContextService.disableLogin;
  }

  /**
   * Sets the base font size of the document.
   * 
   * @param fontSize
   */
  private setDefaultFontSize(fontSize: number) {
    this.renderer.setStyle(document.body, "font-size", fontSize + "%");  
  }

}
