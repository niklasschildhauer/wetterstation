import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndoorDetailViewComponent } from './indoor-detail-view.component';

describe('IndoorDetailViewComponent', () => {
  let component: IndoorDetailViewComponent;
  let fixture: ComponentFixture<IndoorDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndoorDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndoorDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
