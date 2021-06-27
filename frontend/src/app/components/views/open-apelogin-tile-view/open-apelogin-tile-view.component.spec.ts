import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpenAPELoginTileViewComponent } from './open-apelogin-tile-view.component';

describe('OpenAPELoginTileViewComponent', () => {
  let component: OpenAPELoginTileViewComponent;
  let fixture: ComponentFixture<OpenAPELoginTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpenAPELoginTileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAPELoginTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
