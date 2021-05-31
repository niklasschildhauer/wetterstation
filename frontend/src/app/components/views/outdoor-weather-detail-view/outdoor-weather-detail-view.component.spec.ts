import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutdoorWeatherDetailViewComponent } from './outdoor-weather-detail-view.component';

describe('OutdoorWeatherDetailViewComponent', () => {
  let component: OutdoorWeatherDetailViewComponent;
  let fixture: ComponentFixture<OutdoorWeatherDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OutdoorWeatherDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutdoorWeatherDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
