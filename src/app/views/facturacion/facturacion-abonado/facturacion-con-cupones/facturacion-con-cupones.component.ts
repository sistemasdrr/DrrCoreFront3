import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Pais } from 'app/models/combo';
import { ComboService } from 'app/services/combo.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { InvoiceService } from 'app/services/Facturacion/invoice.service';
import { AddInvoiceSubscriberCC, InvoiceSubcriberCCListByBill, InvoiceSubcriberCCListPaids, InvoiceSubcriberCCListToCollect, InvoiceSubscriberCCHistory } from 'app/models/facturacion';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { CancelarFacturaAbonadoComponent } from '../facturacion-mensual/cancelar-factura-abonado/cancelar-factura-abonado.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-facturacion-con-cupones',
    templateUrl: './facturacion-con-cupones.component.html',
    styleUrls: ['./facturacion-con-cupones.component.scss'],
    standalone: false
})
export class FacturacionConCuponesComponent implements OnInit{
  breadscrums = [
    {
      title: 'Facturación Con Cupones de Abonado',
      items: ['Facturación'],
      active: 'Abonado',
    },
  ];

  loading = false;

  dataSourcePF = new MatTableDataSource<InvoiceSubcriberCCListByBill>()
  dataSourcePC = new MatTableDataSource<InvoiceSubcriberCCListToCollect>()
  dataSourceCO = new MatTableDataSource<InvoiceSubcriberCCListPaids>()
  columnsDS : string[] = ['code','name','opciones']


  years: number[] = [];
  //FACTURACION
  invoiceNumber = ""
  invoiceDate : Date | null = new Date()
  cancelDate : Date | null = null
  idSubscriber = 0
  name = ""
  code = ""
  address = ""
  taxTypeCode = ""
  attendedByName = ""
  attendedByEmail = ""
  idCountry = 0
  bandera = ""
  idCurrency = 0
  language = ""

  igv1 = 0
  igvFlag = false;
  exchangeRate = 0
  paises : Pais[] = []
  //FILTRAR
  //POR FACTURAR
  monthPF = 1
  yearPF = 2024

  dataSourceDetailsPF = new MatTableDataSource<InvoiceSubscriberCCHistory>
  columnsToDisplay = ['select','fecha','monto','precioUnidad','precioTotal']

  //POR COBRAR
  monthPC = 1
  yearPC = 2024

  //COBRADAS
  monthC = 1
  yearC = 2024

  //Cupones
  startDate : Date | null = null
  endDate : Date | null = null

  availableTicket = 0
  pricePerTicket = 0
  quantity = 0
  totalAmount = 0
  igvCheck = false
  totalGeneral = 0

  type = "PF"

  idSubscriberPF = 0
  idSubscriberPC = 0
  idSubscriberCO = 0
  constructor(private dialog : MatDialog,private invoiceService : InvoiceService, private abonadoService : AbonadoService,private comboService : ComboService){

  }
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = currentYear - 10;

    this.monthPF = currentMonth+1;
    this.monthPC = currentMonth+1;
    this.monthC = currentMonth+1;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
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

