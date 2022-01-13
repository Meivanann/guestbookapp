import { TestBed } from '@angular/core/testing';

import { FlimsService } from './flims.service';

describe('FlimsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FlimsService = TestBed.get(FlimsService);
    expect(service).toBeTruthy();
  });
});
