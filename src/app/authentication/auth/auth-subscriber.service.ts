import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AbonadoUsr } from 'app/models/mantenimiento/abonado';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { environment } from 'environments/environment';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthSubscriberService {

  url = environment.apiUrl
  controllerAbonado = "/Subscriber"

  private currentUserSubject: BehaviorSubject<AbonadoUsr>;
  public currentUser: Observable<AbonadoUsr>;

  constructor(private http : HttpClient, private abonadoService : AbonadoService, private router : Router) {
    this.currentUserSubject = new BehaviorSubject<AbonadoUsr>(
      JSON.parse(localStorage.getItem('currentUser') || '{}')
    );
    this.currentUser = this.currentUserSubject.asObservable();
   }

  public get currentUserValue(): AbonadoUsr {
    return this.currentUserSubject.value;
  }

  loginSubscriber(usr : string, psw : string) : Observable<boolean>{

    return new Observable<boolean>(observer => {
      let success = false;
      this.abonadoService.loginSubscriber(usr,psw).subscribe(
        (response) => {
          console.log(response)
          if(response.isSuccess === true && response.isWarning === false && response.data !== null){
            const user : AbonadoUsr = {
              id : response.data.id,
              code : response.data.code,
              name : response.data.name,
              typeFact : response.data.typeFact
            };

            localStorage.removeItem('authCache');
            localStorage.removeItem('currentUser');
            localStorage.setItem('subscriberUser', JSON.stringify(user));
            success =  true;
          }else{
            success = false;
          }

          observer.next(success)
          observer.complete()
        }
      )
    })
  }
  logout(){
    localStorage.removeItem('subscriberUser');
    return of({ success: false });
  }
  getIsLoginValue() {
    const cacheData = JSON.parse(localStorage.getItem('subscriberUser') || '{}');
    if(cacheData !== null){
      return true;
    }else{
      return false;
    }
  }

}
