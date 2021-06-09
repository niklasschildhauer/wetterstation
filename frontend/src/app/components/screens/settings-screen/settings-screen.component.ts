import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-screen',
  templateUrl: './settings-screen.component.html',
  styleUrls: ['./settings-screen.component.scss']
})
export class SettingsScreenComponent implements OnInit {
  desktop: boolean = false;

  constructor() { }

  ngOnInit(): void { 
  }
}
