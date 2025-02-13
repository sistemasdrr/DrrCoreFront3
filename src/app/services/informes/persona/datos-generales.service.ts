import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Persona, StatusPerson, TPersona } from 'app/models/informes/persona/datos-generales';
import { Response } from 'app/models/response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatosGeneralesService {
  url = environment.apiUrl
  controllerPersona = "/Person"
  constructor(private http : HttpClient) { }

  getPersonaById(id : number): Observable<Response<Persona>>{
    return this.http.get<Response<Persona>>(this.url + this.controllerPersona + '/getPerson?id='+id)
  }
  getDatosPersonas(razonSocial : string, tipoFiltro : string, idPais : number, conInforme : boolean, filterBy:string,quality:string ): Observable<Response<TPersona[]>>{
    return this.http.get<Response<TPersona[]>>(this.url + this.controllerPersona + '/getListPerson?fullname='+razonSocial+'&form='+tipoFiltro+'&idCountry='+idPais+'&filterBy='+filterBy+'&quality='+quality+'&haveReport='+conInforme)
  }
  getStatus(idPerson : number): Observable<Response<StatusPerson>>{
    return this.http.get<Response<StatusPerson>>(this.url + this.controllerPersona + '/getStatus?idPerson='+idPerson);
  }
  addPerson(obj : Persona): Observable<Response<number>>{
    return this.http.post<Response<number>>(this.url + this.controllerPersona + '/addPerson', obj)
  }
  deletePerson(id : number): Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerPersona + '/deletePerson?id='+id, '')
  }
  activateWeb(id : number): Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerPersona + '/deletePerson?id='+id, '')
  }
  desactivateWeb(id : number): Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerPersona + '/deletePerson?id='+id, '')
  }
  downloadReportF8(idPerson : number, language : string, format : string){
    return this.http.get(this.url + this.controllerPersona + '/getf8?idPerson='+idPerson+'&language='+language+'&format='+format,{observe:'response',responseType:'blob'});
  }
}
