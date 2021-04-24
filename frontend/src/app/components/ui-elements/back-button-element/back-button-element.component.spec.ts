import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackButtonElementComponent } from './back-button-element.component';

describe('BackButtonElementComponent', () => {
  let component: BackButtonElementComponent;
  let fixture: ComponentFixture<BackButtonElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackButtonElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BackButtonElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
