import { TestBed, inject } from '@angular/core/testing';

import { PaymentsService } from './payments.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { mockAccountInfo } from 'src/testing/mock-account-info';

describe('PaymentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [PaymentsService]

  }));

  it('should be created', () => {
    const service: PaymentsService = TestBed.get(PaymentsService);
    expect(service).toBeTruthy();
  });

  it('should fetch the account info for the user', inject(
    [HttpTestingController, PaymentsService],
    (httpMock: HttpTestingController, paymentsService: PaymentsService) => {
      const mockUID = 'mock-uid';

      paymentsService.fetchAccountInfo(mockUID).subscribe(result => {
        expect(result).toEqual(mockAccountInfo);
      });

      const mockReq = httpMock.expectOne(`${paymentsService.PAYMENTS_API_URL}/account-info/${mockUID}`);
      expect(mockReq.cancelled).toBeFalsy();
      expect(mockReq.request.responseType).toEqual('json');
      mockReq.flush(mockAccountInfo);

      httpMock.verify();
  }));
});
