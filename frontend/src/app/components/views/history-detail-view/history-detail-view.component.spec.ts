import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDetailViewComponent } from './history-detail-view.component';

describe('HistoryDetailViewComponent', () => {
  let component: HistoryDetailViewComponent;
  let fixture: ComponentFixture<HistoryDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
