import { TestBed } from '@angular/core/testing';

import { NgGdService } from './ng-gd.service';

describe('NgGdService', () => {
  let service: NgGdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgGdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
