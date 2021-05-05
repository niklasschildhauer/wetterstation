import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollenflugDetailViewComponent } from './pollenflug-detail-view.component';

describe('PollenflugDetailViewComponent', () => {
  let component: PollenflugDetailViewComponent;
  let fixture: ComponentFixture<PollenflugDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollenflugDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollenflugDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
