import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressChartElementComponent } from './progress-chart-element.component';

describe('ProgressChartElementComponent', () => {
  let component: ProgressChartElementComponent;
  let fixture: ComponentFixture<ProgressChartElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressChartElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressChartElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
