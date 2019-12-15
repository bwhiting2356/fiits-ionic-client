import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AccountInfo } from '../shared/account-info.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  PAYMENTS_API_URL = `${environment.backendURL}`;

  constructor(private http: HttpClient) { }

  fetchAccountInfo(userId: string): Observable<AccountInfo> {
    return this.http.get<AccountInfo>(`${this.PAYMENTS_API_URL}/account-info/${userId}`);
  }
}
