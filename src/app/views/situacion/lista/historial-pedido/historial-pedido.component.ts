import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TimeLineTicket } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';

@Component({
    selector: 'app-historial-pedido',
    templateUrl: './historial-pedido.component.html',
    styleUrls: ['./historial-pedido.component.scss'],
    standalone: false
})
export class HistorialPedidoComponent implements OnInit {

  idTicket = 0
  timeLine : TimeLineTicket[] = []
  loading = false

  constructor(public dialogRef: MatDialogRef<HistorialPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private ticketService : TicketService){
      if(data){
        this.idTicket = parseInt(data.idTicket)
        console.log(this.idTicket)
      }
 }

 ngOnInit(): void {
  this.loading = true
  this.ticketService.getTimeLine(this.idTicket).subscribe(
    (response) => {
      if(response.isSuccess === true && response.isWarning === false){
        this.timeLine = response.data
      }
    }
  ).add(
    () => {
      this.loading = false
    }
  )
 }

 salir(){
  this.dialogRef.close();
 }

}