  descargarTramo(){
    console.log(this.model[0])
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
        this.invoiceService.GetTramoCC(this.model[0]).subscribe(
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

  onTabChange(event: any): void {
    if (event.index === 0) {
      this.type = 'PF';
      this.clear(0)
    }else if(event.index === 1){
      this.type = 'PC'
      this.clear(1)
    }else if(event.index === 2){
      this.type = 'CO'
      this.clear(2)
    }
  }
  selection1 = new SelectionModel<InvoiceSubscriberCCHistory>(true, []);

  onCheckboxChange1(row: InvoiceSubscriberCCHistory) {
    console.log(row)
    this.selection1.toggle(row);
    this.updateTotalPrice1()
  }
  checkboxLabel1(row?: InvoiceSubscriberCCHistory): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  isAllSelected1() {
    const numSelected = this.selection1.selected.length;
    const numRows = this.dataSourceDetailsPF.data.length;
    this.updateTotalPrice1()
    return numSelected === numRows;
  }
  totalQuantity: number = 0;
  totalSelectedPrice1: number = 0;
  updateTotalPrice1() {
    this.totalSelectedPrice1 = this.selection1.selected.reduce((acc, curr) => acc + curr.totalPrice, 0);
    this.totalQuantity = this.selection1.selected.reduce((acc, curr) => acc + curr.couponAmount, 0);
    if(this.igvFlag){
      this.igv1 = this.totalSelectedPrice1 * 18 / 100
    }else{
      this.igv1 = 0
    }
  }
  buscarPorFacturar(){
    this.loading = true
    this.invoiceService.GetInvoiceSubscriberCCListByBill(this.monthPF,this.yearPF).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSourcePF.data = response.data
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
  selectSubscriberByBill(idSubscriber : number, list : InvoiceSubscriberCCHistory[]){
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
          this.dataSourceDetailsPF.data = list
        }
      }
    )
    this.totalSelectedPrice1 = 0
    this.selection1.clear()
    console.log(idSubscriber)
  }
  selectSubscriberToCollect(obj : InvoiceSubcriberCCListToCollect){
    this.idSubscriberInvoice = obj.id
    this.abonadoService.getAbonadoPorId(obj.idSubscriber).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.idSubscriber = obj.idSubscriber
          this.name = response.data.name
          this.code = response.data.code
          this.address = response.data.address
          this.taxTypeCode = response.data.taxRegistration
          this.language = response.data.language
          this.idCurrency = response.data.idCurrency
          this.idCountry = response.data.idCountry
          this.attendedByName = response.data.sendInvoiceToName
          this.attendedByEmail = response.data.sendInvoiceToEmail
          this.invoiceNumber = obj.invoiceCode
          this.totalAmount = obj.totalPrice
          this.quantity = obj.quantity
        }
      }
    )
  }
  selectSubscriberPaids(obj : InvoiceSubcriberCCListPaids){
    this.idSubscriberInvoice = obj.id
    this.abonadoService.getAbonadoPorId(obj.idSubscriber).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.idSubscriber = obj.idSubscriber
          this.name = response.data.name
          this.code = response.data.code
          this.address = response.data.address
          this.taxTypeCode = response.data.taxRegistration
          this.language = response.data.language
          this.idCurrency = response.data.idCurrency
          this.idCountry = response.data.idCountry
          this.attendedByName = response.data.sendInvoiceToName
          this.attendedByEmail = response.data.sendInvoiceToEmail
          this.invoiceNumber = obj.invoiceCode
          this.totalAmount = obj.totalPrice
          this.quantity = obj.quantity
          this.cancelDate = obj.invoiceCancelDate
        }
      }
    )
  }
  buscarPorCobrar(){
    this.loading = true
    this.invoiceService.GetInvoiceSubscriberCCListToCollect(this.monthPC,this.yearPC).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSourcePC.data = response.data
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
    this.invoiceService.GetInvoiceSubscriberCCListPaids(this.monthC,this.yearC).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSourceCO.data = response.data
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
  idSubscriberInvoice = 0
  cancelarFactura(){
    console.log("idSubscriberInvoice : " + this.idSubscriberInvoice)
    const dialogRef = this.dialog.open(CancelarFacturaAbonadoComponent, {
      data : {
        idSubscriberInvoice : this.idSubscriberInvoice,
        type : "CC"
      }
    })
    dialogRef.afterClosed().subscribe(
      (data) => {
        if(data !== null && data !== undefined && data.success){
          console.log(data)
          this.loading = true
          this.invoiceService.GetInvoiceSubscriberCCListToCollect(this.monthPC,this.yearPC).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSourcePC.data = response.data
                this.clear(0)
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
  clear(index : number){
    if(index === 0){
    }else if(index === 1){

    }else if(index === 2){

    }
    this.cancelDate = null
    this.idSubscriberInvoice = 0
    this.totalAmount = 0
    this.quantity = 0
    this.invoiceNumber = ""
    this.selection1.clear()
    this.dataSourceDetailsPF.data = []
    this.idSubscriber = 0
    this.name = ""
    this.code = ""
    this.address = ""
    this.taxTypeCode = ""
    this.language = ""
    this.idCurrency = 0
    this.idCountry = 0
    this.attendedByName = ""
    this.attendedByEmail = ""
  }
  model : AddInvoiceSubscriberCC[] = []
  armarModelo(){
    this.model[0] = {
      invoiceCode : this.invoiceNumber,
      invoiceDate : this.invoiceDate,
      language : this.language,
      idCurrency : this.idCurrency,
      idCountry : this.idCountry,
      address : this.address,
      attendedBy : this.attendedByName,
      subscriberCode : this.code,
      igv : this.igv1,
      exchangeRate : 0,
      taxTypeCode : this.taxTypeCode,
      idSubscriber : this.idSubscriber,
      attendedByName : this.attendedByName,
      attendedByEmail : this.attendedByEmail,
      quantity : this.selection1.selected.length,
      totalPrice : this.totalSelectedPrice1,
      details : this.selection1.selected
    }
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
        this.invoiceService.AddSubscriberInvoiceCC(this.model[0]).subscribe(
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

}
