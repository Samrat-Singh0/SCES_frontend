import {Injectable} from "@angular/core";
import {ReportEndpoints} from "../shared/api-endpoints";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {ReportRequest} from '../model/report-request.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private readonly reportEndpoints = ReportEndpoints;

  constructor(private http: HttpClient) {

  }

  downloadReport(reportRequest: ReportRequest): Observable<HttpResponse<Blob>> {
    return this.http.post(this.reportEndpoints.GET_REPORT, reportRequest,{
      observe: 'response',
      responseType: 'blob'
    });
  }
}
