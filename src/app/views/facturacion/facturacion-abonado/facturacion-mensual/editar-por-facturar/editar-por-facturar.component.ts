import { Component, Inject, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceService } from 'app/services/Facturacion/invoice.service';
import { TicketService } from 'app/services/pedidos/ticket.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-editar-por-facturar',
    templateUrl: './editar-por-facturar.component.html',
    styleUrls: ['./editar-por-facturar.component.scss'],
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
export class EditarPorFacturarComponent implements OnInit{

  idTicket = 0
  idSubscriber = 0
  idCountry = 0
  requestedName = ""
  procedureType = ""
  dispatchDate = ""
  dispatchDateD : Date | null = null
  price = 0

  priceT1 = 0
  priceT2 = 0
  priceT3 = 0

  loading = false

  constructor(public dialogRef: MatDialogRef<EditarPorFacturarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ticketHistory : TicketService, private invoiceService : InvoiceService) {
    if(data){
      console.log(data)
      this.idTicket = data.idTicket
      this.idSubscriber = data.idSubscriber
      this.idCountry = data.idCountry
      this.requestedName = data.requestedName
      this.procedureType = data.procedureType
      this.dispatchDate = data.dispatchDate
      this.price = data.price
    }
  }
  ngOnInit(): void {
    const date = this.dispatchDate.split('/')
    if(date){
      this.dispatchDateD = new Date(parseInt(date[2]),parseInt(date[1])-1, parseInt(date[0]))
    }
    this.invoiceService.GetSubscriberPriceByTicket(this.idSubscriber, this.idCountry).subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.priceT1 = response.data.priceT1
          this.priceT2 = response.data.priceT2
          this.priceT3 = response.data.priceT3
        }
      }
    )
  }
  cambiarPrecio(procedureType : string){
    if(procedureType === 'T1'){
      this.price = this.priceT1
    }else if(procedureType === 'T2'){
      this.price = this.priceT2
    }else if(procedureType === 'T3'){
      this.price = this.priceT3
    }
  }
  setDate(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    console.log(selectedDate)
    if (moment.isMoment(selectedDate)) {
      this.dispatchDate = this.formatDate(selectedDate);
    }
  }

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    console.log(formattedDate)
    return formattedDate;
  }
  cerrarDialog(){
    this.dialogRef.close({
      success : false,
      price : 0
    })
  }
  guardar(){
    console.log(this.idTicket)
    console.log(this.requestedName)
    console.log(this.procedureType)
    console.log(this.dispatchDate)
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
        this.invoiceService.UpdateSubscriberTicket(this.idTicket, this.requestedName, this.procedureType, this.dispatchDate,this.price).subscribe(
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
                    dispatchDate : this.dispatchDate,
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
