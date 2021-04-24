import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollenflugTileViewComponent } from './pollenflug-tile-view.component';

describe('PollenflugTileViewComponent', () => {
  let component: PollenflugTileViewComponent;
  let fixture: ComponentFixture<PollenflugTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollenflugTileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollenflugTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
