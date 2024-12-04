import { SelectionModel } from '@angular/cdk/collections';
import { AddInvoiceSubscriber, InvoiceDetailsSubcriberToCollect, InvoiceSubcriberListByBill, InvoiceSubcriberListPaids, InvoiceSubcriberListToCollect } from './../../../../models/facturacion';
import { InvoiceService } from './../../../../services/Facturacion/invoice.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pais } from 'app/models/combo';
import { ComboService } from 'app/services/combo.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { CancelarFacturaAbonadoComponent } from './cancelar-factura-abonado/cancelar-factura-abonado.component';
import { EditarPorFacturarComponent } from './editar-por-facturar/editar-por-facturar.component';
import { EditarPorCobrarAbonadoComponent } from './editar-por-cobrar/editar-por-cobrar.component';

export interface dataAbonado{
  id : number
  code : string
  name : string
}
export interface dataPedido{
  id : number
  cupon : string
  name : string
  orderDate : string
  dispatchDate : string
  procedureType : string
  country : string
  price : number
}

@Component({
  selector: 'app-facturacion-mensual',
  templateUrl: './facturacion-mensual.component.html',
  styleUrls: ['./facturacion-mensual.component.scss']
})
export class FacturacionMensualComponent implements OnInit, AfterViewInit {
  breadscrums = [
    {
      title: 'Facturación Mensual de Abonado',
      items: ['Facturación'],
      active: 'Abonado',
    },
  ];

  loading = false
  paises : Pais[] = []

  model : AddInvoiceSubscriber[] = []

  datos : InvoiceSubcriberListByBill[] = []
  dataSource1 = new MatTableDataSource<InvoiceSubcriberListByBill>
  dataSource2 = new MatTableDataSource<InvoiceSubcriberListToCollect>
  dataSource3 = new MatTableDataSource<InvoiceSubcriberListPaids>

  selection1 = new SelectionModel<InvoiceSubcriberListByBill>(true, []);


  dataSourcePedido1 = new MatTableDataSource<InvoiceSubcriberListByBill>()
  dataSourcePedido2 = new MatTableDataSource<InvoiceDetailsSubcriberToCollect>()
  dataSourcePedido3 = new MatTableDataSource<InvoiceDetailsSubcriberToCollect>()
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnsByBill : string[] = ['subscriberCode','subscriberName','opciones']
  columnsToCollect : string[] = ['invoiceCode','opciones']
  columnsPaids : string[] = ['invoiceCode','opciones']

  columnsInvoiceByBill : string[] = ['select','number','requestedName','referenceNumber','orderDate','dispatchDate','procedureType', 'country','price','options']
  columnsInvoiceToCollect : string[] = ['ticket','name','orderDate','dispatchDate','referenceNumber','country','procedureType','price','options']
  columnsInvoicePaids : string[] = ['ticket','name','orderDate','dispatchDate','referenceNumber','country','procedureType','price']

  fechaDesde : Date | null = new Date()
  fechaHasta : Date = new Date()

  //FACTURACION
  invoiceNumber = ""
  invoiceDate : Date | null = new Date()
  idSubscriber = 0
  name = ""
  code = ""
  address = ""
  taxTypeCode = ""
  exchangeRate = 1;
  attendedByName = ""
  attendedByEmail = ""
  idCountry = 0
  bandera = ""
  idCurrency = 0
  language = ""

  //MODIFICACIONES
  import = 0
  orderDate : Date | null = null
  dispatchDate : Date | null = null
  procedureType = ""
  salesCheck = false
  reportName = ""

  //FILTRAR
  //POR FACTURAR
  range = new FormGroup({
    start: new FormControl<Date | null>(new Date),
    end: new FormControl<Date | null>(new Date),
  });
  date = new Date()
  day = this.date.getDate();
  month = this.date.getMonth() + 1;
  year = this.date.getFullYear();

  startDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;
  endDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;

  //POR COBRAR
  monthPC = 1
  yearPC = 2024

  //COBRADAS
  monthC = 1
  yearC = 2024

  igv1 = 0
  igvFlag = false;

