import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-personalization-screen',
  templateUrl: './personalization-screen.component.html',
  styleUrls: ['./personalization-screen.component.scss']
})
export class PersonalizationScreenComponent implements OnInit {
  desktop: boolean = false;

  constructor() { }

  ngOnInit(): void { 
  }
}
