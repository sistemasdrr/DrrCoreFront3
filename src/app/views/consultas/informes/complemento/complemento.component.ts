import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'app/services/pedidos/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-complemento',
  templateUrl: './complemento.component.html',
  styleUrls: ['./complemento.component.scss']
})
export class ComplementoComponent implements OnInit {

  loading = false
  idTicket = 0

  supervisor = ''

  digitado = false
  archivo = false
  idUser = 0
  userFrom = ""
  observations = ""

  asignedTo = ""

  listaUsuarios : string[] = []

  constructor(public dialogRef: MatDialogRef<ComplementoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private ticketService : TicketService){
      if(data){
        this.idTicket = parseInt(data.idTicket)
        console.log(this.idTicket)
      }
      const auth = JSON.parse(localStorage.getItem('authCache')+'')
    this.userFrom = auth.idUser
    this.idUser = auth.idUser
  }
  ngOnInit(): void {
    this.ticketService.GetSupervisorTicket(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.supervisor = response.data
        }
      }
    )
    this.ticketService.GetUsersInTicket(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.listaUsuarios = response.data
        }
      }
    )
  }
  salir(){
    this.dialogRef.close()
  }
  enviar(){
    if(this.asignedTo === ""){
      Swal.fire({
        title: 'Seleccione el código de usuario que enviara el complemento.',
        text: "",
        icon: 'error',
        width: '20rem',
        heightAuto : true
      })
    }else{
      let newObservations = ""
      if(this.archivo || this.digitado){
        newObservations = this.observations + '  \n\nSe realizaron las siguientes modificaciones: \n'+this.textComplement
      }
      console.log(this.idTicket)
      console.log(this.idUser)
      console.log(this.digitado)
      console.log(this.archivo)
      console.log(this.asignedTo)
      console.log(newObservations)
      Swal.fire({
        title: '¿Está seguro de enviar el complemento al supervisor?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText : 'No',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        width: '20rem',
        heightAuto : true
      }).then((result) => {
        if (result.value) {

      this.loading = true
          this.ticketService.SendComplement(this.idTicket,this.idUser,this.digitado,this.archivo,newObservations,this.asignedTo).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title: 'Se envio el complemento al supervisor correctamente.',
                  text: "",
                  icon: 'success',
                  width: '20rem',
                  heightAuto : true
                }).then(
                  () => {
                    this.loading = false
                    this.dialogRef.close()
                  }
                )
              }
            },(error) => {
              this.loading = false
              this.dialogRef.close()
            }
          )
        }
      })
    }

  }
  textComplement = ""
  verificarDigitado() {
    this.textComplement = ""; // Reiniciar el texto complementario
    if (this.digitado) {
      if(this.archivo){
        this.textComplement = "-Digitado y Archivo";
      }else{
        this.textComplement = "-Digitado";
      }
       // Agregar texto si digitado es true
    }
    if (this.archivo) {
      if(this.digitado){
        this.textComplement = "-Digitado y Archivo";
      }else{
        this.textComplement = "-Archivo";
      }
       // Agregar texto si archivo es true
    }
  }

  verificarArchivo() {
    this.verificarDigitado(); // Llamar a verificarDigitado para mantener la lógica
  }
}
