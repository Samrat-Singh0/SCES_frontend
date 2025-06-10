import { TestBed } from '@angular/core/testing';

import { SemesterStateService } from './semester-state.service';

describe('SemesterStateService', () => {
  let service: SemesterStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SemesterStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
