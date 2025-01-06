import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition,trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConsultaService } from 'app/services/Consultas/consulta.service';
import { Query5_1_2, Query5_1_2Tickets } from 'app/models/consulta';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HistorialPedidoComponent } from 'app/views/situacion/lista/historial-pedido/historial-pedido.component';

@Component({
    selector: 'app-produccion-diaria',
    templateUrl: './produccion-diaria.component.html',
    styleUrls: ['./produccion-diaria.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})

export class ProduccionDiariaComponent implements OnInit{

  breadscrums = [
    {
      title: 'Producción Diaria',
      items: ['Producción'],
      active: 'Diaria',
    },
  ];

  loading = false
  idUser = 0
  abonados2 : Query5_1_2[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private consultaService : ConsultaService,public dialog: MatDialog){
    this.dataSource2 = new MatTableDataSource()
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    if(auth){
      this.idUser = parseInt(auth.idUser)
    }
  }

  ngOnInit(): void {
    this.consultaService.GetQuery5_1_2Daily(this.idUser+'').subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.abonados2 = response.data
        }
      }
    ).add(
      () => {
        let tickets : Query5_1_2Tickets[] = []
        this.abonados2.forEach(element => {
          element.tickets.forEach(ticket => {
            tickets.push(ticket)
          });
        });
        tickets.sort((a, b) => {
          let numberA = parseInt(a.number, 10);
          let numberB = parseInt(b.number, 10);

          return numberA - numberB;
        });
        this.dataSource2.data = tickets
        this.dataSource2.paginator = this.paginator
        this.dataSource2.sort = this.sort
      }
    )
  }

  query5_1_2_idSubscriber = 0
  query5_1_2_number = ""
  query5_1_2_name = ""

  dataSource2: MatTableDataSource<Query5_1_2Tickets>;

  columnsToDisplay2 = ['number','requestedName','status','country','reportType','procedureType','orderDate', 'expireDate', 'Acciones' ];
  columnsToDisplayWithExpand2 = [...this.columnsToDisplay2, 'expand'];
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
  verHistorial(idTicket : number) {
    const dialogRef = this.dialog.open(HistorialPedidoComponent, {
      data : {
          idTicket : idTicket
      },
    });
  }
}
