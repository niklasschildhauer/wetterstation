import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderElementComponent } from './slider-element.component';

describe('SliderElementComponent', () => {
  let component: SliderElementComponent;
  let fixture: ComponentFixture<SliderElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SliderElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
