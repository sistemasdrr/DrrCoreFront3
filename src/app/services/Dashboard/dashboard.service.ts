import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SeriesDashboard } from 'app/models/dashboard';
import { ObservedTickets, PendingTask, PendingTaskByUser, PendingTaskSupervisor } from 'app/models/pedidos/ticket';
import { Response } from 'app/models/response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  url = environment.apiUrl
  controllerDashboard = "/Dashboard"

  constructor(private http : HttpClient) { }

  PendingTask(userTo : string) : Observable<Response<PendingTask[]>>{
    return this.http.get<Response<PendingTask[]>>(this.url + this.controllerDashboard + '/PendingTask?userTo='+userTo);
  }
  DailyProduction(userTo : string) : Observable<Response<number>>{
    return this.http.get<Response<number>>(this.url + this.controllerDashboard + '/DailyProduction?userTo='+userTo);
  }
  MonthlyProduction(userTo : string) : Observable<Response<number>>{
    return this.http.get<Response<number>>(this.url + this.controllerDashboard + '/MonthlyProduction?userTo='+userTo);
  }
  ObservedTickets(idEmployee : number) : Observable<Response<ObservedTickets[]>>{
    return this.http.get<Response<ObservedTickets[]>>(this.url + this.controllerDashboard + '/ObservedTickets?idEmployee='+idEmployee);
  }
  SeriesDashboard() : Observable<Response<SeriesDashboard>>{
    return this.http.get<Response<SeriesDashboard>>(this.url + this.controllerDashboard + '/TicketsInCurrentMonth');
  }
  GetPendingTaskByUser(userTo : string) : Observable<Response<PendingTaskSupervisor[]>>{
    return this.http.get<Response<PendingTaskSupervisor[]>>(this.url + this.controllerDashboard + '/GetPendingTaskByUser?userTo='+userTo);
  }
  GetStaticsByCountryDto(idCountry : number) : Observable<Response<any>>{
    return this.http.get<Response<any>>(this.url + this.controllerDashboard + '/GetStaticsByCountryDto?idCountry='+idCountry);
  }
}
