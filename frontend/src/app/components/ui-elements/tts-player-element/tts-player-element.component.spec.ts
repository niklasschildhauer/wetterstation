import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtsPlayerElementComponent } from './tts-player-element.component';

describe('TtsPlayerElementComponent', () => {
  let component: TtsPlayerElementComponent;
  let fixture: ComponentFixture<TtsPlayerElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TtsPlayerElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TtsPlayerElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
