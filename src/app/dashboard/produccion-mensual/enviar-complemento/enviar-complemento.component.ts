import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'app/services/pedidos/ticket.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-enviar-complemento',
    templateUrl: './enviar-complemento.component.html',
    styleUrls: ['./enviar-complemento.component.scss'],
    standalone: false
})
export class EnviarComplementoComponent implements OnInit {

  idUser = 0
  asignedTo = ""
  idTicket = 0
  loading = false
  numOrden = ""
  message = ""

  constructor(public dialogRef: MatDialogRef<EnviarComplementoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private ticketService : TicketService){
      if(data){
        this.idUser = parseInt(data.idUser)
        this.idTicket = parseInt(data.idTicket)
        this.asignedTo = data.asignedTo
        console.log(this.data)
      }
  }
  ngOnInit(): void {
    this.ticketService.GetNumerationRefCom().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.numOrden = response.data
        }
      }
    )
  }
  enviar(){
    console.log(this.idUser)
    console.log(this.idTicket)
    console.log(this.asignedTo)
    console.log(this.numOrden)
    console.log(this.message)
    Swal.fire({
      title: '¿Está seguro de enviar un aviso de complemento?',
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
        this.loading=true;
        this.ticketService.SendComplementRefCom(this.idUser,this.idTicket,this.asignedTo,this.numOrden, this.message).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title :'¡Se envio el correo correctamente!',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.loading = false
                  this.dialogRef.close()
                }
              )
            }else{
              Swal.fire({
                title :'¡Ocurrio un problema. Contactar con Sistemas!',
                icon : 'error',
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
            Swal.fire({
              title :'¡Ocurrio un problema. Contactar con Sistemas!',
              icon : 'error',
              width: '20rem',
              heightAuto : true
            }).then(
              () => {
                this.loading = false
                this.dialogRef.close()
              }
            )
          }
        )
      }
    });
  }
 salir(){
  this.dialogRef.close()
 }
}
