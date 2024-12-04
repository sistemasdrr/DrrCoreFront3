import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pedido } from 'app/models/pedidos/pedido';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { ListTicket } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';
import { AdjuntarArchivosComponent } from '@shared/components/adjuntar-archivos/adjuntar-archivos.component';
import { DetalleComponent } from './detalle/detalle.component';



@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ],
  animations: [
    trigger ('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ListaComponent implements OnInit {
  breadscrums = [
    {
      title: 'Despacho de Informes Pendientes',
      items: ['Producción'],
      active: 'Despacho',
    },
  ];

  idUser = 0
  loading = false

  dataSource: MatTableDataSource<ListTicket>;
  columnsToDisplay = ['number', 'busineesName','subscriberCode', 'status', 'reportType', 'procedureType', 'origen', 'orderDate', 'expireDate', 'Acciones' ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedOrder: Pedido | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private ticketService : TicketService,public dialog: MatDialog, private datosEmpresaService : DatosEmpresaService){
    this.dataSource = new MatTableDataSource()
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    if(auth){
      this.idUser = parseInt(auth.idUser)
    }
  }

  ngOnInit(): void {
    const loader = document.getElementById('loader-lista-despacho') as HTMLElement | null;
    if(loader){
      loader.classList.remove('hide-loader');
    }
    this.ticketService.getListToDispatch().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSource.data = response.data
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        }
      }).add(() => {
        if(loader){
          loader.classList.add('hide-loader');
        }
      })
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
  detalleInforme(idTicket : number){
    const dialogRef = this.dialog.open(DetalleComponent, {
      data: {
        idTicket: idTicket,
        idUser: this.idUser,
      },
    }).afterClosed().subscribe(result=>{
      this.ngOnInit();
    })

  
  }
  // enviarInforme(id : number){
  //   const loader = document.getElementById('loader-lista-despacho') as HTMLElement | null;

  //   console.log(this.idUser)
  //   Swal.fire({
  //     title: '¿Está seguro de despachar este pedido?',
  //     text: "",
  //     icon: 'warning',
  //     showCancelButton: true,
  //     cancelButtonText : 'No',
  //     confirmButtonColor: '#3085d6',
  //     cancelButtonColor: '#d33',
  //     confirmButtonText: 'Sí',
  //     width: '20rem',
  //     heightAuto : true
  //   }).then((result) => {
  //     if(result.value){
  //       if(loader){
  //         loader.classList.remove('hide-loader');
  //       }
  //       this.ticketService.dispatchTicket(id, this.idUser).subscribe(
  //         (response) => {
  //           if(response.isSuccess === true && response.isWarning === false){
  //               Swal.fire({
  //                 title : 'El Pedido se envio correctamente',
  //                 icon : 'success',
  //                 width: '20rem',
  //                 heightAuto : true
  //               });
  //           }else{
  //             Swal.fire({
  //               title : 'Ocurrio un error al enviar el informe',
  //               text: response.message,
  //               icon : 'warning',
  //               width: '20rem',
  //               heightAuto : true
  //             });
  //           }
  //         },(error) => {
  //           Swal.fire({
  //             title : 'Ocurrio un error al enviar el informe',
  //             text: error,
  //             icon : 'error',
  //             width: '20rem',
  //             heightAuto : true
  //           });
  //         }
  //       ).add(
  //         () => {
  //           this.ticketService.getListToDispatch().subscribe(
  //             (response) => {
  //               if(response.isSuccess === true && response.isWarning === false){
  //                 this.dataSource.data = response.data
  //                 this.dataSource.paginator = this.paginator
  //                 this.dataSource.sort = this.sort
  //               }
  //             }).add(
  //               () => {
  //                 if(loader){
  //                   loader.classList.add('hide-loader');
  //                 }
  //               }
  //             )

  //         }
  //       )
  //     }
  //     }
  //   );

  // }
  consultar(ticket : ListTicket){

  }
  descargarDocumento(idTicket : number, oldCode : string, idioma : string, formato:string){
    const listaEmpresas = document.getElementById('loader-lista-despacho') as HTMLElement | null;
    if(listaEmpresas){
      listaEmpresas.classList.remove('hide-loader');
    }
    this.ticketService.DownloadF8ByIdTicket(idTicket,"E","pdf").subscribe(response=>{
      let blob : Blob = response.body as Blob;
      let a =document.createElement('a');
      const language = idioma === "I" ? "ENG" : "SPA"
      const extension = formato === "pdf" ? '.pdf' : formato === "word" ? '.doc' : '.xls'
      a.download= oldCode+"_"+language+"_"+Date.now()+extension;
      a.href=window.URL.createObjectURL(blob);
      a.click();
    }).add(
      () => {
        if(listaEmpresas){
          listaEmpresas.classList.add('hide-loader');
        }
      }
    );
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
}
