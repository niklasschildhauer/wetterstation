import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailScreenComponent } from './detail-screen.component';

describe('DetailScreenComponent', () => {
  let component: DetailScreenComponent;
  let fixture: ComponentFixture<DetailScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
