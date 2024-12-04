import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TicketService } from 'app/services/pedidos/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-concluir-observacion',
  templateUrl: './concluir-observacion.component.html',
  styleUrls: ['./concluir-observacion.component.scss']
})
export class ConcluirObservacionComponent implements OnInit{

  idTicketObservation = 0

  conclusion = ""
  dr = false
  ag = false
  cl = false
  na = false

  constructor(public dialogRef: MatDialogRef<ConcluirObservacionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private ticketService : TicketService){

      if(data){
        this.idTicketObservation = parseInt(data.idTicketObservation)
        console.log(this.idTicketObservation)
      }
  }
  ngOnInit(): void {

  }
  ninguno(){
    if(this.na === true){
      this.dr = false
      this.ag = false
      this.cl = false
    }
  }
  concluirObservacion(){
    console.log(this.idTicketObservation)
    console.log(this.conclusion)
    console.log(this.dr)
    console.log(this.ag)
    console.log(this.cl)
    Swal.fire({
      title: '¿Está seguro de concluir esta observación?',
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
        this.ticketService.FinishTicketObservation(this.idTicketObservation,this.conclusion,this.dr,this.ag,this.cl).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title: 'Se concluyo la observación correctamente',
                text: "",
                icon: 'success',
                width: '20rem',
                heightAuto : true
              }).then(() => {
                this.dialogRef.close()
              })
            }
          }
        )
      }
    })
  }
  salir(){
    this.dialogRef.close()
  }
}
