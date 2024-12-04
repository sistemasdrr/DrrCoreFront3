import { GetCycles, Query5_1_2ByCycle } from './../../models/consulta';
import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition,trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { ConsultaService } from 'app/services/Consultas/consulta.service';
import { Query5_1_2, Query5_1_2Tickets } from 'app/models/consulta';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HistorialPedidoComponent } from 'app/views/situacion/lista/historial-pedido/historial-pedido.component';
import { EnviarComplementoComponent } from './enviar-complemento/enviar-complemento.component';
import { OtherUserCode } from 'app/models/pedidos/ticket';

@Component({
  selector: 'app-produccion-mensual',
  templateUrl: './produccion-mensual.component.html',
  styleUrls: ['./produccion-mensual.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ProduccionMensualComponent implements OnInit{
  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Producción'],
      active: 'Mensual',
    },
  ];

  loading = false
  idUser = 0

  date = new Date()
  month = this.date.getMonth() + 1;
  codeCycle = ""
  cycles : GetCycles[] = []
  userCodes : string[] = []
  userCode = ""
  abonados2 : Query5_1_2ByCycle[] = []

  contador : Query5_1_2Tickets[] = []


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
    this.consultaService.GetCycles().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.cycles = response.data
          this.codeCycle = response.data[0].code
        }
      }).add(
        () => {
          this.consultaService.GetUserCode(this.idUser).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.userCodes = response.data
              }
            })

          this.consultaService.GetQuery5_1_2MonthlyByCycle(this.idUser+'',this.codeCycle,'').subscribe(
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
              this.contador = tickets
              console.log(this.contador)
              this.dataSource2.paginator = this.paginator
              this.dataSource2.sort = this.sort
            }
          )
        }
      )

  }
  activeQuality(obj : OtherUserCode[]){
    let active = false;
    obj.forEach(element => {
      if(element.code.includes('S') && element.active === true){
        active = true
      }
    });
    return active
  }
  search(cycle : string){
    this.userCode = ""
    this.loading = true
    this.consultaService.GetQuery5_1_2MonthlyByCycle(this.idUser+'',cycle,'').subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.abonados2 = response.data
        }
      }
    ).add(
      () => {
        this.loading = false
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
        this.contador = tickets
        this.dataSource2.paginator = this.paginator
        this.dataSource2.sort = this.sort
      }
    )
  }
  getNumReports(asignedTo : string) : number{
    let number = 0;
    number = this.contador.filter(x => x.asignedTo.trim() === asignedTo.trim()).length
    return number
  }
  getPriceReports(asignedTo : string) : number{
    let number = 0;
    this.contador.filter(x => x.asignedTo.trim() === asignedTo.trim()).forEach(element => {
      number += element.price
    });
    return number
  }

  query5_1_2_idSubscriber = 0
  query5_1_2_number = ""
  query5_1_2_name = ""

  dataSource2: MatTableDataSource<Query5_1_2Tickets>;

  columnsToDisplay2 = ['number','requestedName','asignedTo','status','country','reportType','procedureType','price','orderDate', 'expireDate', 'Acciones' ];
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
  updateTable(userCode : string){
    this.dataSource2.data=[]
    let tickets : Query5_1_2Tickets[] = []
    this.abonados2.forEach(element1 => {
      element1.tickets.forEach(element => {
        console.log(element.asignedTo + ' - ' + userCode)
        if(element.asignedTo.trim() === userCode.trim()){

          tickets.push(element)
        }
      });
    });
    console.log(tickets)
    this.dataSource2.data= tickets
  }
  verHistorial(idTicket : number) {
    const dialogRef = this.dialog.open(HistorialPedidoComponent, {
      data : {
          idTicket : idTicket
      },
    });
  }
  enviarComplemento(idTicket : number, asignedTo : string){
    const dialogRef = this.dialog.open(EnviarComplementoComponent, {
      data : {
        idUser : this.idUser,
        asignedTo : asignedTo,
        idTicket : idTicket
      },
    });
  }
  getTotalPrice(tickets : Query5_1_2Tickets[]) : number{
    let price = 0

    tickets.forEach(element => {
      price = price + element.price
    });

    return price;
  }
}
