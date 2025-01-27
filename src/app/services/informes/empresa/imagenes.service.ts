import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyImages, CompanyImg } from 'app/models/informes/empresa/imagenes';
import { PersonImg } from 'app/models/informes/persona/imagenes-p';
import { Response } from 'app/models/response';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {
  url = environment.apiUrl
  controllerCompany = "/Company"
  constructor(private http : HttpClient) { }

  addCompanyImg(obj : CompanyImages): Observable<Response<number>>{
    return this.http.post<Response<number>>(this.url + this.controllerCompany + '/addOrUpdateCompanyImg',obj)
  }
  getCompanyImgByIdCompany(idCompany : number): Observable<Response<CompanyImg>>{
    return this.http.get<Response<CompanyImg>>(this.url + this.controllerCompany + '/getCompanyImgByIdCompany?idCompany='+idCompany)
  }
  getPersonImgByIdPerson(idPerson : number): Observable<Response<PersonImg>>{
    return this.http.get<Response<PersonImg>>(this.url + this.controllerCompany + '/getPersonImgByIdPerson?idPerson='+idPerson)
  }
  updateImages(idCompany : number,number : number, description : string, descriptionEng : string, print : boolean, file : File): Observable<Response<boolean>>{
    console.log(descriptionEng)
    description = description === null ? "" : description
    descriptionEng = descriptionEng === null ? "" : descriptionEng
    print = print === null ? false : print
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<Response<boolean>>(this.url + this.controllerCompany + '/UpdateImageCompany?idCompany='+idCompany+'&number='+number+'&description='+description+'&descriptionEng='+descriptionEng+'&print='+print,formData)
  }
  updatPerson(idPerson : number,number : number, description : string, descriptionEng : string, print : boolean, file : File): Observable<Response<boolean>>{
    description = description === null ? "" : description
    descriptionEng = descriptionEng === null ? "" : descriptionEng
    print = print === null ? false : print
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    return this.http.post<Response<boolean>>(this.url + this.controllerCompany + '/UpdateImagePerson?idPerson='+idPerson+'&number='+number+'&description='+description+'&descriptionEng='+descriptionEng+'&print='+print,formData)
  }
  uploadImages(formData : FormData) : Observable<Response<boolean>>{
    return this.http.post<Response<boolean>>(this.url + this.controllerCompany + '/uploadImage',formData)
  }
}
