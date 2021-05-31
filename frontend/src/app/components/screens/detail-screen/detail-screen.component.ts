import { Component, OnInit } from '@angular/core';

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
