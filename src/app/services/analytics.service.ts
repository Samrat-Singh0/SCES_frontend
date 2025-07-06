import { Injectable } from '@angular/core';
import {AnalyticsEndpoints} from '../shared/api-endpoints';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiResponse} from '../model/api-response.model';
import {AnalyticData} from '../model/analytic.model';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private readonly analyticsEndpoints=AnalyticsEndpoints;
  constructor(private http:HttpClient) {
  }

  getAnalyticData(): Observable<ApiResponse<AnalyticData>> {
    return this.http.get<ApiResponse<AnalyticData>>(this.analyticsEndpoints.GET_ANALYTICS_DATA);
  }
}
