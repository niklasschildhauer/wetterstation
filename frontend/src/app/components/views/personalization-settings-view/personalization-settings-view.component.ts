import { Component, OnInit, Renderer2 } from '@angular/core';
import { UserContextService } from 'src/app/services/user-context.service';
import { Pollen, UserContext } from 'src/app/model/user-context';


@Component({
  selector: 'app-personalization-settings-view',
  templateUrl: './personalization-settings-view.component.html',
  styleUrls: ['./personalization-settings-view.component.scss']
})
export class PersonalizationSettingsViewComponent implements OnInit {
  desktop: boolean = false;
  userContextData?: UserContext;
  polle = false;
  

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

  setFontSize(value: number) {
    console.log(value);
    this.userContextService.fontSize = value;
    if(this.userContextData) {
      this.setDefaultFontSize(this.userContextData.fontSize);
    }
  }

  getPollenKeys() : Array<string> {
    var keys = Object.keys(Pollen);
    return keys.slice(keys.length / 2);
  }

  // FIXME: 
  // change the default font size
  // Maybe we can solve this problem in another way.
  private setDefaultFontSize(fontSize: number) {
    this.renderer.setStyle(document.body, "font-size", fontSize + "%");  
  }

}
