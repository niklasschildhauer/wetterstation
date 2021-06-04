import { Component, DoCheck, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { UserContextService } from 'src/app/services/user-context.service';
import { Themes, UserContext, PollenType } from 'src/app/model/user-context';



@Component({
  selector: 'app-personalization-settings-view',
  templateUrl: './personalization-settings-view.component.html',
  styleUrls: ['./personalization-settings-view.component.scss']
})
export class PersonalizationSettingsViewComponent implements OnInit, OnDestroy {
  desktop: boolean = false;
  userContextData?: UserContext;

  themesType = Themes  

  constructor(
    public userContextService: UserContextService,
    private renderer: Renderer2) { }
    
  ngOnDestroy(): void {
    this.userContextService.checkToken();
  }

  ngOnInit(): void {
    this.getUserContext();
    this.userContextService.checkToken();
  }

  getUserContext() {
    this.userContextService.getUserContextSubject()
    .subscribe(data => this.userContextData = data)
  }

  changedValue(event: any) {
    console.log(event.target.value)
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
    let polle: PollenType = this.userContextService.pollenTypes[index] // FIXME: Heißt ich wirklich polle?
    let pollen = this.userContextService.pollen

    if(pollen && pollen.includes(polle.pollenName)) {
      return true
    }
    return false;
  }

  getPollenStringAt(index: number): string {
    return this.userContextService.pollenTypes[index].pollenName
  }

  togglePollenValueAt(index: number) {
    let polle: PollenType = this.userContextService.pollenTypes[index]
    var pollen = this.userContextService.pollen  
    let oldValue = this.getPollenValueAt(index);  
    let newValue = !oldValue;

    if(pollen){
      if(newValue && !pollen.includes(polle.pollenName)) {
        pollen.push(polle.pollenName);
      }
      if(oldValue && pollen.includes(polle.pollenName)) {
        pollen = pollen.filter(item => item != polle.pollenName)
      }
      this.userContextService.pollen = pollen
    }
  }

  // FIXME: 
  // change the default font size
  // Maybe we can solve this problem in another way.
  private setDefaultFontSize(fontSize: number) {
    this.renderer.setStyle(document.body, "font-size", fontSize + "%");  
  }

}
