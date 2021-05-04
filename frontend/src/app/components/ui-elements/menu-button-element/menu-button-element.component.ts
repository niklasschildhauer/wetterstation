import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Remove when it's not needed anymore


@Component({
  selector: 'app-menu-button-element',
  templateUrl: './menu-button-element.component.html',
  styleUrls: ['./menu-button-element.component.scss']
})
export class MenuButtonElementComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  openMenu(): void {
    console.log("Pressed open menu");
    this.router.navigateByUrl('/personalization');
  }

}
