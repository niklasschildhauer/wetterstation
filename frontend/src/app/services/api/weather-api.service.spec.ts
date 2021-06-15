import { TestBed } from '@angular/core/testing';

import { WeatherAPIService } from './weather-api.service';

describe('WeatherService', () => {
  let service: WeatherAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
