import { MatTableDataSource } from '@angular/material/table';
import { HistoricoPedidosService } from '../../../../../../services/informes/historico-pedidos.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { HistoricoPedidos } from 'app/models/informes/historico-pedidos';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { HistorialPedido } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-historico-pedidos',
  templateUrl: './historico-pedidos.component.html',
  styleUrls: ['./historico-pedidos.component.scss'],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class HistoricoPedidosComponent implements OnInit {
  accion = ""
  titulo = ""
  idCompany = 0
  columnsToDisplay = ['tipo', 'cupon', 'nombreSolicitado','nombreDespachado', 'despacho', 'abonado', 'tramite'];
  dataSource: MatTableDataSource<HistorialPedido>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor( private ticketService : TicketService,
    public dialogRef: MatDialogRef<HistoricoPedidosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private historicoPedidosService : HistoricoPedidosService
  ){
    this.titulo = data.titulo
    this.idCompany = data.id
    this.dataSource = new MatTableDataSource()
  }
  ngOnInit(): void {
    this.ticketService.getTipoReporte(this.idCompany, 'E').subscribe(
      (response) => {
        console.log(response)
        if(response.isSuccess === true && response.isWarning === false){
          const tipoReporte = response.data
          if(tipoReporte){
           
            this.dataSource.data = tipoReporte.listSameSearched
            this.dataSource.sort = this.sort
            this.dataSource.paginator = this.paginator
          }
        }
      }
    )
  }


  volver(){
    this.dialogRef.close()
  }

}
