import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollenTagElementComponent } from './pollen-tag-element.component';

describe('PollenTagElementComponent', () => {
  let component: PollenTagElementComponent;
  let fixture: ComponentFixture<PollenTagElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollenTagElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollenTagElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
