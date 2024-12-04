import { TicketService } from 'app/services/pedidos/ticket.service';
import { animate, state, style, transition,trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ListTicket } from 'app/models/pedidos/ticket';
import { Pedido } from 'app/models/pedidos/pedido';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdjuntarArchivosComponent } from '@shared/components/adjuntar-archivos/adjuntar-archivos.component';
import { ConsultarComponent } from 'app/views/pedidos/lista/consultar/consultar.component';
import { HistorialPedidoComponent } from 'app/views/situacion/lista/historial-pedido/historial-pedido.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-observados',
  templateUrl: './lista-observados.component.html',
  styleUrls: ['./lista-observados.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ListaObservadosComponent implements OnInit {

  breadscrums = [
    {
      title: 'Lista de Cupones Observados',
      items: [],
      active: 'Dashboard',
    },
  ];

  loading = false
  idUser = 0
  idEmployee = 0

  dataSource: MatTableDataSource<ListTicket>;
  columnsToDisplay = ['number', 'busineesName','investigatedIsoCountry','subscriberCode', 'status', 'reportType', 'procedureType', 'origen', 'orderDate', 'expireDate', 'Acciones' ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedOrder: Pedido | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private ticketService : TicketService)
  {
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    if(auth){
      this.idUser = parseInt(auth.idUser)
      this.idEmployee = parseInt(auth.idEmployee)
    }
    this.dataSource = new MatTableDataSource();

  }

  ngOnInit() {
    this.ticketService.GetTicketObservedByIdEmployee(this.idEmployee).subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.dataSource.data = response.data
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        }
      }
    )
  }
  agregarAdjuntos(cod : string,cupon:string) {
    console.log(cod);
    const dialogRef = this.dialog.open(AdjuntarArchivosComponent, {
      data: {
        id: cod,
        cupon: cupon,
      },
  });
  console.log(dialogRef)
    // dialogRef.afterClosed().subscribe((codAbonado) => {
    //   if (codAbonado) {
    //     this.codAbonado = codAbonado.codigoAbonado
    //     this.asignarDatosAbonado()
    //   }
    // });
  }
  getColor(arg0: boolean,arg1: number): string {

    if(!arg0){
      return 'black';
    } else if(arg1===1){
       return'red';
    }else{
      return 'green';
    }

    }
    verHistorial(idTicket : number) {
      const dialogRef = this.dialog.open(HistorialPedidoComponent, {
        data : {
            idTicket : idTicket
        },
      });
  }
  porDespachar(idTicket : number){
    Swal.fire({
      title: '¿Está seguro de enviar a la Bandeja de Despacho?',
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
        this.ticketService.TicketToDispatchById(idTicket, true).subscribe(
          (response) => {
            if(response.isSuccess === true){
              Swal.fire({
                title: 'El Cupón se envió correctamente a la Bandeja de Despacho',
                text: "",
                icon: 'success',
                width: '20rem',
                heightAuto : true
              })
            }else{
              Swal.fire({
                title: 'Ocurrió un problema. Contactarse con Sistemas.',
                text: "",
                icon: 'error',
                width: '20rem',
                heightAuto : true
              })
            }
          }
        ).add(
          () => {
            this.loading = false;
            this.ngOnInit();
          }
        )
      }
    })
  }

  downloadReport(){
    this.loading=true;
    this.ticketService.downloadReport().subscribe(response=>{
      let blob : Blob = response.body as Blob;
      let a =document.createElement('a');
      a.download="ReporteTicket_"+Date.now();
      a.href=window.URL.createObjectURL(blob);
      a.target="_blank";
      a.click();
}).add(
  () => {
    this.loading = false
  }
);
}

}
