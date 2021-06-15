import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pollen-tag-element',
  templateUrl: './pollen-tag-element.component.html',
  styleUrls: ['./pollen-tag-element.component.scss']
})
export class PollenTagElementComponent implements OnInit {
  @Input()
  get value(): string{
    return this._value
  }
  set value(value: string) {
    this._value = value;
    switch(value) {
      case '1':
      case '1-2':
        this.textValue = "gering";
        this.emojiName = "almostDeath";
        this.colorValue = "yellow";
        break;
      case '2':
      case '2-3':
        this.textValue = "mittel";
        this.emojiName = "yield";
        this.colorValue = "orange";
        break;
      case '3': 
      case '3-4': 
      case '4': 
      case '5': 
        this.textValue = "hoch";
        this.emojiName = "death";
        this.colorValue = "red";
        break;
      default:
        this.textValue = "keine"; 
        this.emojiName = "angel";
        this.colorValue = "green";
    }
  }
  private _value: string = '0';
  public emojiName?: string;
  public textValue?: string;
  public colorValue?: string;

  constructor() { }

  ngOnInit(): void {
  }

}
