import { Injectable } from '@angular/core';
import {FeeEndpoints} from '../shared/api-endpoints';
import {HttpClient} from '@angular/common/http';
import {Fee} from '../model/fee.model';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {PayFee} from '../model/pay-fee.model';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  private readonly feeEndpoints = FeeEndpoints;

  constructor(private http:HttpClient) { }

  payFee(fee: PayFee): Observable<ApiResponse<any>>{
    return this.http.post<ApiResponse<any>>(this.feeEndpoints.PAY_FEE, fee);
  }

  getFeeHistory(code: string): Observable<ApiResponse<Fee[]>> {
    return this.http.get<ApiResponse<Fee[]>>(this.feeEndpoints.GET_HISTORY+`/${code}`);
  }
}
