import { TestBed } from '@angular/core/testing';

import { AdminProfileResolverService } from './admin-profile-resolver.service';

describe('AdminProfileResolverService', () => {
  let service: AdminProfileResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminProfileResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
