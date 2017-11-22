import { inject, TestBed } from '@angular/core/testing';

import { OfficeMockService } from './office-mock.service';

describe('OfficeMockService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OfficeMockService]
    });
  });

  it('should be created', inject([OfficeMockService], (service: OfficeMockService) => {
    expect(service).toBeTruthy();
  }));
});
