import { Component, OnInit } from '@angular/core';

/**
 * Detail screen component 
 * 
 * Wrapper component to display the detail screens.
 */
@Component({
  selector: 'app-detail-screen',
  templateUrl: './detail-screen.component.html',
  styleUrls: ['./detail-screen.component.scss'],
})
export class DetailScreenComponent implements OnInit {
  public desktop: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
