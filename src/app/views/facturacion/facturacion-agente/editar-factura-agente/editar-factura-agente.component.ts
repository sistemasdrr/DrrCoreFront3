import { Component, Inject, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComboData } from 'app/models/combo';
import { InvoiceAgentList } from 'app/models/facturacion';
import { InvoiceService } from 'app/services/Facturacion/invoice.service';
import { ComboService } from 'app/services/combo.service';
import { TicketService } from 'app/services/pedidos/ticket.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

export interface SpecialPriceAgent{
  codeAgent: string
  qualityAgent : QualityAgent[]
}
export interface QualityAgent{
  quality: string
  price : PriceAgent
}
export interface PriceAgent{
  t1 : number
  t2 : number
  t3 : number
}

@Component({
  selector: 'app-editar-factura-agente',
  templateUrl: './editar-factura-agente.component.html',
  styleUrls: ['./editar-factura-agente.component.scss'],
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

export class EditarFacturaAgenteComponent implements OnInit{

  pricesAgent : SpecialPriceAgent[] = [
    {
      codeAgent : "A17",
      qualityAgent : [
        {
          quality : "A",
          price : {
            t1 : 30,
            t2 : 40,
            t3 : 50
          }
        },
        {
          quality : "B",
          price : {
            t1 : 28,
            t2 : 33,
            t3 : 44
          }
        },
        {
          quality : "C",
          price : {
            t1 : 22,
            t2 : 28,
            t3 : 33
          }
        },
        {
          quality : "D",
          price : {
            t1 : 15,
            t2 : 15,
            t3 : 15
          }
        },
      ]
    },
    {
      codeAgent : "A30",
      qualityAgent : [
        {
          quality : "A",
          price : {
            t1 : 35,
            t2 : 35,
            t3 : 35
          }
        },
        {
          quality : "B",
          price : {
            t1 : 25,
            t2 : 25,
            t3 : 25
          }
        },
        {
          quality : "C",
          price : {
            t1 : 20,
            t2 : 20,
            t3 : 20
          }
        },
        {
          quality : "D",
          price : {
            t1 : 0,
            t2 : 0,
            t3 : 0
          }
        },
      ]
    },
    {
      codeAgent : "A32",
      qualityAgent : [
        {
          quality : "A",
          price : {
            t1 : 17,
            t2 : 17,
            t3 : 17
          }
        },
        {
          quality : "B",
          price : {
            t1 : 11,
            t2 : 11,
            t3 : 11
          }
        },
        {
          quality : "C",
          price : {
            t1 : 7,
            t2 : 7,
            t3 : 7
          }
        },
        {
          quality : "D",
          price : {
            t1 : 0,
            t2 : 0,
            t3 : 0
          }
        },
      ]
    },
  ]

  idTicket = 0
  idAgent = 0
  idCountry = 0
  asignedTo = ""
  idTicketHistory = 0
  requestedName = ""
  procedureType = ""
  shippingDate = ""
  shippingDateD : Date | null = null
  price = 0
  quality = ""
  idSpecialPrice = 0
  hasBalance = false;
  specialPrice : ComboData[] =[]

  loading = false
  invoiceAgent : InvoiceAgentList[] = []

  constructor(public dialogRef: MatDialogRef<EditarFacturaAgenteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private comboService : ComboService,
    private ticketHistory : TicketService, private invoiceService : InvoiceService) {
    if(data){
      console.log(data)
      this.idTicketHistory = data.idTicketHistory
      this.idAgent = data.idAgent
      this.idCountry = data.idCountry
      this.requestedName = data.requestedName
      this.procedureType = data.procedureType
      this.shippingDate = data.shippingDate
      this.asignedTo = data.asignedTo
      this.quality = data.quality
      this.price = data.price
      this.hasBalance = data.hasBalance
      this.idSpecialPrice = data.idSpecialPrice
      if(data.idSpecialPrice === null){
        this.idSpecialPrice = 0
      }
    }
  }

  ngOnInit(): void {
    const date = this.shippingDate.split('/')
    if(date){
      this.shippingDateD = new Date(parseInt(date[2]),parseInt(date[1])-1, parseInt(date[0]))
    }
    if(this.hasBalance){
      this.comboService.GetSpecialPrice(this.idAgent).subscribe(
        (response) => {
          if(response.isSuccess){
            this.specialPrice = response.data
          }
        }
      )
    }
  }

  calcularPrecio(quality : string){
    // const specialPriceAgent = this.pricesAgent.filter(x => x.codeAgent === this.asignedTo)[0].qualityAgent.filter(x => x.quality === quality)[0]
    // if(this.procedureType === 'T1'){
    //   this.price = specialPriceAgent.price.t1
    // }else if(this.procedureType === 'T2'){
    //   this.price = specialPriceAgent.price.t2
    // }else if(this.procedureType === 'T3'){
    //   this.price = specialPriceAgent.price.t3
    // }
    this.invoiceService.GetAgentPrice(this.idCountry,this.asignedTo,this.quality,this.procedureType, this.hasBalance, this.idSpecialPrice).subscribe(
      (response) => {
        if(response.isSuccess){
          this.price = response.data
        }
      }
    )
  }
  setDate(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.shippingDate = this.formatDate(selectedDate);
    }
  }

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
  cerrarDialog(){
    this.dialogRef.close({
      success : false,
      price : 0
    })
  }
  guardar(){
    console.log(this.idTicketHistory)
    console.log(this.idAgent)
    console.log(this.idCountry)
    console.log(this.requestedName)
    console.log(this.procedureType)
    console.log(this.shippingDate)
    console.log(this.hasBalance)
    console.log(this.idSpecialPrice)
    console.log(this.quality)
    Swal.fire({
      title: '¿Está seguro de actualizar este registro?',
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
        this.invoiceService.UpdateAgentTicket(this.idTicketHistory, this.requestedName, this.procedureType, this.shippingDate, this.quality,this.hasBalance,this.idSpecialPrice).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title: 'Se actualizo los datos correctamente',
                text: '',
                icon : 'success',
                width: '25rem'
              }).then(
                () => {
                  this.loading = false
                  this.dialogRef.close({
                    success : true,
                    requestedName : this.requestedName,
                    procedureType : this.procedureType,
                    shippingDate : this.shippingDate,
                    price : this.price,

                  })
                }
              )
            }
          },
          (error) => {
            Swal.fire({
              title: 'Ocurrio un error al actualizar los datos',
              text: '',
              icon : 'error',
              width: '25rem'
            }).then(
              () => {
                this.loading = false
                this.dialogRef.close({
                  success : false,
                  price : 0
                })
              }
            )
          }
        )
      }
    })

  }
}
