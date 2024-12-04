import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pais } from 'app/models/combo';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  url = environment.apiUrl
  controller = "/Combo"
  constructor(private http : HttpClient) {
  }
  getPaises(): Observable<any> {
    return this.http.get<Pais[]>(this.url + this.controller + '/country');
  }
  getContinente(): Observable<any> {
    return this.http.get<any>(this.url + this.controller + '/continent');
  }
  getPaisPorContinente(continent : number):  Observable<any>{
    return this.http.get<any>(this.url + this.controller + '/countrybycontinent?continent='+continent);
  }

}

