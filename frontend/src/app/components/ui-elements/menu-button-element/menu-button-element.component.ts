import { Component, OnInit } from '@angular/core';
import { UserContextService } from 'src/app/services/user-context.service';


@Component({
  selector: 'app-menu-button-element',
  templateUrl: './menu-button-element.component.html',
  styleUrls: ['./menu-button-element.component.scss']
})
export class MenuButtonElementComponent implements OnInit {
  reduceMotion: boolean = false; // We need this value, because the menu bar changes the font color, based on it
  isMenuHidden: boolean = true;

  constructor(private userContextService: UserContextService) { }

  ngOnInit(): void {
    this.loadReduceMotionValue();
  }

  loadReduceMotionValue() {
    this.userContextService.getUserContext()
    .subscribe(data => {
      let reduceMotionValue = data.reduceMotion;
      this.reduceMotion = reduceMotionValue
    });
  }

  openMenu(): void {
    this.isMenuHidden = false;
    console.log("open")
  }

  closeMenu(): void {
    this.isMenuHidden = true;
    console.log("wird ausgeführt")
  }

}
