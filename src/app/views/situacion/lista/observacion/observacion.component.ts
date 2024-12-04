import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeLineTicket } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-observacion',
  templateUrl: './observacion.component.html',
  styleUrls: ['./observacion.component.scss']
})
export class ObservacionComponent implements OnInit {

  idTicket = 0
  timeLine : TimeLineTicket[] = []

  informe = ""
  abonado = ""
  supervisor = ""
  observaciones = ""
  idUser = 0
  constructor(public dialogRef: MatDialogRef<ObservacionComponent>,
    @Inject(MAT_DIALOG_DATA ) public data: any,private ticketService : TicketService){
      if(data){
        this.idTicket = parseInt(data.idTicket)
        console.log(this.idTicket)
      }
      const auth = JSON.parse(localStorage.getItem('authCache')+'')
      this.idUser = parseInt(auth.idUser)
      console.log(parseInt(auth.idUser))
 }

 ngOnInit(): void {
  this.ticketService.getTimeLine(this.idTicket).subscribe(
    (response) => {
      if(response.isSuccess === true && response.isWarning === false){
        this.timeLine = response.data
      }
    }
  )
  this.ticketService.getTicketObservations(this.idTicket).subscribe(
    (response) => {
      if(response.isSuccess === true && response.isWarning === false){
        this.informe = response.data.reportName
        this.abonado = response.data.subscriberCode
        this.supervisor = response.data.supervisor + ' | ' + response.data.nameSupervisor
      }
    }
  )
 }
 enviarObservacion(){
  console.log(this.idTicket)
  console.log(this.observaciones)
  console.log(this.idUser)
  Swal.fire({
    title: '¿Está seguro de enviar una observación sobre este Ticket?',
    text: "",
    icon: 'warning',
    showCancelButton: true,
    cancelButtonText : 'No',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí',
    width: '30rem',
    heightAuto : true
  }).then((result) => {
    if (result.value) {
      this.ticketService.addTicketObservations(this.idTicket,this.observaciones,this.idUser+'').subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            Swal.fire({
              title: 'Se realizo correctamente el envio de la observación al supervisor encargado del Ticket',
              text: "",
              icon: 'success',
              width: '30rem',
              heightAuto : true
            }).then(
              () => {
                this.dialogRef.close({success : true});
              }
            )

          }
        }
      )
    }
  })

 }
 salir(){
  this.dialogRef.close();
 }

}