  //1
  isAllSelected1() {
    const numSelected = this.selection1.selected.length;
    const numRows = this.dataSourcePedido1.data.length;
    this.updateTotalPrice1()
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
  checkboxLabel1(row?: InvoiceSubcriberListByBill): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.idTicket + 1}`;
  }
  onCheckboxChange1(row: InvoiceSubcriberListByBill) {
    this.selection1.toggle(row);
    this.updateTotalPrice1();
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

  constructor(private invoiceService : InvoiceService, private abonadoService : AbonadoService,
    private comboService : ComboService, private dialog : MatDialog
  ){
    this.dataSource1 = new MatTableDataSource()
    this.dataSourcePedido1.sort = this.sort

  }
  ngOnInit(): void {
    this.loading = true
    this.invoiceService.GetInvoiceNumber().subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.invoiceNumber = response.data + ''
        }
      }
    )
    this.comboService.getPaises().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.paises = response.data
        }
      },(error) => {
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }

  ngAfterViewInit() {
    this.dataSourcePedido1.paginator = this.paginator;
    this.dataSourcePedido1.sort = this.sort;
  }
  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
  private filterByDistinctSubscriber(invoices: InvoiceSubcriberListByBill[]): InvoiceSubcriberListByBill[] {
    const uniqueSubscribers = new Set();
    const distinctInvoices = [];

    for (const invoice of invoices) {
      if (!uniqueSubscribers.has(invoice.idSubscriber)) {
        uniqueSubscribers.add(invoice.idSubscriber);
        distinctInvoices.push(invoice);
      }
    }
    return distinctInvoices;
  }

  descargarTramo(){
    Swal.fire({
      title: '¿Está seguro de guardar este Tramo?',
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
        this.armarModelo()
        this.loading = true;
        this.invoiceService.GetTramo(this.model[0]).subscribe(
          (response) => {
            if(response.isSuccess === true && response.data === true){
              Swal.fire({
                title: 'Se guardo el Tramo correctamente.',
                text: "",
                icon: 'success',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.loading = false
                }
              )
            }else{
              Swal.fire({
                title: 'Ocurrio un problema al guardar el Tramo.',
                text: "",
                icon: 'error',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.loading = false
                }
              )
            }
          }
        ).add(() => {
          this.loading = false
        })
      }
    })

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
  armarModelo(){
    this.model[0] = {
      invoiceCode : this.invoiceNumber,
      invoiceDate : this.invoiceDate,
      language : this.language,
      idCurrency : this.idCurrency,
      idCountry : this.idCountry,
      idSubscriber : this.idSubscriber,
      subscriberCode : this.code,
      attendedByName : this.attendedByName,
      attendedByEmail : this.attendedByEmail,
      taxTypeCode : this.taxTypeCode,
      exchangeRate : this.exchangeRate,
      address : this.address,
      attendedBy : this.attendedByName,
      igv : this.igv1,
      invoiceSubscriberList : this.selection1.selected
    }
  }
  selectSubscriberByBill(idSubscriber : number){
    this.selection1.clear()
    this.dataSourcePedido1.data = this.datos.filter(x => x.idSubscriber === idSubscriber)
    this.dataSourcePedido1.sort = this.sort;
    this.abonadoService.getAbonadoPorId(idSubscriber).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.idSubscriber = idSubscriber
          this.name = response.data.name
          this.code = response.data.code
          this.address = response.data.address
          this.taxTypeCode = response.data.taxRegistration
          this.language = response.data.language
          this.idCurrency = response.data.idCurrency
          this.idCountry = response.data.idCountry
          this.attendedByName = response.data.sendInvoiceToName
          this.attendedByEmail = response.data.sendInvoiceToEmail
        }
      }
    )
    console.log(idSubscriber)
    console.log(this.datos)
  }
  selectInvoiceToCollect(obj : InvoiceSubcriberListToCollect){
    this.dataSourcePedido2.data = obj.details
    //this.dataSourcePedido2.sort = this.sort
    this.totalSelectedPrice2 = 0
    this.dataSourcePedido2.data.forEach(element => {
      this.totalSelectedPrice2 += element.price
    });
    this.idSubscriberInvoice = obj.id
    this.abonadoService.getAbonadoPorId(obj.idSubscriber).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          console.log(obj.invoiceEmitDate)
          this.invoiceDate = obj.invoiceEmitDate
          this.idSubscriber = obj.idSubscriber
          this.invoiceNumber = obj.invoiceCode
          this.name = response.data.name
          this.code = response.data.code
          this.address = response.data.address
          this.taxTypeCode = response.data.taxRegistration
          this.language = response.data.language
          this.idCurrency = response.data.idCurrency
          this.idCountry = response.data.idCountry
          this.attendedByName = response.data.sendInvoiceToName
          this.attendedByEmail = response.data.sendInvoiceToEmail
        }
      }
    )
  }
  idSubscriberInvoice = 0

  totalSelectedPrice1 = 0
  totalSelectedPrice2 = 0
  totalSelectedPrice3 = 0
  updateTotalPrice1() {
    this.totalSelectedPrice1 = this.selection1.selected.reduce((acc, curr) => acc + curr.price, 0);
    if(this.igvFlag){
      this.igv1 = this.totalSelectedPrice1 * 18 / 100
    }else{
      this.igv1 = 0
    }
  }

  selectInvoicePaids(obj : InvoiceSubcriberListToCollect){
    this.dataSourcePedido3.data = obj.details
    //his.dataSourcePedido3.sort = this.sort
    this.totalSelectedPrice3 = 0
    this.dataSourcePedido3.data.forEach(element => {
      this.totalSelectedPrice3 += element.price
    });
    this.idSubscriberInvoice = obj.id
    this.idCurrency = obj.idCurrency
    this.loading = true

    this.abonadoService.getAbonadoPorId(obj.idSubscriber).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.invoiceDate = obj.invoiceEmitDate
          this.idSubscriber = obj.idSubscriber
          this.invoiceNumber = obj.invoiceCode
          this.name = response.data.name
          this.code = response.data.code
          this.address = response.data.address
          this.taxTypeCode = response.data.taxRegistration
          this.language = response.data.language
          this.idCurrency = response.data.idCurrency
          this.idCountry = response.data.idCountry
          this.attendedByName = response.data.sendInvoiceToName
          this.attendedByEmail = response.data.sendInvoiceToEmail
        }
      },(error) => {
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }
  buscarPorFacturar(){
    this.loading = true
    this.invoiceService.GetInvoiceSubscriberListByBill(this.startDate,this.endDate).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.datos = response.data
          if(this.datos !== null){
            this.dataSource1 = new MatTableDataSource<InvoiceSubcriberListByBill>(this.filterByDistinctSubscriber(this.datos))
          }else{
            this.dataSource1.data = []
          }
          this.dataSource1.sort = this.sort
        }
      },(error) => {
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }
  buscarPorCobrar(){
    this.loading = true
    this.invoiceService.GetInvoiceSubscriberListToCollect(this.monthPC,this.yearPC).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSource2 = new MatTableDataSource<InvoiceSubcriberListToCollect>(response.data)
          //this.dataSource2.sort = this.sort
        }
      },
      (error) => {
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
    this.invoiceService.GetInvoiceSubscriberListPaids(this.monthC,this.yearC).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSource3.data = response.data
          //this.dataSource3.sort = this.sort
        }
      },
      (error) => {
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }
  byBill = true
  toCollect = false
  paids = false
  clear(index : number){
    if(index === 0){
      this.byBill = true
      this.toCollect = false
      this.paids = false
      this.dataSource2.data = []
      this.dataSource3.data = []

      this.dataSourcePedido2.data = []
      this.dataSourcePedido3.data = []
      if(this.range.controls.start.value !== null && this.range.controls.end.value !== null ){
        const startDateValue = new Date(this.range.controls.start.value);
        const endDateValue = new Date(this.range.controls.end.value);

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

      this.dataSource1.data = []
      this.dataSource3.data = []

      this.dataSourcePedido1.data = []
      this.dataSourcePedido1.sort = this.sort;
      this.dataSourcePedido3.data = []
    }else if(index === 2){
      this.byBill = false
      this.toCollect = false
      this.paids = true

      this.dataSource1.data = []
      this.dataSource2.data = []

      this.dataSourcePedido1.data = []
      this.dataSourcePedido1.sort = this.sort;
      this.dataSourcePedido2.data = []
    }
    this.invoiceNumber = ""
    this.datos = []
    this.name = ""
    this.code = ""
    this.address = ""
    this.attendedByName = ""
    this.attendedByEmail = ""
    this.idCountry = 0
    this.bandera = ""
    this.idCurrency = 0
    this.language = ""
    this.idSubscriber = 0
    this.idSubscriberInvoice = 0
  }
  grabarFactura(){
    this.armarModelo()
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
        this.invoiceService.AddSubscriberInvoice(this.model[0]).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title :'Se grabó correctamente la factura del Abonado',
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
  cancelarFactura(){
    console.log("idSubscriberInvoice : " + this.idSubscriberInvoice)
    const dialogRef = this.dialog.open(CancelarFacturaAbonadoComponent, {
      data : {
        idSubscriberInvoice : this.idSubscriberInvoice,
        type : "FM"
      }
    })
    dialogRef.afterClosed().subscribe(
      (data) => {
        if(data !== null && data !== undefined && data.success){
          console.log(data)
          this.loading = true
          this.invoiceService.GetInvoiceSubscriberListToCollect(this.monthPC,this.yearPC).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSource2.data = response.data
                //this.dataSource2.sort = this.sort
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
  editarPorFacturar(obj : InvoiceSubcriberListByBill){
    const idTicket = obj.idTicket
    let price = 0
    const dialogRef = this.dialog.open(EditarPorFacturarComponent, {
      data : {
        idTicket : obj.idTicket,
        idSubscriber : obj.idSubscriber,
        idCountry : obj.idCountry,
        requestedName : obj.requestedName,
        procedureType : obj.procedureType,
        dispatchDate : obj.dispatchDate,
        price : obj.price
      }
    })
    dialogRef.afterClosed().subscribe(
      (data) => {
        if(data.success){
          console.log(data)
          this.dataSourcePedido1.data.filter(x => x.idTicket === idTicket)[0].requestedName = data.requestedName
          this.dataSourcePedido1.data.filter(x => x.idTicket === idTicket)[0].procedureType = data.procedureType
          this.dataSourcePedido1.data.filter(x => x.idTicket === idTicket)[0].dispatchDate = data.dispatchDate
          this.dataSourcePedido1.data.filter(x => x.idTicket === idTicket)[0].price = data.price

        }
      }
    )
  }
  editarPorCobrar(obj : InvoiceDetailsSubcriberToCollect){
    const IdSubscriberInvoiceDetails = obj.idSubscriberInvoiceDetails
    const dialogRef = this.dialog.open(EditarPorCobrarAbonadoComponent, {
      data : {
        idSubscriberInvoice : obj.idSubscriberInvoice,
        idSubscriberInvoiceDetails : obj.idSubscriberInvoiceDetails,
        requestedName : obj.requestedName,
        procedureType : obj.procedureType,
        dispatchDate : obj.dispatchDate,
        price : obj.price
      }
    })
    dialogRef.afterClosed().subscribe(
      (data) => {
        if(data.success){
          this.dataSourcePedido2.data.filter(x => x.idSubscriberInvoiceDetails === IdSubscriberInvoiceDetails)[0].requestedName = data.requestedName
          this.dataSourcePedido2.data.filter(x => x.idSubscriberInvoiceDetails === IdSubscriberInvoiceDetails)[0].procedureType = data.procedureType
          this.dataSourcePedido2.data.filter(x => x.idSubscriberInvoiceDetails === IdSubscriberInvoiceDetails)[0].dispatchDate = data.dispatchDate
          this.dataSourcePedido2.data.filter(x => x.idSubscriberInvoiceDetails === IdSubscriberInvoiceDetails)[0].price = data.price
        }
      }
    )
  }

}
