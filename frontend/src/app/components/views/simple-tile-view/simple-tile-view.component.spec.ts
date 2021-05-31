import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleTileViewComponent } from './simple-tile-view.component';

describe('SimpleTileViewComponent', () => {
  let component: SimpleTileViewComponent;
  let fixture: ComponentFixture<SimpleTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleTileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
