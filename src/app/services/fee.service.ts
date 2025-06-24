import { Injectable } from '@angular/core';
import {FeeEndpoints} from '../shared/api-endpoints';
import {HttpClient} from '@angular/common/http';
import {Fee} from '../model/fee.model';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class FeeService {

  private readonly feeEndpoints = FeeEndpoints;

  constructor(private http:HttpClient) { }

  payFee(fee: Fee): Observable<ApiResponse<any>>{
    return this.http.post<ApiResponse<any>>(this.feeEndpoints.PAY_FEE, fee);
  }
}
