import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-personalization-view',
  templateUrl: './personalization-view.component.html',
  styleUrls: ['./personalization-view.component.scss']
})
export class PersonalizationViewComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onClickDone() {
    this.router.navigateByUrl('/dashboard');
  }

}
