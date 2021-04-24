import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-back-button-element',
  templateUrl: './back-button-element.component.html',
  styleUrls: ['./back-button-element.component.scss']
})
export class BackButtonElementComponent implements OnInit {

  constructor(private location: Location) { }

  ngOnInit(): void {
  }

  goBack(): void {
    this.location.back();
  }


}
