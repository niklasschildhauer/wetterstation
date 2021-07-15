import { Component, OnInit, Input } from '@angular/core';

/**
 * Nav bar element component
 * 
 * Consists of heading and back label. It uses the 
 * back button element.  
 */
@Component({
  selector: 'app-nav-bar-element',
  templateUrl: './nav-bar-element.component.html',
  styleUrls: ['./nav-bar-element.component.scss']
})
export class NavBarElementComponent implements OnInit {
  @Input() titleLabel?: string;
  @Input() backLabel?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
