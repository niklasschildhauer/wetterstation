import { TestBed } from '@angular/core/testing';

import { ESPConfigurationAPIService } from './esp-configuration-api.service';

describe('EspConfigService', () => {
  let service: ESPConfigurationAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ESPConfigurationAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
