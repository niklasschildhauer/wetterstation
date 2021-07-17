import { Component, OnInit } from '@angular/core';
import { UserContextService } from 'src/app/services/user-context.service';

/**
 * Menu button element component
 * 
 * This component is the top left menu button in the dashboard 
 * screen. It opens and closes the menu element.
 */
@Component({
  selector: 'app-menu-button-element',
  templateUrl: './menu-button-element.component.html',
  styleUrls: ['./menu-button-element.component.scss']
})
export class MenuButtonElementComponent implements OnInit {
  reduceMotion: boolean = false; // We need this value, because the menu bar changes the font color, based on it
  isMenuHidden: boolean = true;

  constructor(private userContextService: UserContextService) { }

  ngOnInit(): void {
    this.loadReduceMotionValue();
  }

  /**
   * Subscribes to the reduce motion value
   */
  loadReduceMotionValue() {
    this.userContextService.getUserContextSubject()
    .subscribe(data => {
      let reduceMotionValue = data.reduceMotion;
      this.reduceMotion = reduceMotionValue
    });
  }

  /**
   * Turns the background blur on
   */
  openMenu(): void {
    this.isMenuHidden = false;
  }

  /**
   * Turns the background blur off
   */
  closeMenu(): void {
    this.isMenuHidden = true;
  }
}
