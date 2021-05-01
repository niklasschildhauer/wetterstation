import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuBarElementComponent } from './menu-bar-element.component';

describe('MenuBarElementComponent', () => {
  let component: MenuBarElementComponent;
  let fixture: ComponentFixture<MenuBarElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuBarElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuBarElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
