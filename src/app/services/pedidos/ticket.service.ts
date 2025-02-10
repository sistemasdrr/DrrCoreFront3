import { AddTicketObservations, Asignacion, EmployeesAssignated, GetTicketObservations, ListTicket2, NewAsignacion, TicketHistoryCount, PendingTask, ObservedTickets, GetTicketUserResponseDto, OtherUserCode } from './../../models/pedidos/ticket';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CurrentTicket, ListTicket, ReportType, PersonalAssignation, SaveTicketAssignation, SendQuery, Ticket, TicketListPending, TicketQuery, TicketFile, TicketHistorySubscriber, SearchSituation, TicketsByCompanyOrPerson, TimeLineTicket, TicketObservations, ProviderByTicket } from 'app/models/pedidos/ticket';
import { Response } from 'app/models/response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TicketService {


  url = environment.apiUrl
  controllerTicket = "/Ticket"

  constructor(private http : HttpClient) { }

  getTicketActual() : Observable<Response<CurrentTicket>>{
    return this.http.get<Response<CurrentTicket>>(this.url + this.controllerTicket + '/numberticket');
  }
  getTicketHistorySubscriber(idSubscriber : number, name : string, from : Date | null, until : Date | null, idCountry : number) : Observable<Response<TicketHistorySubscriber[]>>{
    const fromD = from === null ? '' : from?.toDateString()
    const untilD = until === null ? '' : until?.toDateString()
    return this.http.get<Response<TicketHistorySubscriber[]>>(this.url + this.controllerTicket + '/getTicketHistorySubscriber?idSubscriber='+idSubscriber+'&name='+name+'&from='+ fromD+'&until='+ untilD+'&idCountry='+idCountry);
  }
  getNumTicketById(idTicket : number) : Observable<Response<string>>{
    return this.http.get<Response<string>>(this.url + this.controllerTicket + '/getNumTicketById?idTicket='+idTicket);
  }
  addTicket(obj : Ticket) : Observable<Response<number>>{
    return this.http.post<Response<number>>(this.url + this.controllerTicket + '/add',obj);
  }
  SaveTicketAsignations(idTicket : number,commentary : string) : Observable<Response<boolean>>{
    return this.http.get<Response<boolean>>(this.url + this.controllerTicket + '/SaveTicketAsignations?idTicket='+idTicket+'&commentary='+commentary);
  }
  downloadAndUploadF1(idTicket : number) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/downloadAndUploadF1?idTicket='+idTicket,'');
  }
  addTicketByWeb(obj : Ticket) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/addByWeb',obj);
  }
  addTicketOnline(obj : Ticket,rubro : string, sendTo : string) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/addOnline?rubro='+rubro+'&sendTo='+sendTo,obj);
  }
  getTipoReporte(id : number, type : string) : Observable<Response<ReportType>>{
    return this.http.get<Response<ReportType>>(this.url + this.controllerTicket + '/getreporttype?id='+id+'&type='+type);
  }
  getSearchSituation(about : string, typeSearch : string, search : string, idCountry : number) : Observable<Response<SearchSituation[]>>{
    return this.http.get<Response<SearchSituation[]>>(this.url + this.controllerTicket + '/getSearchSituation?about='+about+'&typeSearch='+typeSearch+'&search='+search+'&idCountry='+idCountry);
  }
  GetNewSearchSituation(about : string, name : string, form : string, idCountry : number, haveReport : boolean, filterBy : string) : Observable<Response<SearchSituation[]>>{
    return this.http.get<Response<SearchSituation[]>>(this.url + this.controllerTicket + '/GetNewSearchSituation?about='+about+'&name='+name+'&form='+form+'&idCountry='+idCountry+'&haveReport='+haveReport+'&filterBy='+filterBy);
  }
  getTicketByCompanyOrPerson(about : string, id : number, oldCode : string) : Observable<Response<TicketsByCompanyOrPerson[]>>{
    return this.http.get<Response<TicketsByCompanyOrPerson[]>>(this.url + this.controllerTicket + '/getListTicketSituation?about='+about+'&id='+id+'&oldCode='+oldCode);
  }
  getTimeLine(idTicket : number) : Observable<Response<TimeLineTicket[]>>{
    return this.http.get<Response<TimeLineTicket[]>>(this.url + this.controllerTicket + '/getTimeLine?idTicket='+idTicket);
  }
  getTicketObservations(idTicket : number) : Observable<Response<TicketObservations>>{
    return this.http.get<Response<TicketObservations>>(this.url + this.controllerTicket + '/getTicketObservations?idTicket='+idTicket);
  }
  addTicketObservations(idTicket : number, indications : string, userFrom :string) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/addTicketObservations?idTicket='+idTicket+'&indications='+indications+'&userFrom='+userFrom,'');
  }
  uploadFile(idTicket : number, numCupon : string, file : File) : Observable<Response<ReportType>>{
    const formData = new FormData();
    formData.append('idTicket', idTicket.toString());
    formData.append('numCupon', numCupon.toString());
    formData.append('file', file, file.name);
    return this.http.post<Response<ReportType>>(this.url + this.controllerTicket + '/uploadFile?idTicket=' +idTicket+ '&numCupon='+numCupon, formData);
  }
  getTicketFiles(idTicket : number) : Observable<Response<TicketFile[]>>{
    return this.http.get<Response<TicketFile[]>>(this.url + this.controllerTicket + '/getFilesByIdTicket?idTicket='+idTicket);
  }
  downloadFile(id : number){
    return this.http.get(this.url + this.controllerTicket + '/DownloadFileById?id='+id,{observe:'response',responseType:'blob'});
  }
  DownloadZipByIdTicket(idTicket : number){
    return this.http.get(this.url + this.controllerTicket + '/DownloadZipByIdTicket?idTicket='+idTicket,{observe:'response',responseType:'blob'});
  }
  getList() : Observable<Response<ListTicket[]>>{
    return this.http.get<Response<ListTicket[]>>(this.url + this.controllerTicket + '/getList');
  }
  getListToDispatch() : Observable<Response<ListTicket[]>>{
    return this.http.get<Response<ListTicket[]>>(this.url + this.controllerTicket + '/getListToDispatch');
  }
  GetTicketObservedByIdEmployee(idEmployee : number) : Observable<Response<ListTicket[]>>{
    return this.http.get<Response<ListTicket[]>>(this.url + this.controllerTicket + '/GetTicketObservedByIdEmployee?idEmployee='+idEmployee);
  }
  dispatchTicket(idTicket : number, idUser : number, obj : number[]) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/DispatchTicket?idTicket='+idTicket+'&idUser='+idUser,obj);
  }

  getListBy(ticket : string, name : string, subscriber : string, type : string, procedure : string) : Observable<Response<ListTicket[]>>{
    return this.http.get<Response<ListTicket[]>>(this.url + this.controllerTicket + '/getListby?ticket='+ticket+'&name='+name+'&subscriber='+subscriber+'&type='+type+'&procedure='+procedure);
  }
  getListPending() : Observable<Response<TicketListPending[]>>{
    return this.http.get<Response<TicketListPending[]>>(this.url + this.controllerTicket + '/getListPending');
  }
  getTicketHistoryToDelete(idTicket:number) : Observable<Response<any[]>>{
    return this.http.get<Response<TicketListPending[]>>(this.url + this.controllerTicket + '/GetTicketHistoryToDelete?idTicket='+idTicket);
  }
  getTicketToDelete(cupon:number,name:string) : Observable<Response<any[]>>{
    return this.http.get<Response<TicketListPending[]>>(this.url + this.controllerTicket + '/GetTicketToDelete?cupon'+cupon+'&name='+name);
  }
  anularTicketHistory(idTicketHistory:number) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/AnluarTicketHistory?idTicketHistory='+idTicketHistory,'');
  }
  anularTicket(idTicket:number,reason:number) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/AnularTicket?idTicket='+idTicket+'&reason='+reason,'');
  }
  getById(id : number) : Observable<Response<Ticket>>{
    return this.http.get<Response<Ticket>>(this.url + this.controllerTicket + '/getTicketById?id='+id);
  }
  deleteTicket(id : number) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/deleteTicket?id='+id,'');
  }
  getTicketQuery(idTicket:number) : Observable<Response<TicketQuery>>{
    return this.http.get<Response<TicketQuery>>(this.url + this.controllerTicket + '/getTicketQuery?idTicket='+idTicket);
  }
  sendQuery(obj : SendQuery) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/sendQuery',obj);
  }
  resolveQuery(idTicket:number,response:string) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/answeredTicketQuery?idTicket='+idTicket+'&&response='+response,'');
  }
  downloadReport(){
    return this.http.get(this.url + this.controllerTicket + '/report',{observe:'response',responseType:'blob'});
  }
  DownloadF8ByIdTicket(idTicket : number, language : string, format : string){
    return this.http.get(this.url + this.controllerTicket + '/DownloadF8ByIdTicket?idTicket='+idTicket+'&language='+language+'&format='+format,{observe:'response',responseType:'blob'});
  }

  savePreassign(list : SaveTicketAssignation[]) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/saveTicketPreassignations',list);
  }
  saveAndSendPreassign(list : SaveTicketAssignation[]) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/sendTicketPreassignations',list);
  }
  getTicketPreassigned(userTo : string) : Observable<Response<ListTicket2[]>>{
    return this.http.get<Response<ListTicket2[]>>(this.url + this.controllerTicket + '/getTicketPreassignToUser?userTo='+userTo);
  }
  finishWord(obj : Asignacion) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/finishWork',obj);
  }
  FinishWorkById(idTicketHistory : number) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/FinishWorkById?idTicketHistory='+idTicketHistory,'');
  }
  deleteTicketComplement(idTicket: number) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/deleteTicketComplement?idTicket='+idTicket,'');
  }
  deleteTicketHistory(idTicket: number, assignedTo : string, numberAssign : number, returnMessage : string) : Observable<Response<boolean>>{
    return this.http.get<Response<boolean>>(this.url + this.controllerTicket + '/deleteTicketHistory?idTicket='+idTicket+'&assignedTo='+assignedTo+'&numberAssign='+numberAssign+'&returnMessage='+returnMessage);
  }
  DeleteTicketHistoryById(idTicketHistory: number) : Observable<Response<boolean>>{
    return this.http.get<Response<boolean>>(this.url + this.controllerTicket + '/DeleteTicketHistoryById?idTicketHistory='+idTicketHistory);
  }

  getPersonalAssignation() : Observable<Response<PersonalAssignation[]>>{
    return this.http.get<Response<PersonalAssignation[]>>(this.url + this.controllerTicket + '/getPersonalAssignation');
  }
  getAgentAssignation() : Observable<Response<PersonalAssignation[]>>{
    return this.http.get<Response<PersonalAssignation[]>>(this.url + this.controllerTicket + '/getAgentAssignation');
  }
  sendAssignation(list : NewAsignacion) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/assignTicket',list);
  }
  getProvidersByTicket(idTicket : number) : Observable<Response<ProviderByTicket[]>>{
    return this.http.get<Response<ProviderByTicket[]>>(this.url + this.controllerTicket + '/providerByIdTicket?idTicket='+idTicket );
  }
  providerHistoryByIdTicket(idTicket : number) : Observable<Response<ProviderByTicket[]>>{
    return this.http.get<Response<ProviderByTicket[]>>(this.url + this.controllerTicket + '/providerHistoryByIdTicket?idTicket='+idTicket );
  }
  getTicketHistoryCount() : Observable<Response<TicketHistoryCount[]>>{
    return this.http.get<Response<TicketHistoryCount[]>>(this.url + this.controllerTicket + '/getCountAsignation' );
  }


  GetEmployeesAssignated(idTicket : number) : Observable<Response<EmployeesAssignated[]>>{
    return this.http.get<Response<EmployeesAssignated[]>>(this.url + this.controllerTicket + '/GetEmployeesAssignated?idTicket='+idTicket );
  }
  GetTicketObservations(idTicket : number) : Observable<Response<GetTicketObservations[]>>{
    return this.http.get<Response<GetTicketObservations[]>>(this.url + this.controllerTicket + '/GetTicketPendingObservations?idTicket='+idTicket );
  }
  AddTicketObservations(obj : AddTicketObservations) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/AddOrUpdateTicketPendingObservations',obj);
  }
  FinishTicketObservation(id : number, conclusion : string, dr : boolean, ag : boolean, cl : boolean) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/FinishTicketObservation?idTicketObservation='+id+'&conclusion='+conclusion+'&dr='+dr+'&ag='+ag+'&cl='+cl,'');
  }

  TicketToDispatch(idTicketHistory : number, idTicket : number,quality:string, qualityTranslator:string, qualityTypist:string, otherUsers : OtherUserCode[]) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/TicketToDispatch?idTicketHistory='+idTicketHistory+'&idTicket='+idTicket+'&quality='+quality+'&qualityTranslator='+qualityTranslator+'&qualityTypist='+qualityTypist, otherUsers);
  }
  PendingTask(userTo : string) : Observable<Response<PendingTask[]>>{
    return this.http.get<Response<PendingTask[]>>(this.url + this.controllerTicket + '/PendingTask?userTo='+userTo);
  }
  DailyProduction(userTo : string) : Observable<Response<number>>{
    return this.http.get<Response<number>>(this.url + this.controllerTicket + '/DailyProduction?userTo='+userTo);
  }
  MonthlyProduction(userTo : string) : Observable<Response<number>>{
    return this.http.get<Response<number>>(this.url + this.controllerTicket + '/MonthlyProduction?userTo='+userTo);
  }
  ObservedTickets(idEmployee : number) : Observable<Response<ObservedTickets[]>>{
    return this.http.get<Response<ObservedTickets[]>>(this.url + this.controllerTicket + '/ObservedTickets?idEmployee='+idEmployee);
  }
  GetSupervisorTicket(idTicket : number) : Observable<Response<string>>{
    return this.http.get<Response<string>>(this.url + this.controllerTicket + '/GetSupervisorTicket?idTicket='+idTicket);
  }
  GetSupervisorCodeTicket(idTicket : number) : Observable<Response<string>>{
    return this.http.get<Response<string>>(this.url + this.controllerTicket + '/GetSupervisorCodeTicket?idTicket='+idTicket);
  }
  DeleteFile(id : number) : Observable<Response<boolean>>{
    return this.http.get<Response<boolean>>(this.url + this.controllerTicket + '/DeleteFile?id='+id);
  }

  SendComplement(idTicket : number, idUser : number, digited : boolean, file : boolean, observations : string, asignedTo : string) : Observable<Response<string>>{
    return this.http.get<Response<string>>(this.url + this.controllerTicket + '/SendComplement?idTicket='+idTicket+'&idUser='+idUser+'&digited='+digited+'&file='+file+'&observations='+observations+'&asignedTo='+asignedTo);
  }
  SaveTicketCommentary(idTicket : number, commentary : string) : Observable<Response<string>>{
    return this.http.post<Response<string>>(this.url + this.controllerTicket + '/SaveTicketCommentary?idTicket='+idTicket+'&commentary='+commentary,'');
  }

  GetNumerationRefCom() : Observable<Response<string>>{
    return this.http.get<Response<string>>(this.url + this.controllerTicket + '/GetNumerationRefCom');
  }
  SendComplementRefCom(idUser : number, idTicket : number,asignedTo : string, numOrder : string, message : string) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/SendComplementRefCom?idUser='+idUser+'&idTicket='+idTicket+'&asignedTo='+asignedTo+'&numOrder='+numOrder+'&message='+message,'');
  }
  ConfirmAgentHistory(idTicketHistory: number,idSpecialPrice:number) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/ConfirmAgentHistory?idTicketHistory='+idTicketHistory+'&idSpecialPrice='+idSpecialPrice,'');
  }

  GetTicketAssignedValidation(idTicket : number) : Observable<Response<GetTicketUserResponseDto[]>>{
    return this.http.get<Response<GetTicketUserResponseDto[]>>(this.url + this.controllerTicket + '/GetTicketAssignedValidation?idTicket='+idTicket);
  }
  ValidateQuality(idTicket : number) : Observable<Response<number>>{
    return this.http.post<Response<number>>(this.url + this.controllerTicket + '/ValidateQuality?idTicket='+idTicket,'');
  }

  GetUsersInTicket(idTicket : number) : Observable<Response<string[]>>{
    return this.http.get<Response<string[]>>(this.url + this.controllerTicket + '/GetUsersInTicket?idTicket='+idTicket);
  }
  TicketToDispatchById(idTicket : number, hasObs : boolean) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerTicket + '/TicketToDispatchById?idTicket='+idTicket+'&hasObs='+hasObs,'');
  }
}
