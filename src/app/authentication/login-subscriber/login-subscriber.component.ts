import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { Aniversario } from 'app/models/login/aniversario';
import { FechasImportantesService } from 'app/services/login/fechas-importantes.service';
import { PersonalService } from 'app/services/mantenimiento/personal.service';
import { UsuarioService } from 'app/services/usuario.service';
import { AuthSubscriberService } from '../auth/auth-subscriber.service';



@Component({
  selector: 'app-login-subscriber',
  templateUrl: './login-subscriber.component.html',
  styleUrls: ['./login-subscriber.component.scss']
})

export class LoginSubscriberComponent extends UnsubscribeOnDestroyAdapter implements OnInit{

  private readonly CACHE_KEY = 'saveUserSubscriber';
  arrayImg = [
    'assets/images/fondo-1.jpg',
    'assets/images/fondo-2.jpg',
    'assets/images/fondo-3.jpg',
    'assets/images/fondo-4.jpg',
    'assets/images/fondo-5.jpg',
  ]
  url = ""
  error = '';
  hide = true;
  loading=false;
  recordarUsuario = false
  username : string = ""
  password : string = ""


  typeInput: string = 'password';
  showPassword: boolean = false;
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
    // Cambiar el tipo de input según si la contraseña debe mostrarse o no
    this.typeInput = this.showPassword ? 'text' : 'password';
  }
  btnIngresar = "Ingresar"
  msgError = ""
  fechasImportantes : Aniversario[] = []
  constructor(
    private personalService :PersonalService,
    private authService : AuthSubscriberService,
    private router : Router,
    private aniversarioService : FechasImportantesService,
    private usuarioService : UsuarioService
  ) {
    super();
  }
  ngOnInit(): void {

    console.log(this.getRandomNumber())
    const savedUser = JSON.parse(localStorage.getItem(this.CACHE_KEY) || '{}')
    if(savedUser.saveUser === true){
      console.log(savedUser)
      this.recordarUsuario = true
      this.username = savedUser.username
      this.password = savedUser.password
    }
    this.url = this.arrayImg[this.getRandomNumber()]
  }
  getRandomNumber() : number {
    return Math.floor(Math.random() * (0 - 5) + 5);
  }

  onSubmit() {
    this.btnIngresar = "Validando..."
    this.msgError = ""
    this.authService.loginSubscriber(this.username, this.password).subscribe(
      (response) => {
        console.log(response)
        if(response === true){
          console.log('si')
          const cacheData = {
            saveUser : this.recordarUsuario,
            username : this.username,
            password : this.password
          };
          localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
          console.log('/intranet/online')
          this.router.navigate(['/intranet/online']);
        }else{
          console.log('no')
          this.msgError = "Usuario o Contraseña incorrecta"

        }
      },(error) => {
        console.log(error)
      }
    ).add(
      () => {

        this.btnIngresar = "Ingresar"
      }
    )
  }
  enter(event : any){
    if(event.code == 'Enter'){
      this.onSubmit()
    }
  }
  focusPassword(event : any){
    console.log("hola")
    if(event.code == 'Enter'){
      const input = document.getElementById('id_password') as HTMLElement | null;
    if(input){
            input.focus()
          }
    }
  }
}
