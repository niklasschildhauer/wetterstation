import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryTileViewComponent } from './history-tile-view.component';

describe('HistoryTileViewComponent', () => {
  let component: HistoryTileViewComponent;
  let fixture: ComponentFixture<HistoryTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryTileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
