import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthSubscriberService } from './auth-subscriber.service';

@Injectable({
  providedIn: 'root',
})
export class AuthSubscriberGuard {
  constructor(private authService : AuthSubscriberService, private router: Router) {}

  canActivate() {

    const isUserLoggedIn = this.authService.getIsLoginValue();
    const subscriberUser = JSON.parse(localStorage.getItem('subscriberUser') || '{}');
    if (subscriberUser.id > 0) {
      console.log(subscriberUser)
      return true;
    } else {
      this.router.navigate(['/authentication/login']);
      console.log("No se encuentra logeado")
      return false;
    }
  }
}
