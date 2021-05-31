import { TestBed } from '@angular/core/testing';

import { HistoryTileService } from './history-tile.service';

describe('HistoryTileService', () => {
  let service: HistoryTileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoryTileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
