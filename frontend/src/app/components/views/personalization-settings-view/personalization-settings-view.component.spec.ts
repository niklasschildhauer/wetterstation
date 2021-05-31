import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizationSettingsViewComponent } from './personalization-settings-view.component';

describe('PersonalizationSettingsViewComponent', () => {
  let component: PersonalizationSettingsViewComponent;
  let fixture: ComponentFixture<PersonalizationSettingsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalizationSettingsViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizationSettingsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
