import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuButtonElementComponent } from './menu-button-element.component';

describe('MenuButtonElementComponent', () => {
  let component: MenuButtonElementComponent;
  let fixture: ComponentFixture<MenuButtonElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuButtonElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuButtonElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
