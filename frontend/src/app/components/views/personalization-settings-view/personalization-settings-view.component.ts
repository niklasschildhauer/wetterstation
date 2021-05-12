import { Component, OnInit, Renderer2 } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { UserContextService } from 'src/app/services/user-context.service';
import { UserContext } from 'src/app/model/user-context';

@Component({
  selector: 'app-personalization-settings-view',
  templateUrl: './personalization-settings-view.component.html',
  styleUrls: ['./personalization-settings-view.component.scss']
})
export class PersonalizationSettingsViewComponent implements OnInit {
  desktop: boolean = false;
  userContextData?: UserContext;

  constructor(private breakpointObserver: BreakpointObserver,
      public userContextService: UserContextService,
      private renderer: Renderer2) { }

  ngOnInit(): void {
    this.breakpointObserver
      .observe(['(min-width: 770px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.desktop = true;
        } else {
          this.desktop = false;
        }
    });
    this.getUserContext();
  }

  getUserContext() {
    this.userContextService.getUserContext()
    .subscribe(data => this.userContextData = data)
  }

  setFontSize(value: number) {
    console.log(value);
    this.userContextService.setFontSizePreference(value);
    if(this.userContextData) {
      this.setDefaultFontSize(this.userContextData.fontSize);
    }
  }

  // FIXME: 
  // change the default font size
  // Maybe we can solve this problem in another way.
  private setDefaultFontSize(fontSize: number) {
    this.renderer.setStyle(document.body, "font-size", fontSize + "%");  
  }

}
