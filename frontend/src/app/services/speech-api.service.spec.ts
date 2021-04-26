import { TestBed } from '@angular/core/testing';

import { SpeechAPIService } from './speech-api.service';

describe('SpeechAPIService', () => {
  let service: SpeechAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
