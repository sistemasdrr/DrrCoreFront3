import { GetCycles, GetReporters, Query1_6, Query1_7Tickets, Query2_1ByMonth, Query2_1ByYear, Query2_2ByYear, Query3_1ByMonth, Query3_1ByYear, Query4_1_1, Query4_1_2, Query4_1_3, Query4_1_4, Query4_2_1, Query4_2_2, Query5_1_1, Query5_1_1Tickets, Query5_1_2, Query5_1_2ByCycle } from './../../models/consulta';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query1_1, Query1_10, Query1_11BySubscriber, Query1_11Subscriber, Query1_1ByMonth, Query1_2ByYear, Query1_3BySubscriber, Query1_4, Query1_4Subscriber, Query1_5, Query1_6ByIdSubscriber, Query1_7, Query1_8, Query1_9 } from 'app/models/consulta';

import { Response } from 'app/models/response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultaService {
  url = environment.apiUrl
  controller = "/Query"

  constructor(private http : HttpClient) { }

  GetQuery1_1ByYear(year : number) : Observable<Response<Query1_1[]>>{
    return this.http.get<Response<Query1_1[]>>(this.url + this.controller + '/GetQuery1_1ByYear?year='+year);
  }
  GetQuery1_1ByMonth(year : number,month : number, idSubscriber : number) : Observable<Response<Query1_1ByMonth[]>>{
    return this.http.get<Response<Query1_1ByMonth[]>>(this.url + this.controller + '/GetQuery1_1ByMonth?year='+year+'&month='+month+'&idSubscriber='+idSubscriber);
  }
  GetQuery1_2ByYear(year : number) : Observable<Response<Query1_2ByYear[]>>{
    return this.http.get<Response<Query1_2ByYear[]>>(this.url + this.controller + '/GetQuery1_2ByYear?year='+year);
  }
  GetQuery1_3BySubscriber(idSubscriber: number, year : number) : Observable<Response<Query1_3BySubscriber[]>>{
    return this.http.get<Response<Query1_3BySubscriber[]>>(this.url + this.controller + '/GetQuery1_3BySubscriber?idSubscriber='+idSubscriber+'&year='+year);
  }
  GetQuery1_4Subscribers() : Observable<Response<Query1_4Subscriber[]>>{
    return this.http.get<Response<Query1_4Subscriber[]>>(this.url + this.controller + '/GetQuery1_4Subscribers');
  }
  GetQuery1_4(idSubscriber: number, year : number) : Observable<Response<Query1_4>>{
    return this.http.get<Response<Query1_4>>(this.url + this.controller + '/GetQuery1_4?idSubscriber='+idSubscriber+'&year='+year);
  }
  GetQuery1_5(startDate: string, endDate : string) : Observable<Response<Query1_5[]>>{
    return this.http.get<Response<Query1_5[]>>(this.url + this.controller + '/GetQuery1_5?startDate='+startDate+'&endDate='+endDate);
  }
  GetQuery1_6() : Observable<Response<Query1_6[]>>{
    return this.http.get<Response<Query1_6[]>>(this.url + this.controller + '/GetQuery1_6');
  }
  GetQuery1_6BySubscriber() : Observable<Response<Query1_6ByIdSubscriber[]>>{
    return this.http.get<Response<Query1_6ByIdSubscriber[]>>(this.url + this.controller + '/GetQuery1_6BySubscriber');
  }
  GetQuery1_7Subscriber() : Observable<Response<Query1_7[]>>{
    return this.http.get<Response<Query1_7[]>>(this.url + this.controller + '/GetQuery1_7Subscriber');
  }
  GetQuery1_7Tickets(year : number, month : number, idSubscriber : number) : Observable<Response<Query1_7Tickets[]>>{
    return this.http.get<Response<Query1_7Tickets[]>>(this.url + this.controller + '/GetQuery1_7Tickets?year='+year+'&month='+month+'&idSubscriber='+idSubscriber);
  }
  GetQuery1_8(year : number, month : number) : Observable<Response<Query1_8[]>>{
    return this.http.get<Response<Query1_8[]>>(this.url + this.controller + '/GetQuery1_8?year='+year+'&month='+month);
  }
  GetQuery1_9(year : number, month : number) : Observable<Response<Query1_9[]>>{
    return this.http.get<Response<Query1_9[]>>(this.url + this.controller + '/GetQuery1_9?year='+year+'&month='+month);
  }
  GetQuery1_10(idSubscriber : number, startDate: string, endDate : string) : Observable<Response<Query1_10[]>>{
    return this.http.get<Response<Query1_10[]>>(this.url + this.controller + '/GetQuery1_10?idSubscriber='+idSubscriber+'&startDate='+startDate+'&endDate='+endDate);
  }
  GetQuery1_11Subscriber(year : number) : Observable<Response<Query1_11Subscriber[]>>{
    return this.http.get<Response<Query1_11Subscriber[]>>(this.url + this.controller + '/GetQuery1_11Subscriber?year='+year);
  }
  GetQuery1_11BySubscriber(idSubscriber : number, year : number, month : number) : Observable<Response<Query1_11BySubscriber[]>>{
    return this.http.get<Response<Query1_11BySubscriber[]>>(this.url + this.controller + '/GetQuery1_11BySubscriber?idSubscriber='+idSubscriber+'&year='+year+'&month='+month);
  }
  GetReporters() : Observable<Response<GetReporters[]>>{
    return this.http.get<Response<GetReporters[]>>(this.url + this.controller + '/GetReporters');
  }
  GetQuery2_1ByYear(year : number) : Observable<Response<Query2_1ByYear[]>>{
    return this.http.get<Response<Query2_1ByYear[]>>(this.url + this.controller + '/GetQuery2_1ByYear?year='+year);
  }
  GetQuery2_1ByMonth(asignedTo : string, year : number, month : number) : Observable<Response<Query2_1ByMonth[]>>{
    return this.http.get<Response<Query2_1ByMonth[]>>(this.url + this.controller + '/GetQuery2_1ByMonth?asignedTo='+asignedTo+'&year='+year+'&month='+month);
  }
  GetQuery2_2ByYear(asignedTo : string, year : number) : Observable<Response<Query2_2ByYear[]>>{
    return this.http.get<Response<Query2_2ByYear[]>>(this.url + this.controller + '/GetQuery2_2ByYear?asignedTo='+asignedTo+'&year='+year);
  }
  GetQuery3_1ByYear(year : number) : Observable<Response<Query3_1ByYear[]>>{
    return this.http.get<Response<Query3_1ByYear[]>>(this.url + this.controller + '/GetQuery3_1ByYear?year='+year);
  }
  GetQuery3_1ByMonth(asignedTo : string, year : number, month : number) : Observable<Response<Query3_1ByMonth[]>>{
    return this.http.get<Response<Query3_1ByMonth[]>>(this.url + this.controller + '/GetQuery3_1ByMonth?asignedTo='+asignedTo+'&year='+year+'&month='+month);
  }
  GetQuery4_1_1() : Observable<Response<Query4_1_1[]>>{
    return this.http.get<Response<Query4_1_1[]>>(this.url + this.controller + '/GetQuery4_1_1');
  }
  DownloadQuery_Fact_4_1_1(format : string){
    return this.http.get(this.url + this.controller + '/DownloadQuery_Fact_4_1_1?format='+format,{observe:'response',responseType:'blob'});
  }
  SendMailQuery_Fact_ByBill(to : string, idSubscriber : number, idUser : number): Observable<Response<boolean>>{
    return this.http.get<Response<boolean>>(this.url + this.controller + '/SendMailQuery4_1_1_Fact_ByBill?to='+to+'&idSubscriber='+idSubscriber+'&idUser='+idUser);
  }
  GetQuery4_1_2() : Observable<Response<Query4_1_2[]>>{
    return this.http.get<Response<Query4_1_2[]>>(this.url + this.controller + '/GetQuery4_1_2');
  }
  DownloadQuery_Fact_4_1_2(format : string){
    return this.http.get(this.url + this.controller + '/DownloadQuery_Fact_4_1_2?format='+format,{observe:'response',responseType:'blob'});
  }
  GetQuery4_1_3(startDate : string, endDate : string) : Observable<Response<Query4_1_3[]>>{
    return this.http.get<Response<Query4_1_3[]>>(this.url + this.controller + '/GetQuery4_1_3?startDate='+startDate+'&endDate='+endDate);
  }
  DownloadQuery_Fact_4_1_3(format : string,startDate : string, endDate : string){
    return this.http.get(this.url + this.controller + '/DownloadQuery_Fact_4_1_3?format='+format+'&startDate='+startDate+'&endDate='+endDate,{observe:'response',responseType:'blob'});
  }
  GetQuery4_1_4(month : number, year : number) : Observable<Response<Query4_1_4[]>>{
    return this.http.get<Response<Query4_1_4[]>>(this.url + this.controller + '/GetQuery4_1_4?month='+month+'&year='+year);
  }
  DownloadQuery_Fact_4_1_4(format : string,month : number, year : number){
    return this.http.get(this.url + this.controller + '/DownloadQuery_Fact_4_1_4?format='+format+'&month='+month+'&year='+year,{observe:'response',responseType:'blob'});
  }
  DownloadQuery_Fact_4_1_5(format : string,orderBy : string, month : number, year : number){
    return this.http.get(this.url + this.controller + '/DownloadQuery_Fact_4_1_5?format='+format+'&orderBy='+orderBy+'&month='+month+'&year='+year,{observe:'response',responseType:'blob'});
  }
  GetQuery4_2_1() : Observable<Response<Query4_2_1[]>>{
    return this.http.get<Response<Query4_2_1[]>>(this.url + this.controller + '/GetQuery4_2_1');
  }
  DownloadQuery_Fact_4_2_1(format : string){
    return this.http.get(this.url + this.controller + '/DownloadQuery_Fact_4_2_1?format='+format,{observe:'response',responseType:'blob'});
  }
  GetQuery4_2_2(startDate : string, endDate : string) : Observable<Response<Query4_2_2[]>>{
    return this.http.get<Response<Query4_2_2[]>>(this.url + this.controller + '/GetQuery4_2_2?startDate='+startDate+'&endDate='+endDate);
  }

  DownloadQuery_Fact_4_2_2(format : string,startDate : string, endDate : string){
    return this.http.get(this.url + this.controller + '/DownloadQuery_Fact_4_2_2?format='+format+'&startDate='+startDate+'&endDate='+endDate,{observe:'response',responseType:'blob'});
  }
  GetQuery5_1_1() : Observable<Response<Query5_1_1[]>>{
    return this.http.get<Response<Query5_1_1[]>>(this.url + this.controller + '/GetQuery5_1_1');
  }
  SendTicketAlert(idTicket : number, idUser : number) : Observable<Response<Boolean>>{
    return this.http.get<Response<Boolean>>(this.url + this.controller + '/SendTicketAlert?idTicket='+idTicket+'&idUser='+idUser);
  }
  GetQuery5_1_2(idUser : string) : Observable<Response<Query5_1_2[]>>{
    return this.http.get<Response<Query5_1_2[]>>(this.url + this.controller + '/GetQuery5_1_2?idUser='+idUser);
  }
  GetQuery5_1_2Daily(idUser : string) : Observable<Response<Query5_1_2[]>>{
    return this.http.get<Response<Query5_1_2[]>>(this.url + this.controller + '/GetQuery5_1_2Daily?idUser='+idUser);
  }
  GetQuery5_1_2Monthly(idUser : string, month : number) : Observable<Response<Query5_1_2[]>>{
    return this.http.get<Response<Query5_1_2[]>>(this.url + this.controller + '/GetQuery5_1_2Monthly?idUser='+idUser+'&month='+month);
  }
  GetQuery5_1_2MonthlyByCycle(idUser : string, cycle : string, code : string) : Observable<Response<Query5_1_2ByCycle[]>>{
    return this.http.get<Response<Query5_1_2ByCycle[]>>(this.url + this.controller + '/GetQuery5_1_2MonthlyByCycle?idUser='+idUser+'&cycle='+cycle+'&code='+code);
  }
  GetCycles() : Observable<Response<GetCycles[]>>{
    return this.http.get<Response<GetCycles[]>>(this.url + this.controller + '/GetCycles');
  }
  GetUserCode(idUser : number) : Observable<Response<string[]>>{
    return this.http.get<Response<string[]>>(this.url + this.controller + '/GetUserCode?idUser='+idUser);
  }
}
