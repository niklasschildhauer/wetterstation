import { TestBed } from '@angular/core/testing';

import { UserContextApiService } from './user-context-api.service';

describe('UserContextApiService', () => {
  let service: UserContextApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserContextApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
