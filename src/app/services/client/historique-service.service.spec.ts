import { TestBed } from '@angular/core/testing';

import { HistoriqueServiceService } from './historique-service.service';

describe('HistoriqueServiceService', () => {
  let service: HistoriqueServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoriqueServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
