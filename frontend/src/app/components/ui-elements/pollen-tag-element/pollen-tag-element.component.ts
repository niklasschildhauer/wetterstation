import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pollen-tag-element',
  templateUrl: './pollen-tag-element.component.html',
  styleUrls: ['./pollen-tag-element.component.scss']
})
export class PollenTagElementComponent implements OnInit {
  @Input()
  get value(): number{
    return this._value
  }
  set value(value: number) {
    this._value = value;
    switch(value) {
      case 1:
        this.textValue = "leicht";
        this.emojiName = "almostDeath";
        this.colorValue = "green";
        break;
      case 2:
        this.textValue = "mittel";
        this.emojiName = "yield";
        this.colorValue = "orange";
        break;
      case 3: 
        this.textValue = "schwer";
        this.emojiName = "death";
        this.colorValue = "red";
        break;
      default:
        this.textValue = "nix"; //FIXME: Finde einen namen
        this.emojiName = "angel";
        this.colorValue = "blue";
    }
  }
  private _value: number = 0;
  public emojiName?: string;
  public textValue?: string;
  public colorValue?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
