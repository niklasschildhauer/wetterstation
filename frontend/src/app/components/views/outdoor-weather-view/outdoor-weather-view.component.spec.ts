import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutdoorWeatherViewComponent } from './outdoor-weather-view.component';

describe('OutdoorWeatherViewComponent', () => {
  let component: OutdoorWeatherViewComponent;
  let fixture: ComponentFixture<OutdoorWeatherViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutdoorWeatherViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorWeatherViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
