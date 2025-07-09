import { TestBed } from '@angular/core/testing';

import { ToastrMsgService } from './toastr-msg.service';

describe('ToastrMsgService', () => {
  let service: ToastrMsgService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastrMsgService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
