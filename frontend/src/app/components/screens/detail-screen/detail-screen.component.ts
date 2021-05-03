import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { trigger, transition, animate, style } from '@angular/animations'

@Component({
  selector: 'app-detail-screen',
  templateUrl: './detail-screen.component.html',
  styleUrls: ['./detail-screen.component.scss'],
  animations: [
    trigger("enterAnimation", [
      transition(":enter", [
        style({ transform: "translateY(-100%)" }),
        animate("500ms ease-in", style({ transform: "translateY(0)" })),
      ]),
      transition(":leave", [
        style({ transform: "translateY(0)", opacity: 1 }),
        animate("500ms", style({ transform: "translateY(-100%)" })),
      ]),
    ]),
  ]
})
export class DetailScreenComponent implements OnInit {
  public desktop: boolean = false;

  constructor(public breakpointObserver: BreakpointObserver) { }

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
