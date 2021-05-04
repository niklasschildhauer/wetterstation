import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { UserContextService } from 'src/app/services/user-context.service';
import { UserContext } from 'src/app/model/user-context';


@Component({
  selector: 'app-personalization-screen',
  templateUrl: './personalization-screen.component.html',
  styleUrls: ['./personalization-screen.component.scss']
})
export class PersonalizationScreenComponent implements OnInit {
  desktop: boolean = false;
  userContextData?: UserContext;

  constructor(private breakpointObserver: BreakpointObserver,
      private userContextService: UserContextService) { }

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

  toggledMotion(value: boolean) {
    this.userContextService.setMotionPreference(value)
  }

}
