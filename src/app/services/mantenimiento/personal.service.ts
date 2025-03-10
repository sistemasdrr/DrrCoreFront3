import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Personal } from 'app/models/mantenimiento/personal';
import { Response } from 'app/models/response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

export interface data{
  id : number
  valor : string
}
export interface BillingPersonal{
  id : number
  idEmployee : number
  code : string
  commission : boolean
  reportType : string
  quality : string
  isComplement : boolean
  amount : number
  directTranslate:boolean
}

@Injectable({
  providedIn: 'root'
})
export class PersonalService {
  url = environment.apiUrl
  controllerCombo = "/Combo"
  controllerMaster = "/Master"

  constructor(private http : HttpClient) { }

  getPersonales(): Observable<any>{
    return this.http.get<any>(this.url + this.controllerMaster + '/getEmployees');
  }
  getPersonalById(id : number): Observable<any>{
    return this.http.get<any>(this.url + this.controllerMaster + '/getEmployeeById?id='+id);
  }
  getPersonalByName(name : string): Observable<any>{
    return this.http.get<any>(this.url + this.controllerMaster + '/getEmployeesByName?name='+name);
  }
  addPersonal(request : Personal):Observable<any>{
    return this.http.post<any>(this.url + this.controllerMaster + '/addEmployee',request);
  }
  deletePersonal(id : number){
    return this.http.post<any>(this.url + this.controllerMaster + '/deleteEmployee?id='+id,'');
  }
  activePersonal(id : number){
    return this.http.post<any>(this.url + this.controllerMaster + '/activeEmployee?id='+id,'');
  }

  AddOrUpdateBillingPersonal(request : BillingPersonal):Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerMaster + '/AddOrUpdateBillingPersonal',request);
  }
  DeleteBillingPersonal(id : number):Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerMaster + '/DeleteBillingPersonal?id='+id,'');
  }
  GetBillingPersonalsByCode(code : string): Observable<Response<BillingPersonal[]>>{
    return this.http.get<Response<BillingPersonal[]>>(this.url + this.controllerMaster + '/GetBillingPersonalsByCode?code='+code);
  }
  GetUserCodeById(id : number): Observable<Response<string[]>>{
    return this.http.get<Response<string[]>>(this.url + this.controllerMaster + '/GetUserCodeById?id='+id);
  }
  GetBillingPersonalById(id : number): Observable<Response<BillingPersonal>>{
    return this.http.get<Response<BillingPersonal>>(this.url + this.controllerMaster + '/GetBillingPersonalById?id='+id);
  }
  GetBillingPersonalsByIdEmployee(idEmployee : number): Observable<Response<BillingPersonal[]>>{
    return this.http.get<Response<BillingPersonal[]>>(this.url + this.controllerMaster + '/GetBillingPersonalsByIdEmployee?idEmployee='+idEmployee);
  }
  GetOtherUserCode(idEmployee : number): Observable<Response<string[]>>{
    return this.http.get<Response<string[]>>(this.url + this.controllerMaster + '/GetOtherUserCode?idEmployee='+idEmployee);
  }
}
