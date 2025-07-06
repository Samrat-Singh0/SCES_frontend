import { TestBed } from '@angular/core/testing';

import { GenerateDownloadLinkService } from './generate-download-link.service';

describe('GenerateDownloadLinkService', () => {
  let service: GenerateDownloadLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenerateDownloadLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
