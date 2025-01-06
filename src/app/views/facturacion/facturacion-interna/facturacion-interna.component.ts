import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { EnviarComplementoComponent } from 'app/dashboard/produccion-mensual/enviar-complemento/enviar-complemento.component';
import { GetCycles, Query5_1_2ByCycle, Query5_1_2Tickets } from 'app/models/consulta';
import { GetPersonalToInvoice } from 'app/models/facturacion';
import { ConsultaService } from 'app/services/Consultas/consulta.service';
import { InvoiceService } from 'app/services/Facturacion/invoice.service';
import { HistorialPedidoComponent } from 'app/views/situacion/lista/historial-pedido/historial-pedido.component';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-facturacion-interna',
    templateUrl: './facturacion-interna.component.html',
    styleUrls: ['./facturacion-interna.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class FacturacionInternaComponent implements OnInit{
  breadscrums = [
    {
      title: 'Facturación Interna',
      items: ['Facturación'],
      active: 'Interna',
    },
  ];

  idUserSelected = 0
  codeUserSelected = ""
  type = "RP"
  cycle = ""
  cycles : GetCycles[] = []
  totalPrice = 0;

  personals : GetPersonalToInvoice[] = []

  dataSource = new MatTableDataSource<GetPersonalToInvoice>();
  columnsDS = ['code','firstName','select']

  abonados2 : Query5_1_2ByCycle[] = []
  dataSource2= new MatTableDataSource<Query5_1_2Tickets>;
  contador : Query5_1_2Tickets[] = [];
  columnsToDisplay2 = ['number','requestedName','status','country','reportType','procedureType','price','orderDate', 'expireDate', 'Acciones' ];
  columnsToDisplayWithExpand2 = [...this.columnsToDisplay2, 'expand'];
  expandedOrder2: Query5_1_2Tickets | null = null;


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  loading = false
  idUser = 0

  constructor(private consultaService : ConsultaService, private invoiceService : InvoiceService, private dialog : MatDialog){
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
          this.cycle = response.data[0].code
        }
      })
      this.invoiceService.GetPersonalToInvoice().subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.personals = response.data
            this.filterType(this.type)
            console.log(this.personals)
          }
        }
      )
  }
  filterType(type : string){
    this.codeUserSelected = ""
    this.dataSource.data = this.personals.filter(x => x.type === type)
    this.dataSource.sort = this.sort
    this.dataSource2.data = []
  }
  selectPersonal(idUser : number, code : string){
    this.idUserSelected = idUser
    console.log(idUser)
    this.codeUserSelected = code
    this.consultaService.GetQuery5_1_2MonthlyByCycle(this.idUserSelected+'',this.cycle, code.trim()).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.abonados2 = []
          this.abonados2 = response.data

        console.log(response.data)
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
        this.dataSource2.paginator = this.paginator
        this.dataSource2.sort = this.sort
      }
    )
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
  precioTotal(dataSource : Query5_1_2Tickets[]) : number{
    let price = 0
    dataSource.forEach(element => {
      price += element.price
    });
    this.totalPrice = price
    return price;
  }
  calidad(obj : Query5_1_2Tickets) : string{
    let calidad = ""
    if(obj.asignationType === 'RP'){
      calidad = obj.quality
    }else if(obj.asignationType === 'DI'){
      calidad = obj.qualityTypist
    }else if(obj.asignationType === 'TR'){
      calidad = obj.qualityTraductor
    }else if(obj.asignationType === "RF"){
      calidad = obj.quality
    }
    return calidad;
  }
  guardar(){
    Swal.fire({
      title: '¿Está seguro de guardar esta facturación?',
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
        this.invoiceService.SaveInternalInvoice(this.type,this.codeUserSelected,this.cycle,this.totalPrice,this.dataSource2.data).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){

              this.loading = false
              Swal.fire({
                title: 'Se guardo la facturación correctamente',
                icon: 'success',
                width: '20rem',
                heightAuto : true
              })
            }else{
              this.loading = false
              Swal.fire({
                title: 'Error al guardar. Contactar con sistemas.',
                icon: 'error',
                width: '20rem',
                heightAuto : true
              })
            }
          },(error) => {
            this.loading = false
            Swal.fire({
              title: 'Error al guardar. Contactar con sistemas.',
              icon: 'error',
              width: '20rem',
              heightAuto : true
            })
          }
        )
      }
    })
  }
  enviarReporte(){
    Swal.fire({
      title: '¿Está seguro de enviar esta facturación?',
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
        this.invoiceService.ReportEmployee(this.idUser,this.codeUserSelected,this.type,this.cycle).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){

              this.loading = false
              Swal.fire({
                title: 'Se envio el reporte correctamente',
                icon: 'success',
                width: '20rem',
                heightAuto : true
              })
            }else{
              this.loading = false
              Swal.fire({
                title: 'Error al enviar el reporte. Contactar con sistemas.',
                icon: 'error',
                width: '20rem',
                heightAuto : true
              })
            }
          },(error) => {
            this.loading = false
            Swal.fire({
              title: 'Error al enviar el reporte. Contactar con sistemas.',
              icon: 'error',
              width: '20rem',
              heightAuto : true
            })
          }
        )
      }
    })
  }



}
