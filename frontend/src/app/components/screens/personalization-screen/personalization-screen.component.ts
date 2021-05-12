import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';


@Component({
  selector: 'app-personalization-screen',
  templateUrl: './personalization-screen.component.html',
  styleUrls: ['./personalization-screen.component.scss']
})
export class PersonalizationScreenComponent implements OnInit {
  desktop: boolean = false;

  constructor(private breakpointObserver: BreakpointObserver) { }

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
  }
}
