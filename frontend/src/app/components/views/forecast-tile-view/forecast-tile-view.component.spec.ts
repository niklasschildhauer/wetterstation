import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForecastTileViewComponent } from './forecast-tile-view.component';

describe('ForecastTileViewComponent', () => {
  let component: ForecastTileViewComponent;
  let fixture: ComponentFixture<ForecastTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForecastTileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForecastTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
