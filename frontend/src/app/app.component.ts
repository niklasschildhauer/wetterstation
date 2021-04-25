import { Component, Renderer2, OnInit } from '@angular/core';
import { UserContextService } from './services/user-context.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'wetterstation';

  constructor(private renderer: Renderer2,
              private userContextService: UserContextService) { }

  ngOnInit(): void {
    this.loadDefaultFontSize();
  }

  private loadDefaultFontSize() {
    this.userContextService.getFontSize()
    .subscribe(fontSize => {
      this.setDefaultFontSize(fontSize);
      });
  }

  private setDefaultFontSize(fontSize: number) {
    this.renderer.setStyle(document.body, "font-size", fontSize + "%");
  }

  bigFontSize() {
    this.userContextService.setFontSize(200);
    this.loadDefaultFontSize();
  }
  smallFontSize() {
    this.userContextService.setFontSize(62.5);
    this.loadDefaultFontSize();
  }
  normalFontSize() {
    this.userContextService.setFontSize(100);
    this.loadDefaultFontSize();
  }

  

}
