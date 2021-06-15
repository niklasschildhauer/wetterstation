import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationTileViewComponent } from './configuration-tile-view.component';

describe('ConfigurationTileViewComponent', () => {
  let component: ConfigurationTileViewComponent;
  let fixture: ComponentFixture<ConfigurationTileViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigurationTileViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationTileViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
