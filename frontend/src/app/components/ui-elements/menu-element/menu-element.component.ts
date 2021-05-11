import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  // @Input() closeFunction?: () => void;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  closeMenu(): void {
    this.closeEvent.emit();
  }

  openPersonalizationSettings() {
    this.router.navigateByUrl('/personalization');
  }

  logout(): void {
    this.router.navigateByUrl('/login'); //FIXME
    console.log("Logout pressed")
  }
}
