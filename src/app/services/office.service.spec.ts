import { inject, TestBed } from '@angular/core/testing';

import { OfficeService } from './office.service';
import { ConnectionBackend, Http, RequestOptions } from '@angular/http';

describe('OfficeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfficeService, Http, ConnectionBackend, RequestOptions]
    });
  });

  it('should ...', inject([OfficeService], (service: OfficeService) => {
    expect(service).toBeTruthy();
  }));
});
