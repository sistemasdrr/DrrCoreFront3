import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'app/models/response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface GetReport7_10_1{
  id : number
  name : string
  country : string
  flagCountry : string
  counting : number
  about : string
  lastSearched : string
}
export interface GetReport7_10_2{
  main : Report7_10_2_Main[]
  details : Report7_10_2_Details[]
}
export interface Report7_10_2_Main{
  orderDate : string
  dispatchtDate : string
  name : string
  procedureType : string
}
export interface Report7_10_2_Details{
  name : string
  counting : number
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  url = environment.apiUrl
  controller = "/Report"
  constructor(private http : HttpClient) {
  }
  DownloadReport6_1_5(idSubscriber : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_5?idSubscriber='+idSubscriber+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_7(orderBy : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_7?orderBy='+orderBy+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_14(type : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_14?type='+type+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_15(idCountry : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_15?idCountry='+idCountry+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_18(idCountry : number, year : number,format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_18?idCountry='+idCountry+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_19_1(month : number, year : number,format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_19_1?month='+month+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_19_2(month : number, year : number,format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_19_2?month='+month+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_20(month : number, year : number,format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_20?month='+month+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_21(month : number, year : number,orderBy : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_21?month='+month+'&year='+year+'&orderBy='+orderBy+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_22(year : number,orderBy : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_22?year='+year+'&orderBy='+orderBy+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_25(format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_25?format='+format,{observe:'response',responseType:'blob'});
  }

  DownloadReport6_2_1(startDate : string, endDate : string ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_2_1?startDate='+startDate+'&endDate='+endDate+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_2_2(code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_2_2?code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_2_3(cycle : string ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_2_3?cycle='+cycle+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_2_4(month : number, year : number ,orderBy : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_2_4?month='+month+'&year='+year+'&orderBy='+orderBy+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport_Realizado_Pendiente(month : number, year : number ,type : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport_Realizado_Pendiente?month='+month+'&year='+year+'&type='+type+'&format='+format,{observe:'response',responseType:'blob'});
  }
  
  DownloadReport6_3_0(format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_0?format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_1(startDate : string, endDate : string ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_1?startDate='+startDate+'&endDate='+endDate+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_2(code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_2?code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_3(startDate : string, endDate : string ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_3?startDate='+startDate+'&endDate='+endDate+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_4(month : number, year : number ,orderBy : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_4?month='+month+'&year='+year+'&orderBy='+orderBy+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_5(format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_5?format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_6(code : string, year : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_6?code='+code+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_7(code : string, month : number ,year :number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_7?code='+code+'&month='+month+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_8(type : string ,year :number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_8?type='+type+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_11(code : string ,year :number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_11?code='+code+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_4_1(startDate : string, endDate : string ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_4_1?startDate='+startDate+'&endDate='+endDate+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_4_2(code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_4_2?code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_4_3(cycle : string ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_4_3?cycle='+cycle+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_4_4(month : number, year : number ,orderBy : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_4_4?month='+month+'&year='+year+'&orderBy='+orderBy+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_5_1(startDate : string, endDate : string ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_5_1?startDate='+startDate+'&endDate='+endDate+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_5_2(code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_5_2?code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_5_3(cycle : string ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_5_3?cycle='+cycle+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_5_4(month : number, year : number ,orderBy : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_5_4?month='+month+'&year='+year+'&orderBy='+orderBy+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_6_1(code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_6_1?code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport5_1_2(year : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport5_1_2?year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_1_7Ger(orderBy : string, type : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_1_7Ger?orderBy='+orderBy+'&type='+type+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadListtoCollect(invoiceCode : string){
    return this.http.get(this.url + this.controller + '/DownloadListToCollect?invoiceCode='+invoiceCode,{observe:'response',responseType:'blob'});
  }
  DownloadReport6_3_10(code : string, year : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport6_3_10?code='+code+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_1(start : number, end : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_1?start='+start+'&end='+end+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_3(code : string, year : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_3?code='+code+'&year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_4(year : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_4?year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_5_1(month : number, year : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_5_1?year='+year+'&month='+month+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_5_2(month : number, year : number, code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_5_2?year='+year+'&month='+month+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_5_3(year : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_5_3?year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_5_4(year : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_5_4?year='+year+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_10_1(number : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_10_1?number='+number+'&format='+format,{observe:'response',responseType:'blob'});
  }
  GetReport7_10_1(number : number) : Observable<Response<GetReport7_10_1[]>>{
    return this.http.get<Response<GetReport7_10_1[]>>(this.url + this.controller + '/GetReport7_10_1?number='+number);
  }
  DownloadReport7_10_2(id : number, about : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_10_2?id='+id+'&about='+about+'&format='+format,{observe:'response',responseType:'blob'});
  }
  GetReport7_10_2(id : number, about : string) : Observable<Response<GetReport7_10_2>>{
    return this.http.get<Response<GetReport7_10_2>>(this.url + this.controller + '/GetReport7_10_2?id='+id+'&about='+about);
  }
  DownloadReport7_11(code : string,year : number, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_11?year='+year+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_12_1(month : number, year : number ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_12_1?month='+month+'&year='+year+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_12_2(year : number ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_12_2?year='+year+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_13_1(month : number, year : number ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_13_1?month='+month+'&year='+year+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_13_2(year : number ,code : string, format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_13_2?year='+year+'&code='+code+'&format='+format,{observe:'response',responseType:'blob'});
  }
  DownloadReport7_15( format : string){
    return this.http.get(this.url + this.controller + '/DownloadReport7_15?format='+format,{observe:'response',responseType:'blob'});
  }
}
