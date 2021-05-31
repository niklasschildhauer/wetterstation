import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApparentTemperatureTileViewComponent } from './apparent-temperature-tile-view.component';

describe('ApparentTemperatureTileViewComponent', () => {
  let component: ApparentTemperatureTileViewComponent;
  let fixture: ComponentFixture<ApparentTemperatureTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApparentTemperatureTileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApparentTemperatureTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
