import { TestBed } from '@angular/core/testing';

import { UserContextAPIService } from './user-context-api.service';

describe('UserContextApiService', () => {
  let service: UserContextAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserContextAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
