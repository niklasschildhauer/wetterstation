import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserContextService } from 'src/app/services/user-context.service';
import { Pollen, Themes, UserContext } from 'src/app/model/user-context';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';



@Component({
  selector: 'app-personalization-settings-view',
  templateUrl: './personalization-settings-view.component.html',
  styleUrls: ['./personalization-settings-view.component.scss']
})
export class PersonalizationSettingsViewComponent implements OnInit {
  desktop: boolean = false;
  userContextData?: UserContext;

  pollenType = Pollen;
  themesType = Themes
  

  constructor(
    public userContextService: UserContextService,
    private renderer: Renderer2) { }

  ngOnInit(): void {
    this.getUserContext();
    this.userContextData?.pollen
  }

  getUserContext() {
    this.userContextService.getUserContext()
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
    let count = Object.keys(Pollen).length / 2;
    return new Array(count);
  }


  getPollenValueAt(index: number): boolean {
    let polle: Pollen = this.getPollenTypeAt(index) // FIXME: Heißt ich wirklich polle?
    let pollen = this.userContextService.pollen

    if(pollen && pollen.includes(polle)) {
      return true
    }
    return false;
  }

  getPollenStringAt(index: number): string {
    return Pollen[this.getPollenTypeAt(index)]
  }

  togglePollenValueAt(index: number) {
    let polle: Pollen = this.getPollenTypeAt(index)
    var pollen = this.userContextService.pollen  
    let oldValue = this.getPollenValueAt(index);  
    let newValue = !oldValue;

    if(pollen){
      if(newValue && !pollen.includes(polle)) {
        pollen.push(polle);
      }
      if(oldValue && pollen.includes(polle)) {
        pollen = pollen.filter(item => item != polle)
      }
      this.userContextService.pollen = pollen
    }
  }

  getPollenTypeAt(index: number): Pollen {
    let pollenString = Pollen[index]
    switch (pollenString) {
      case "Esche": return Pollen.Esche
      case "Ambrosia": return Pollen.Ambrosia
      case "Birke": return Pollen.Birke
      case "Beifuss": return Pollen.Beifuss
      case "Erle": return Pollen.Erle
      case "Roggen": return Pollen.Roggen
      case "Graeser": return Pollen.Graeser
      case "Hasel": return Pollen.Hasel
      default: return Pollen.Ambrosia
    }
  }

  // FIXME: 
  // change the default font size
  // Maybe we can solve this problem in another way.
  private setDefaultFontSize(fontSize: number) {
    this.renderer.setStyle(document.body, "font-size", fontSize + "%");  
  }

}
