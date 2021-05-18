import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OutdoorWeatherData } from 'src/app/model/weather';
import { TileService } from 'src/app/services/tile.service';
import { UserContextService } from 'src/app/services/user-context.service';

@Component({
  selector: 'app-menu-bar-element',
  templateUrl: './menu-bar-element.component.html',
  styleUrls: ['./menu-bar-element.component.scss']
})
export class MenuBarElementComponent implements OnInit {
  locationLabel?: string;
  outdoorWeatherData?: OutdoorWeatherData
  reduceMotion: boolean = false; // We need this value, because the menu bar changes the font color, based on it

  constructor(private tileService: TileService,
    private userContextService: UserContextService,
    private router: Router) { }

  ngOnInit(): void {
    this.getLocation();
    this.loadReduceMotionValue();
  }

  loadReduceMotionValue() {
    this.userContextService.getUserContext()
    .subscribe(data => {
      let reduceMotionValue = data.reduceMotion;
      this.reduceMotion = reduceMotionValue
    });
  }

  getLocation(): void {
    this.tileService.getOutdoorWeatherData()
                        .subscribe(data => {
                          this.outdoorWeatherData = data
                        });
  }

  reloadData() {
    this.tileService.reloadData();
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
}
