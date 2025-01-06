import { TicketService } from './../../../services/pedidos/ticket.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { InvoiceService } from 'app/services/Facturacion/invoice.service';
import { ComboService } from 'app/services/combo.service';
import { AgenteService } from 'app/services/mantenimiento/agente.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AddInvoiceAgent, AgentInvoiceDetails, GetAgentInvoice, InvoiceAgentList, NewAgentInvoice } from 'app/models/facturacion';
import { Pais } from 'app/models/combo';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { EditarFacturaAgenteComponent } from './editar-factura-agente/editar-factura-agente.component';
import { MatDialog } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import Swal from 'sweetalert2';
import { CancelarFacturaComponent } from './cancelar-factura/cancelar-factura.component';
import { selection } from 'd3';

@Component({
    selector: 'app-facturacion-agente',
    templateUrl: './facturacion-agente.component.html',
    styleUrls: ['./facturacion-agente.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ],
    standalone: false
})
export class FacturacionAgenteComponent implements OnInit {
  breadscrums = [
    {
      title: 'Facturación de Agente',
      items: ['Facturación'],
      active: 'Agente',
    },
  ];

  loading = false

  byBill = true
  toCollect = false
  paids = false
  paises : Pais[] = []
  datosPorFacturar : InvoiceAgentList[] = []
  datosPorCobrar : GetAgentInvoice[] = []
  datosCobradas : GetAgentInvoice[] = []
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSourcePorFacturar = new MatTableDataSource<InvoiceAgentList>()
  dataSourcePorCobrar = new MatTableDataSource<GetAgentInvoice>()
  dataSourceCobradas = new MatTableDataSource<GetAgentInvoice>()

  dataSourcePedido1 = new MatTableDataSource<NewAgentInvoice>()
  dataSourcePedido2 = new MatTableDataSource<AgentInvoiceDetails>()
  dataSourcePedido3 = new MatTableDataSource<AgentInvoiceDetails>()

  columnsDS : string[] = ['agentCode','agentName','options']
  columnsPorCobrar : string[] = ['invoiceCode','options']
  columnsCobradas : string[] = ['invoiceCode','options']
  columnsDSP : string[] = ['select','number','requestedName','orderDate','shippingDate','expireDate','procedureType','quality', 'country','price','options']
  columnsDSPPorCobrar : string[] = ['id','requestedName','businessName','orderDate','shippingDate','expireDate', 'country','procedureType','price','options']
  columnsDSPCobradas : string[] = ['id','requestedName','businessName','orderDate','shippingDate','expireDate', 'country','procedureType','price','options']


  idAgentInvoice = 0
  //FACTURACION
  idAgent = 0
  invoiceNumber = ""
  invoiceDate : Date | null = new Date()
  name = ""
  code = ""
  address = ""
  attendedBy = ""
  idCountry = 0
  idCurrency =1
  bandera = ""
  language = ""
  exchangeRateSD = 0
  exchangeRateED = 0
  observations = ""
  additionalAmount = false
  concept = ""
  amount = 0

  attendedByName = ""
  attendedByEmail = ""

  //MODIFICACIONES
  import = 0
  orderDate : Date | null = null
  dispatchDate : Date | null = null
  procedureType = ""
  salesCheck = false
  reportName = ""
  //FILTRAR
  //POR FACTURAR
  range1 = new FormGroup({
    start: new FormControl<Date | null>(new Date()),
    end: new FormControl<Date | null>(new Date),
  });
  date = new Date()
  day = this.date.getDate();
  month = this.date.getMonth() + 1;
  year = this.date.getFullYear();

  startDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;
  endDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;

  //POR COBRAR
  range2 = new FormGroup({
    start: new FormControl<Date | null>(new Date()),
    end: new FormControl<Date | null>(new Date()),
  });

  //COBRADAS
  range3 = new FormGroup({
    start: new FormControl<Date | null>(new Date()),
    end: new FormControl<Date | null>(new Date()),
  });

  model : AddInvoiceAgent[] = []
  selection1 = new SelectionModel<NewAgentInvoice>(true, []);
  selection2 = new SelectionModel<AgentInvoiceDetails>(true, []);

  totalSelectedPrice1: number = 0;
  totalSelectedPrice2: number = 0;
  totalSelectedPrice3: number = 0;
  updateTotalPrice1() {
    this.totalSelectedPrice1 = this.selection1.selected.reduce((acc, curr) => acc + curr.price, 0);
  }
  updateTotalPrice2() {
    this.totalSelectedPrice2 = this.selection2.selected.reduce((acc, curr) => acc + curr.price, 0);
  }

  calcularInformes(procedureType : string, number : number) : number {
    if(number === 1){
      return this.dataSourcePedido1.data.filter(x => x.procedureType === procedureType).length;
    }else if( number === 2){
      return this.dataSourcePedido2.data.filter(x => x.procedureType === procedureType).length;
    }else if(number === 3){
      return this.dataSourcePedido3.data.filter(x => x.procedureType === procedureType).length;
    }else{
      return 0
    }
  }

  //1
isAllSelected1() {
  const numSelected = this.selection1.selected.length;
  const numRows = this.dataSourcePedido1.data.length;
  return numSelected === numRows;
}
toggleAllRows1() {
  if (this.isAllSelected1()) {
    this.selection1.clear();
    this.updateTotalPrice1();
    return;
  }
  this.selection1.select(...this.dataSourcePedido1.data);
  this.updateTotalPrice1();
}
checkboxLabel1(row?: NewAgentInvoice): string {
  if (!row) {
    return `${this.isAllSelected1() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.idTicketHistory + 1}`;
}
onCheckboxChange1(row: NewAgentInvoice) {
  this.selection1.toggle(row);
  this.updateTotalPrice1();
}

//2
isAllSelected2() {
  const numSelected = this.selection2.selected.length;
  const numRows = this.dataSourcePorCobrar.data.length;
  return numSelected === numRows;
}
toggleAllRows2() {
  if (this.isAllSelected2()) {
    this.selection2.clear();
    return;
  }
  this.selection2.select(...this.dataSourcePedido2.data);
  this.updateTotalPrice2();
}
checkboxLabel2(row?: AgentInvoiceDetails): string {
  if (!row) {
    return `${this.isAllSelected2() ? 'deselect' : 'select'} all`;
  }
  return `${this.selection2.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
}
onCheckboxChange2(row: AgentInvoiceDetails) {
  this.selection2.toggle(row);
  this.updateTotalPrice2();
}


armarModelo(){
  this.model[0] = {
    invoiceCode : this.invoiceNumber,
    invoiceDate : this.invoiceDate,
    language : this.language,
    idCurrency : this.idCurrency,
    idAgent : this.idAgent,
    agentCode : this.code,
    idCountry : this.idCountry,
    attendedByName : this.attendedByName,
    attendedByEmail : this.attendedByEmail,
    invoiceAgentList : this.selection1.selected
  }
}

  constructor(public dialog: MatDialog,private invoiceService : InvoiceService, private agenteService : AgenteService, private ticketService: TicketService
    ,private comboService : ComboService){
      this.dataSourcePorFacturar = new MatTableDataSource()
      this.dataSourcePorFacturar.sort = this.sort
  }
  ngOnInit(): void {
    this.loading = true
    this.comboService.getPaises().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.paises = response.data
        }
      },
      (error) => {
        console.log(error)
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }
  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
  private filterByDistinctAgent(invoices: InvoiceAgentList[]): InvoiceAgentList[] {
    const uniqueSubscribers = new Set();
    const distinctInvoices = [];

    for (const invoice of invoices) {
      if (!uniqueSubscribers.has(invoice.agentCode)) {
        uniqueSubscribers.add(invoice.agentCode);
        distinctInvoices.push(invoice);
      }
    }
    return distinctInvoices;
  }
  selectStartDate(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.startDate = this.formatDate(selectedDate);
    }
  }
  selectEndDate(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.endDate = this.formatDate(selectedDate);
    }
  }
  selectAgent(idAgent : number, code : string){

    this.selection1.clear();
    this.dataSourcePedido1.data = []
    this.idAgent = idAgent
    this.code = ""
    this.loading = true
    this.invoiceService.GetAgentInvoice(code, this.startDate, this.endDate).subscribe(
      (response) => {
        if(response.isSuccess){
          this.dataSourcePedido1.data = response.data
          this.dataSourcePedido1.sort = this.sort
        }
      }
    )
    this.agenteService.getAgentePorId(idAgent).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.name = response.data.name
          this.code = response.data.code
          this.address = response.data.address
          this.language = response.data.language
          this.idCountry = response.data.idCountry
          this.attendedByName = response.data.supervisor
          this.attendedByEmail = response.data.email
        }
      }
    ).add(
      () => {
        this.loading = false
      }
    )
    console.log(idAgent)
    console.log(this.datosPorFacturar)
  }
  selectInvoice(obj : GetAgentInvoice){
    this.dataSourcePedido2.data = obj.details
    this.dataSourcePedido2.sort = this.sort
    this.totalSelectedPrice2 = 0
    this.dataSourcePedido2.data.forEach(element => {
      this.totalSelectedPrice2 += element.price
    });
    this.idAgent = obj.idAgent
    this.idAgentInvoice = obj.id
    this.invoiceNumber = obj.invoiceCode
    this.idCurrency = obj.idCurrency
    this.loading = true
    this.agenteService.getAgentePorId(obj.idAgent).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.name = response.data.name
          this.code = response.data.code
          this.address = response.data.address
          this.language = response.data.language
          this.idCountry = response.data.idCountry
          this.attendedByName = response.data.supervisor
          this.attendedByEmail = response.data.email
        }
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }
  selectInvoicePaids(obj : GetAgentInvoice){
    this.dataSourcePedido3.data = obj.details
    this.dataSourcePedido3.sort = this.sort
    this.totalSelectedPrice3 = 0
    this.dataSourcePedido3.data.forEach(element => {
      this.totalSelectedPrice3 += element.price
    });
    this.idAgent = obj.idAgent
    this.idAgentInvoice = obj.id
    this.invoiceNumber = obj.invoiceCode
    this.idCurrency = obj.idCurrency
    this.loading = true
    this.agenteService.getAgentePorId(obj.idAgent).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.name = response.data.name
          this.code = response.data.code
          this.address = response.data.address
          this.language = response.data.language
          this.idCountry = response.data.idCountry
          this.attendedByName = response.data.supervisor
          this.attendedByEmail = response.data.email
        }
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }
  editarPorFacturar(obj : NewAgentInvoice){
    const idTicketHistory = obj.idTicketHistory
    let price = 0
    const dialogRef = this.dialog.open(EditarFacturaAgenteComponent, {
      data : {
        idTicketHistory : obj.idTicketHistory,
        idAgent : obj.idAgent,
        idCountry : obj.idCountry,
        hasBalance : obj.hasBalance,
        idSpecialPrice : obj.idSpecialAgentBalancePrice,
        requestedName : obj.requestedName,
        procedureType : obj.procedureType,
        asignedTo : obj.asignedTo,
        quality : obj.quality,
        shippingDate : obj.shippingDate,
        price : obj.price
      }
    })
    dialogRef.afterClosed().subscribe(
      (data) => {
        if(data.success){
          this.selectAgent(this.idAgent, this.code)
        }
      }
    )
    //EJECUTAR ESTO LUEGO DE QUE SE HAYA TERMINADO DE EJECUTAR this.selectAgent(this.idAgent)
    //console.log(idTicketHistory)
    //this.dataSourcePedido.data.filter(x => x.idTicketHistory === idTicketHistory)[0].price = price
  }
  editarPorCobrar(obj : AgentInvoiceDetails){
    const idAgentInvoice = obj.id
    const dialogRef = this.dialog.open(EditarFacturaAgenteComponent, {
      data : {
        idAgentInvoice : obj.idAgentInvoice,
        idAgentInvoiceDetails : obj.id,
        requestedName : obj.requestedName,
        procedureType : obj.procedureType,
        shippingDate : obj.shippingDate,
        price : obj.price
      }
    })
    dialogRef.afterClosed().subscribe(
      (data) => {
        if(data.success){
          console.log(data)
          this.loading = true
          this.invoiceService.GetToCollectInvoiceAgentList(this.startDate,this.endDate).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSourcePorCobrar.data = response.data
                this.dataSourcePorCobrar.paginator = this.paginator
                this.dataSourcePorCobrar.sort = this.sort
              }
            },(error) => {
              console.log(error)
              this.loading = false
            }
          ).add(
            () => {
              this.dataSourcePedido2.data = this.dataSourcePorCobrar.data.filter(x => x.idAgent === this.idAgent)[0].details
              this.dataSourcePedido2.sort = this.sort

              this.agenteService.getAgentePorId(this.idAgent).subscribe(
                (response) => {
                  if(response.isSuccess === true && response.isWarning === false){
                    this.name = response.data.name
                    this.code = response.data.code
                    this.address = response.data.address
                    this.language = response.data.language
                    this.idCountry = response.data.idCountry
                    this.attendedByName = response.data.supervisor
                    this.attendedByEmail = response.data.email
                  }
                },(error) => {
                  console.log(error)
                  this.loading = false
                }
              ).add(
                () => {
                  this.loading = false
                }
              )
            }
          )
        }
      }
    )
  }

  descargarDocumento(code : string, startDate : string, endDate : string){
    this.loading = true
    this.invoiceService.GetExcelAgentInvoice(code,startDate,endDate).subscribe(response=>{
      let blob : Blob = response.body as Blob;
      let a =document.createElement('a');
      a.download= "Lista Por Facturar - " + code + ".xlsx";
      a.href=window.URL.createObjectURL(blob);
      a.click();
    }).add(
      () => {
        this.loading = false
      }
    );
  }

  cancelarFactura(){
    const dialogRef = this.dialog.open(CancelarFacturaComponent, {
      data : {
        idAgentInvoice : this.idAgentInvoice,
      }
    })
    dialogRef.afterClosed().subscribe(
      (data) => {
        if(data.success){
          console.log(data)
          this.loading = true
          this.invoiceService.GetToCollectInvoiceAgentList(this.startDate,this.endDate).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSourcePorCobrar.data = response.data
                this.dataSourcePorCobrar.paginator = this.paginator
                this.dataSourcePorCobrar.sort = this.sort
              }
            },(error) => {
              console.log(error)
              this.loading = false
            }
          ).add(
            () => {

              this.loading = false
            }
          )
        }
      }
    )
  }
  buscarPorFacturar(){
    this.loading = true
    this.invoiceService.GetByBillInvoiceAgentList(this.startDate,this.endDate).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.datosPorFacturar = response.data
          if(this.datosPorFacturar !== null){
            this.dataSourcePorFacturar = new MatTableDataSource<InvoiceAgentList>(this.filterByDistinctAgent(this.datosPorFacturar))
          }else{
            this.dataSourcePorFacturar.data = []
          }
          this.dataSourcePorFacturar.paginator = this.paginator
          this.dataSourcePorFacturar.sort = this.sort
        }
      },(error) => {
        console.log(error)
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
        if(this.idAgent !== 0){
          this.selectAgent(this.idAgent, this.code)
        }
      }
    )
  }
  buscarPorCobrar(){
    console.log(this.startDate)
    console.log(this.endDate)
    this.loading = true
    this.invoiceService.GetToCollectInvoiceAgentList(this.startDate,this.endDate).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.datosPorCobrar = response.data
          if(this.datosPorCobrar !== null){
            this.dataSourcePorCobrar = new MatTableDataSource<GetAgentInvoice>(this.datosPorCobrar)
          }else{
            this.dataSourcePorCobrar.data = []
          }
          this.dataSourcePorCobrar.paginator = this.paginator
          this.dataSourcePorCobrar.sort = this.sort
        }
      },(error) => {
        console.log(error)
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }

  buscarCobradas(){
    this.loading = true
    this.invoiceService.GetPaidsInvoiceAgentList(this.startDate,this.endDate).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.datosCobradas = response.data
          if(this.datosCobradas !== null){
            this.dataSourceCobradas = new MatTableDataSource<GetAgentInvoice>(this.datosCobradas)
          }else{
            this.dataSourceCobradas.data = []
          }
          this.dataSourceCobradas.paginator = this.paginator
          this.dataSourceCobradas.sort = this.sort
        }
      },(error) => {
        console.log(error)
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
        this.idAgentInvoice = 0
        this.invoiceNumber = ""
        this.name = ""
        this.code = ""
        this.address = ""
        this.attendedByName = ""
        this.attendedByEmail = ""
        this.idCountry = 0
        this.bandera = ""
        this.language = ""
        this.observations = ""
      }
    )
  }
  clear(index : number){
    console.log(index)
    if(index === 0){
      this.byBill = true
      this.toCollect = false
      this.paids = false
      if(this.range1.controls.start.value !== null && this.range1.controls.end.value !== null ){
        const startDateValue = new Date(this.range1.controls.start.value);
        const endDateValue = new Date(this.range1.controls.end.value);

        this.startDate = startDateValue.getDate().toString().padStart(2, '0') + "/"
          + (startDateValue.getMonth() + 1).toString().padStart(2, '0') + "/"
          + startDateValue.getFullYear();

        this.endDate = endDateValue.getDate().toString().padStart(2, '0') + "/"
          + (endDateValue.getMonth() + 1).toString().padStart(2, '0') + "/"
          + endDateValue.getFullYear();
      }

    }else if(index === 1){
      this.byBill = false
      this.toCollect = true
      this.paids = false
      if(this.range2.controls.start.value !== null && this.range2.controls.end.value !== null ){
        const startDateValue = new Date(this.range2.controls.start.value);
        const endDateValue = new Date(this.range2.controls.end.value);

        this.startDate = startDateValue.getDate().toString().padStart(2, '0') + "/"
          + (startDateValue.getMonth() + 1).toString().padStart(2, '0') + "/"
          + startDateValue.getFullYear();

        this.endDate = endDateValue.getDate().toString().padStart(2, '0') + "/"
          + (endDateValue.getMonth() + 1).toString().padStart(2, '0') + "/"
          + endDateValue.getFullYear();
      }
    }else if(index === 2){
      this.byBill = false
      this.toCollect = false
      this.paids = true
      if(this.range3.controls.start.value !== null && this.range3.controls.end.value !== null ){
        const startDateValue = new Date(this.range3.controls.start.value);
        const endDateValue = new Date(this.range3.controls.end.value);

        this.startDate = startDateValue.getDate().toString().padStart(2, '0') + "/"
          + (startDateValue.getMonth() + 1).toString().padStart(2, '0') + "/"
          + startDateValue.getFullYear();

        this.endDate = endDateValue.getDate().toString().padStart(2, '0') + "/"
          + (endDateValue.getMonth() + 1).toString().padStart(2, '0') + "/"
          + endDateValue.getFullYear();
      }
    }
    this.idAgentInvoice = 0
    this.dataSourcePorFacturar.data = []
    this.dataSourcePorCobrar.data = []
    this.dataSourceCobradas.data = []
    this.dataSourcePedido1.data = []
    this.dataSourcePedido2.data = []
    this.dataSourcePedido3.data = []
    this.invoiceNumber = ""
    this.name = ""
    this.code = ""
    this.address = ""
    this.attendedByName = ""
    this.attendedByEmail = ""
    this.idCountry = 0
    this.bandera = ""
    this.language = ""
    this.exchangeRateSD = 0
    this.exchangeRateED = 0
    this.observations = ""
    this.additionalAmount = false
    this.concept = ""
    this.amount = 0
    this.idAgent = 0
    this.idCurrency = 0
  }
  grabarFactura(){
    this.armarModelo()
    if(this.invoiceNumber.trim() === ''){
      Swal.fire({
        title: 'Campo Factura N° Obligatorio.',
        text: "",
        icon: 'error',
        width: '20rem',
        heightAuto : true
      })
    }else{
      console.log(this.model)
      console.log(this.selection1.selected)
      Swal.fire({
        title: '¿Está seguro de grabar esta factura?',
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
          this.invoiceService.AddInvoiceAgent(this.model[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title :'Se grabó correctamente la factura del Agente',
                  text : '',
                  icon : 'success',
                  width: '25rem',
                  heightAuto : true
                }).then(
                  () => {
                    this.loading = false
                    this.buscarPorFacturar()
                    this.clear(0)
                  }
                )
              }
            },
            (error) => {
              console.log(error)
              this.loading = false
            }
          )
        }
      });

    }

  }
}
