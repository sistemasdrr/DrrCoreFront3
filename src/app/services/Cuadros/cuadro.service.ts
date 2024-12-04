import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query5_1_1, Query5_1_2 } from 'app/models/cuadros';
import { Response } from 'app/models/response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuadroService {
  url = environment.apiUrl
  controller = "/Chart"

  constructor(private http : HttpClient) { }

  GetQuery5_1_1(startDate : string, endDate : string) : Observable<Response<Query5_1_1[]>>{
    return this.http.get<Response<Query5_1_1[]>>(this.url + this.controller + '/GetQuery5_1_1?startDate='+startDate+'&endDate='+endDate);
  }
  GetQuery5_1_2(startDate : string, endDate : string) : Observable<Response<Query5_1_2[]>>{
    return this.http.get<Response<Query5_1_2[]>>(this.url + this.controller + '/GetQuery5_1_2?startDate='+startDate+'&endDate='+endDate);
  }


}
