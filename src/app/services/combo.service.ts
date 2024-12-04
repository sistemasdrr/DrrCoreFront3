import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComboData, ComboData2, ComboData3, ComboData4, ComboDataCode, ComboDataName, PoliticaPagos, Reputacion, RiesgoCrediticio } from 'app/models/combo';
import { Pais } from 'app/models/combo';
import { Response } from 'app/models/response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComboService {

  url = environment.apiUrl
  controllerCombo = "/Combo"

  constructor(private http : HttpClient) { }

  GetSpecialPrice(idAgent : number) : Observable<Response<ComboDataCode[]>>{
    return this.http.get<Response<ComboDataCode[]>>(this.url + this.controllerCombo + '/GetSpecialPrice?idAgent='+idAgent);
  }
  getOccupations() : Observable<Response<ComboDataCode[]>>{
    return this.http.get<Response<ComboDataCode[]>>(this.url + this.controllerCombo + '/occupations');
  }
  getTipoDocumento() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/doctype');
  }
  getUserEmail() : Observable<Response<ComboDataName[]>>{
    return this.http.get<Response<ComboDataName[]>>(this.url + this.controllerCombo + '/userEmails');
  }
  getReporter() : Observable<Response<ComboDataName[]>>{
    return this.http.get<Response<ComboDataName[]>>(this.url + this.controllerCombo + '/reporter');
  }
  getAgents() : Observable<Response<ComboDataName[]>>{
    return this.http.get<Response<ComboDataName[]>>(this.url + this.controllerCombo + '/agents');
  }
  getAbonados() : Observable<Response<ComboDataName[]>>{
    return this.http.get<Response<ComboDataName[]>>(this.url + this.controllerCombo + '/abonados');
  }
  getDigitadores() : Observable<Response<ComboDataName[]>>{
    return this.http.get<Response<ComboDataName[]>>(this.url + this.controllerCombo + '/digitadores');
  }
  getTraductores() : Observable<Response<ComboDataName[]>>{
    return this.http.get<Response<ComboDataName[]>>(this.url + this.controllerCombo + '/traductores');
  }
  getSupervisores() : Observable<Response<ComboDataName[]>>{
    return this.http.get<Response<ComboDataName[]>>(this.url + this.controllerCombo + '/supervisores');
  }
  getDocumentType() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/documentType');
  }
  getReason() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/reason');
  }
  getTipoMoneda() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/currency');
  }
  getEstadoCivil() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/civilstatus');
  }
  getDepartamento() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/jobdep');
  }
  getCargoPorDepartamento(id : number) : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/jobbydep?department='+id);
  }
  getTipoCuenta() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/bankaccounttype');
  }
  getVinculoFamiliar() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/fambondytype');
  }
  getPersoneriaJuridica() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/legalpersontype');
  }
  getRiesgoCrediticio() : Observable<Response<RiesgoCrediticio[]>>{
    return this.http.get<Response<RiesgoCrediticio[]>>(this.url + this.controllerCombo + '/creditrisk');
  }
  getReputacion() : Observable<Response<Reputacion[]>>{
    return this.http.get<Response<Reputacion[]>>(this.url + this.controllerCombo + '/companyreputation');
  }
  getPoliticaPagos() : Observable<Response<PoliticaPagos[]>>{
    return this.http.get<Response<PoliticaPagos[]>>(this.url + this.controllerCombo + '/paymentpolicy');
  }
  getSituacionRUC() : Observable<Response<ComboData4[]>>{
    return this.http.get<Response<ComboData4[]>>(this.url + this.controllerCombo + '/legalregister');
  }
  getPaises() : Observable<Response<Pais[]>>{
    return this.http.get<Response<Pais[]>>(this.url + this.controllerCombo + '/country');
  }
  getPaisById(idCountry : number) : Observable<Response<Pais>>{
    return this.http.get<Response<Pais>>(this.url + this.controllerCombo + '/countryById?idCountry='+idCountry);
  }
  getContinentes() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/continent');
  }
  getPaisesPorContinente(idContinent : number) : Observable<Response<Pais[]>>{
    return this.http.get<Response<Pais[]>>(this.url + this.controllerCombo + '/countrybycontinent?continent='+idContinent);
  }
  getRubros() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url+ this.controllerCombo + '/subscriberCategories');
  }
  getGradoColaboracion() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url+ this.controllerCombo + '/collaborationDegree');
  }
  getSituacionFinanciera() : Observable<Response<ComboData2[]>>{
    return this.http.get<Response<ComboData2[]>>(this.url+ this.controllerCombo + '/financialSituation');
  }
  getComentarioOpcionalSbs() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/opcionalCommentarySbs');
  }
  getSectorPrincipal() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/branchSector');
  }
  getRamoNegocio() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/businessBranch');
  }
  getActividadesEspecificas(idBusinessBranch : number) : Observable<Response<ComboData3[]>>{
    return this.http.get<Response<ComboData3[]>>(this.url + this.controllerCombo + '/businessActivity?idBusinessBranch='+idBusinessBranch);
  }
  getTitularidad() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/landOwnership');
  }
  getSituacionPersona() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/personSituation');
  }
  getProfesion() : Observable<Response<ComboData[]>>{
    return this.http.get<Response<ComboData[]>>(this.url + this.controllerCombo + '/profession');
  }
}
