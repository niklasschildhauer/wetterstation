import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, animate, transition } from '@angular/animations';
import { UserContextService } from 'src/app/services/user-context.service';
import { ImageService } from 'src/app/services/image.service';
import { ImageModel } from 'src/app/model/image';

/**
 * Menu element component 
 * 
 * This component displays three list entries. These are the 
 * menu options. It is displayed when the users presses the 
 * menu button
 */
@Component({
  selector: 'app-menu-element',
  templateUrl: './menu-element.component.html',
  styleUrls: ['./menu-element.component.scss'],
  animations: [
    trigger(
      'animate', 
      [
        transition(
          ':enter', 
          [
            style({ opacity: 0 }),
            animate('0.3s ease-out', 
                    style({ opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ opacity: 1 }),
            animate('0.3s ease-in', 
                    style({ opacity: 0 }))
          ]
        )
      ]
    )
  ]
})

export class MenuElementComponent implements OnInit {
  @Output() closeEvent = new EventEmitter();
  public configurationIcon: ImageModel = {
    light: "setting-button-light.png",
    dark: "setting-button-dark.png",
    highContrast: "setting-button-high.png"
  }
  public settingsIcon: ImageModel = {
    light: "pers-button-light.png",
    dark: "pers-button-dark.png",
    highContrast: "pers-button-high.png"
  }
  public logoutIcon: ImageModel = {
    light: "logout-button-light.png",
    dark: "logout-button-dark.png",
    highContrast: "logout-button-high.png"
  }

  get userLoggedIn(): boolean {
    console.log("User eingeloggt: ", this.userContextService.userLoggedIn);

    return this.userContextService.userLoggedIn;
  }

  constructor(private router: Router,
    private userContextService: UserContextService,
    public imageService: ImageService) { }

  ngOnInit(): void { }

  /**
   * Closes the menu 
   */
  closeMenu(): void {
    this.closeEvent.emit();
  }

  /**
   * Redirects to the personalization screen
   */
  openPersonalizationSettings() {
    this.router.navigateByUrl('/settings/personalization');
  }

  /**
   * Redirects to the configuration screen
   */
  openConfigurationSettings() {
    this.router.navigateByUrl('/settings/configuration');
  }

  /**
   * Uses the user context service to logs the user out.
   */
  logout(): void {
    this.userContextService.logout();
  }
}
