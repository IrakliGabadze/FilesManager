import { TestBed } from '@angular/core/testing';

import { PermissionsService } from './auth-guard.service';

describe('AuthGuardService', () => {
  let service: PermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
