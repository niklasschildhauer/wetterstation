import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-button-element',
  templateUrl: './menu-button-element.component.html',
  styleUrls: ['./menu-button-element.component.scss']
})
export class MenuButtonElementComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openMenu(): void {
    console.log("Pressed open menu");
  }

}
