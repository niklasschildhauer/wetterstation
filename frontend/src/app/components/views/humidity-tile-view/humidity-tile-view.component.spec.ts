import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumidityTileViewComponent } from './humidity-tile-view.component';

describe('HumidityTileViewComponent', () => {
  let component: HumidityTileViewComponent;
  let fixture: ComponentFixture<HumidityTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HumidityTileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HumidityTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
