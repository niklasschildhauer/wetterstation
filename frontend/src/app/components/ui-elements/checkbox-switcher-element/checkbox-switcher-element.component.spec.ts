import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxSwitcherElementComponent } from './checkbox-switcher-element.component';

describe('CheckboxSwitcherElementComponent', () => {
  let component: CheckboxSwitcherElementComponent;
  let fixture: ComponentFixture<CheckboxSwitcherElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheckboxSwitcherElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxSwitcherElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
