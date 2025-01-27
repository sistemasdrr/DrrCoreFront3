import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ticket } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-anulacion', 
  templateUrl: './anulacion.component.html',
  styleUrl: './anulacion.component.scss',
  animations: [
    trigger('detailExpand', [
        state('collapsed', style({ height: '0px', minHeight: '0' })),
        state('expanded', style({ height: '*' })),
        transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
],
standalone: false
})

export class AnulacionComponent implements OnInit {
  breadscrums = [
    {
      title: 'Anulación',
      items: ['Producción','Pedidos'],
      active: 'Anulación',
    },
  ];

razonSocial=''
cuponNumber=''
cupon=''
loading=false
idReason=0
idticket=0
columnsToDisplay = ['number','report', 'request','country','subscriber', 'reportType', 'procedureType', 'orderDate', 'expireDate', 'Acciones' ];
columnsToDisplayHis = ['agent','typeAgent', 'asignDate','endDate', 'Acciones' ];
dataSource: MatTableDataSource<any>;
dataSourceCodes: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
constructor(private ticketService : TicketService){
  this.dataSource = new MatTableDataSource();
  this.dataSourceCodes = new MatTableDataSource();
}
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
filtrarCupon(){
  this.loading=true;
  this.ticketService.getTicketToDelete(this.cupon==''?0:parseInt(this.cupon),this.razonSocial).subscribe(
    (response) => {
      if(response.isSuccess === true && response.isWarning === false){
        this.dataSource.data = response.data
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }
    }
  ).add(
    () => {
     this.loading=false;
    }
  )
}
limpiar(){
this.cupon = '';
this.razonSocial = '';
this.dataSource = new MatTableDataSource();
this.dataSourceCodes = new MatTableDataSource();
this.idReason = 0;
}
seleccionar(id:number,cupon:string){
  this.cuponNumber=cupon;
  this.idticket=id;
  this.loading=true;
  this.ticketService.getTicketHistoryToDelete(id).subscribe(
    (response) => {
      if(response.isSuccess === true && response.isWarning === false){
        this.dataSourceCodes.data = response.data
        this.dataSourceCodes.paginator = this.paginator
        this.dataSourceCodes.sort = this.sort
      }
    }
  ).add(
    () => {
     this.loading=false;
    }
  )
}
anular(id:number){
  this.loading=true;

     Swal.fire({
        title: '¿Está seguro que desea eliminar la asignación?',
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
  
        this.loading=true;
        this.ticketService.anularTicketHistory(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
             this.loading=false;
             Swal.fire({
              title: 'Se ha eliminado la asignación correctamente',
              text: '',
              icon: 'success',
              width: '30rem',
              heightAuto: true
            }).then(() => {
              this.seleccionar(this.idticket,this.cuponNumber);
              
            })
  
            }
          }
        )
    }else{
      this.loading=false;
    }
  })
  
}
anularTicket(){
  this.loading=true;

     Swal.fire({
        title: '¿Está seguro que desea anular el Ticket?',
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
  
        this.loading=true;
        this.ticketService.anularTicket(this.idticket,this.idReason).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
             this.loading=false;
             Swal.fire({
              title: 'Se ha anulado el ticket correctamente',
              text: '',
              icon: 'success',
              width: '30rem',
              heightAuto: true
            }).then(() => {
              this.loading=false;
              this.limpiar();
              
            })
  
            }
          }
        )
    }else{
      this.loading=false;
    }
  })
  
}
}
