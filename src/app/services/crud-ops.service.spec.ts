import { TestBed } from '@angular/core/testing';

import { CrudOpsService } from './crud-ops.service';

describe('CrudOpsService', () => {
  let service: CrudOpsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudOpsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
