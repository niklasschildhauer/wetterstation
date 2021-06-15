import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ImageService } from 'src/app/services/image.service';
import { ImageModel } from 'src/app/model/image';

@Component({
  selector: 'app-back-button-element',
  templateUrl: './back-button-element.component.html',
  styleUrls: ['./back-button-element.component.scss']
})
export class BackButtonElementComponent implements OnInit {
  @Input() label?: string;
  backIconModel: ImageModel = {
    light: "back-button.svg",
    dark: "back-button.svg",
  }
  constructor(private location: Location,
    public imageService: ImageService) { }

  ngOnInit(): void {
  }

  goBack(): void {
    this.location.back();
  }

}
