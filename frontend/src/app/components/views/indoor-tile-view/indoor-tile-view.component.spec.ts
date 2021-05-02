import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndoorTileViewComponent } from './indoor-tile-view.component';

describe('IndoorTileViewComponent', () => {
  let component: IndoorTileViewComponent;
  let fixture: ComponentFixture<IndoorTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndoorTileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndoorTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
