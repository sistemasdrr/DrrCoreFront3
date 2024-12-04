import { animate, state, style, transition,trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Query5_1_1, Query5_1_1Tickets,Query5_1_2,Query5_1_2Tickets } from 'app/models/consulta';
import { ConsultaService } from 'app/services/Consultas/consulta.service';
import { HistorialPedidoComponent } from 'app/views/situacion/lista/historial-pedido/historial-pedido.component';
import Swal from 'sweetalert2';
import { ComplementoComponent } from './complemento/complemento.component';
import { AdjuntarArchivosComponent } from '@shared/components/adjuntar-archivos/adjuntar-archivos.component';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class InformesComponent implements OnInit{
  breadscrums = [
    {
      title: 'Consultas de Informes',
      items: ['Consultas'],
      active: 'Informes',
    },
  ];

  loading = false


  abonados : Query5_1_1[] = []
  abonados2 : Query5_1_2[] = []

  idQuery = 1
  idUser = 0

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private consultaService : ConsultaService,public dialog: MatDialog){
    this.dataSource1 = new MatTableDataSource()
    this.dataSource2 = new MatTableDataSource()
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    if(auth){
      this.idUser = parseInt(auth.idUser)
    }
  }
  ngOnInit(): void {
    this.consultaService.GetQuery5_1_1().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.abonados = response.data
        }
      }
    )
    this.consultaService.GetQuery5_1_2(this.idUser+'').subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.abonados2 = response.data
        }
      }
    )
  }

  limpiar1(){
    this.query5_1_1_idSubscriber = 0
    this.query5_1_1_number = ""
    this.query5_1_1_name = ""
    this.dataSource1.data = []
  }
  buscar1(){
    let tickets : Query5_1_1Tickets[] = []
    this.abonados.forEach(element => {
      element.tickets.forEach(ticket => {
        if(ticket.requestedName.toLocaleLowerCase().includes(this.query5_1_1_name.toLocaleLowerCase()) && ticket.number.includes(this.query5_1_1_number)){
          tickets.push(ticket)
        }
      });
    });
    tickets.sort((a, b) => {
      let numberA = parseInt(a.number, 10);
      let numberB = parseInt(b.number, 10);

      return numberA - numberB;
    });
    this.query5_1_1_idSubscriber = 0
    this.dataSource1.data = tickets
    this.dataSource1.paginator = this.paginator
    this.dataSource1.sort = this.sort
  }
  limpiar2(){
    this.query5_1_2_idSubscriber = 0
    this.query5_1_2_number = ""
    this.query5_1_2_name = ""
    this.dataSource2.data = []
  }
  buscar2(){
    let tickets : Query5_1_2Tickets[] = []
    this.abonados2.forEach(element => {
      element.tickets.forEach(ticket => {
        if(ticket.requestedName.toLocaleLowerCase().includes(this.query5_1_2_name.toLocaleLowerCase()) && ticket.number.includes(this.query5_1_2_number)){
          tickets.push(ticket)
        }
      });
    });
    tickets.sort((a, b) => {
      let numberA = parseInt(a.number, 10);
      let numberB = parseInt(b.number, 10);

      return numberA - numberB;
    });
    this.query5_1_2_idSubscriber = 0
    this.dataSource2.data = tickets
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort
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
  query5_1_1_idSubscriber = 0
  query5_1_1_number = ""
  query5_1_1_name = ""

  dataSource1: MatTableDataSource<Query5_1_1Tickets>;

  columnsToDisplay1 = ['number','requestedName','status','quality','country','reportType','procedureType','orderDate', 'expireDate', 'Acciones' ];
  columnsToDisplayWithExpand1 = [...this.columnsToDisplay1, 'expand'];
  expandedOrder: Query5_1_1Tickets | null = null;

  query5_1_1_selectSubscriber(idSubscriber : number){
    console.log(this.abonados.filter(x => x.id === idSubscriber)[0].tickets)
    this.dataSource1.data = this.abonados.filter(x => x.id === idSubscriber)[0].tickets
    this.dataSource1.data.sort((a, b) => {
      let numberA = parseInt(a.number, 10);
      let numberB = parseInt(b.number, 10);

      return numberA - numberB;
    });
    this.dataSource1.paginator = this.paginator
    this.dataSource1.sort = this.sort
  }
  verHistorial(idTicket : number) {
    const dialogRef = this.dialog.open(HistorialPedidoComponent, {
      data : {
          idTicket : idTicket
      },
    });
  }
  enviarComplemento(idTicket : number) {
    const dialogRef = this.dialog.open(ComplementoComponent, {
      data : {
          idTicket : idTicket
      },
    });
  }
  enviarAlerta(idTicket : number){
    Swal.fire({
      title: '¿Está seguro de enviar una alerta?',
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
        this.consultaService.SendTicketAlert(idTicket,this.idUser).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.loading = false
              Swal.fire({

                title : 'Se realizo correctamente el envio.',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              });
            }else{
              this.loading = false
              Swal.fire({
                title : 'Error al realizar la solicitud',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              });
            }
          },(error) => {
            this.loading = false
            Swal.fire({
              text : error,
              icon : 'success',
              width: '20rem',
              heightAuto : true
            });
          }
        )


      }
    });
  }



  query5_1_2_idSubscriber = 0
  query5_1_2_number = ""
  query5_1_2_name = ""

  dataSource2: MatTableDataSource<Query5_1_2Tickets>;

  columnsToDisplay2 = ['number','requestedName','status','quality','country','reportType','procedureType','orderDate', 'expireDate', 'Acciones' ];
  columnsToDisplayWithExpand2 = [...this.columnsToDisplay1, 'expand'];
  expandedOrder2: Query5_1_2Tickets | null = null;

  query5_1_2_selectSubscriber(idSubscriber : number){
    console.log(this.abonados2.filter(x => x.id === idSubscriber)[0].tickets)
    this.dataSource2.data = this.abonados2.filter(x => x.id === idSubscriber)[0].tickets
    this.dataSource2.data.sort((a, b) => {
      let numberA = parseInt(a.number, 10);
      let numberB = parseInt(b.number, 10);

      return numberA - numberB;
    });
    this.dataSource2.paginator = this.paginator
    this.dataSource2.sort = this.sort
  }
}
