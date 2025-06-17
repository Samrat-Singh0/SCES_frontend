import { TestBed } from '@angular/core/testing';

import { JoinNameService } from './join-name.service';

describe('JoinNameService', () => {
  let service: JoinNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JoinNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
