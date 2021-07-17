import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Themes, UserContext } from 'src/app/model/user-context';
import { UserContextService } from 'src/app/services/user-context.service';

/**
 * Checkbox switcher element component
 * 
 * This component simply has the task of switching a function on and off. 
 * For this purpose, images are passed for the states on and off. 
 * If the value changes, an event is emitted.
 */
@Component({
  selector: 'app-checkbox-switcher-element',
  templateUrl: './checkbox-switcher-element.component.html',
  styleUrls: ['./checkbox-switcher-element.component.scss']
})
export class CheckboxSwitcherElementComponent implements OnInit {
  @Input() label?: string;
  @Input() value?: boolean;
  @Input() checkedImage?: string
  @Input() unCheckedImageLight?: string;
  @Input() unCheckedImageDark?: string;
  @Output() toggled = new EventEmitter<boolean>();
  private userContext?: UserContext
  private systemTheme = Themes.Light

  constructor(
    private userContextService: UserContextService,               
    private breakpointObserver: BreakpointObserver) { }

  ngOnInit(): void {
    this.loadUserContext();
    this.systemThemeBreakpointObserver();
  }

  /**
   * Toggles the checkbox and emits the new value
   * to the parent component
   */
  toggleCheckbox() {
    this.toggled.emit(!this.value);
  }

  /**
   * Subscribes to the user context data to determine
   * which theme is selected
   */
  private loadUserContext() {
    this.userContextService.getUserContextSubject().subscribe(data => this.userContext = data);
  }

  /**
   * Subscribes to the Media Query prefers-color-scheme 
   */
  private systemThemeBreakpointObserver() {
    this.breakpointObserver
    .observe(['(prefers-color-scheme: light)'])
    .subscribe((state: BreakpointState) => {
      if (state.matches) {
        this.systemTheme = Themes.Light;
      } else {
        this.systemTheme = Themes.Dark;
      }
    });
  }

  /**
   * @returns the image url of the unchecked image.
   */
  getUncheckedImageSrc(): string | undefined {
    let userContextTheme = this.userContext?.theme
    if(userContextTheme == Themes.Automatic) {
      if(this.systemTheme == Themes.Dark) {
        return this.unCheckedImageDark
      } else {
        return this.unCheckedImageLight
      }
    } 
    if(userContextTheme == Themes.Dark || userContextTheme == Themes.HighContrast ) {
      return this.unCheckedImageDark
    }
    return this.unCheckedImageLight
  }

  /**
   * @returns the image url of the checked image. 
   */
  getCheckedImageSrc(): string | undefined {
    let userContextTheme = this.userContext?.theme
    if(userContextTheme == Themes.HighContrast ) {
      if (this.checkedImage)
      return this.checkedImage + "-black"
    }
    return this.checkedImage 
  }
}
