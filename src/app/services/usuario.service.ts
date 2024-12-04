import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from 'app/models/response';
import { Process, User, UserPermission } from 'app/models/usuario';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


export interface CopilotModel{
  _type : string
  queryContext : QueryContext
  webPages : WebPages
  videos : VideosCop
  relatedSearches : RelatedSearches
}
export interface RelatedSearches{
  id : string
  value : RelatedSearchesValues[]
}
export interface RelatedSearchesValues{
  text : string
  displayText : string
  webSearchUrl : string
}
export interface QueryContext{
  originalQuery : string
}
export interface WebPages{
  webSearchUrl : string
  totalEstimatedMatches : number
  value : CopilotValue[]
}
export interface CopilotValue{
  id : string
  name : string
  url : string
  thumbnailUrl : string
  isFamilyFriendly : boolean
  displayUrl : string
  snippet : string
  dateLastCrawled : string
  cachedPageUrl : string
  language : string
  isNavigational : boolean
  noCache : string
  richFacts : CopilotValueRichFacts[]

}
export interface CopilotValueRichFacts{
  label : CopilotText
  items : CopilotText[]
  hint : CopilotText
}

export interface CopilotText{
  text : string
}
export interface VideosCop{
  id : string
  readLink : string
  webSearchUrl : string
  value : VideosCopValue[]
}
export interface VideosCopValue{
  webSearchUrl : string
  name : string
  description : string
  thumbnailUrl : string
  datePublished : string
  publisher : Publisher[]
  creator : string
  contentUrl : string
  hostPageUrl : string
  hostPageDisplayUrl : string
  motionThumbnailUrl : string
  embedHtml : string

}
export interface Publisher{
  name : string
}


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  url = environment.apiUrl
  controller = "/User"
  constructor(private http : HttpClient) {
  }
  getProcess(): Observable<Response<Process[]>> {
    return this.http.get<Response<Process[]>>(this.url + this.controller + '/GetProcess');
  }
  Copilot(consulta : string) : Observable<CopilotModel>{
    return this.http.post<CopilotModel>(this.url + '/Agent' + '/copilot?query='+consulta,'');

  }
  Login(username : string, password : string): Observable<Response<string>> {
    return this.http.get<Response<string>>(this.url + this.controller + '/Login?username='+username+'&password='+password);
  }
  getUser(id : number): Observable<Response<User>> {
    return this.http.get<Response<User>>(this.url + this.controller + '/User?id='+id);
  }
  getUserProcess(idEmployee : number) : Observable<Response<UserPermission>>{
    return this.http.get<Response<UserPermission>>(this.url + this.controller + '/UserProcess?idEmployee='+idEmployee);
  }
  getOtherUserCode(idUser : number) : Observable<Response<string[]>>{
    return this.http.get<Response<string[]>>(this.url + '/Ticket' + '/GetOtherUserCode?idUser='+idUser);
  }
  updateUserProcess(obj : UserPermission) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controller + '/UpdateProcess',obj);
  }


}
