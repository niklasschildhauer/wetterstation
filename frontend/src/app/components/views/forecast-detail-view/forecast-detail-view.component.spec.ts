import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastDetailViewComponent } from './forecast-detail-view.component';

describe('ForecastDetailViewComponent', () => {
  let component: ForecastDetailViewComponent;
  let fixture: ComponentFixture<ForecastDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
