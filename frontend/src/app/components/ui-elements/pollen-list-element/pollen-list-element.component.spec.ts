import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PollenListElementComponent } from './pollen-list-element.component';

describe('PollenListElementComponent', () => {
  let component: PollenListElementComponent;
  let fixture: ComponentFixture<PollenListElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PollenListElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PollenListElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
