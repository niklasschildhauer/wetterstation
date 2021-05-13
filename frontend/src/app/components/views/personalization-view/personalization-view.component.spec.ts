import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizationViewComponent } from './personalization-view.component';

describe('PersonalizationViewComponent', () => {
  let component: PersonalizationViewComponent;
  let fixture: ComponentFixture<PersonalizationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalizationViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
