import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pollen-list-element',
  templateUrl: './pollen-list-element.component.html',
  styleUrls: ['./pollen-list-element.component.scss']
})
export class PollenListElementComponent implements OnInit {
  @Input() title?: string;
  @Input()
  get value(): number{
    return this._value
  }
  set value(value: number) {
    this._value = value;
    switch(value) {
      case 1:
        this.textValue = "leicht";
        this.emojiName = "everythingFine";
        this.colorValue = "green";
        break;
      case 2:
        this.textValue = "mittel";
        this.emojiName = "yield";
        this.colorValue = "orange";
        break;
      case 3: 
        this.textValue = "schwer";
        this.emojiName = "almostDeath";
        this.colorValue = "red";
        break;
      default:
        this.textValue = "n/a";
        this.emojiName = "death";
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
