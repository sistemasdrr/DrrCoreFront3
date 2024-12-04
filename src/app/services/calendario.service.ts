import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'app/models/response';
import { AddCalendar, Calendar, Calendar1 } from 'app/models/usuario';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarioService {

  url = environment.apiUrl
  controller = "/Anniversary"

  constructor(private http : HttpClient) { }

  GetCalendarAniversary() : Observable<Response<Calendar1[]>>{
    return this.http.get<Response<Calendar1[]>>(this.url + this.controller + '/GetCalendarAniversary');
  }
  AddOrUpdateCalendar(obj : AddCalendar ): Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controller + '/AddOrUpdateAsync',obj);
  }
}
