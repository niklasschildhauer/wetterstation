import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavBarElementComponent } from './nav-bar-element.component';

describe('NavBarElementComponent', () => {
  let component: NavBarElementComponent;
  let fixture: ComponentFixture<NavBarElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavBarElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavBarElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
