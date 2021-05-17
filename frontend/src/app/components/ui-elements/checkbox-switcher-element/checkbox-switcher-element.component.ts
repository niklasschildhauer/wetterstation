import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Themes, UserContext } from 'src/app/model/user-context';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-checkbox-switcher-element',
  templateUrl: './checkbox-switcher-element.component.html',
  styleUrls: ['./checkbox-switcher-element.component.scss']
})
export class CheckboxSwitcherElementComponent implements OnInit {
  @Input() label?: string;
  @Input() value?: boolean;
  @Input() checkedImage?: string = "microphone"
  @Input() unCheckedImageLight?: string = "reduce-motion-unchecked-light";
  @Input() unCheckedImageDark?: string = "reduce-motion-unchecked-dark";
  @Output() toggled = new EventEmitter<boolean>();
  private userContext?: UserContext
  private systemTheme = Themes.Light

  constructor(private userContextService: UserContextService,               
    private breakpointObserver: BreakpointObserver,
    ) { }

  ngOnInit(): void {
    this.loadUserContext();
    this.systemThemeBreakpointObserver();
  }

  toggleCheckbox() {
    this.toggled.emit(!this.value);
  }
  private loadUserContext() {
    this.userContextService.getUserContext().subscribe(data => this.userContext = data);
  }

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

  getUncheckedImageSrc(): string | undefined {
    let userContextTheme = this.userContext?.theme
    if(userContextTheme == Themes.Automatic) {
      if(this.systemTheme == Themes.Dark) {
        return this.unCheckedImageDark
      } else {
        return this.unCheckedImageLight
      }
    } 
    if(userContextTheme == Themes.Dark) {
      return this.unCheckedImageDark
    }
    return this.unCheckedImageLight

  }


}
