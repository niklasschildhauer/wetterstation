import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollenflugSmallTileComponent } from './pollenflug-small-tile.component';

describe('PollenflugSmallTileComponent', () => {
  let component: PollenflugSmallTileComponent;
  let fixture: ComponentFixture<PollenflugSmallTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollenflugSmallTileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollenflugSmallTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
