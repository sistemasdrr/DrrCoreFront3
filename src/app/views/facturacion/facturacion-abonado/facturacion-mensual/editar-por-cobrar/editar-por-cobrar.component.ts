import { Component, Inject, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceService } from 'app/services/Facturacion/invoice.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-por-cobrar',
  templateUrl: './editar-por-cobrar.component.html',
  styleUrls: ['./editar-por-cobrar.component.scss'],
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
export class EditarPorCobrarAbonadoComponent implements OnInit{

  loading = false

  idSubscriberInvoice = 0
  idSubscriberInvoiceDetails = 0
  price = 0
  requestedName = ""
  procedureType = ""
  dispatchDate = ""
  dispatchDateD : Date | null = null

  constructor(public dialogRef: MatDialogRef<EditarPorCobrarAbonadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private invoiceService : InvoiceService) {
    if(data){
      console.log(data)
      this.idSubscriberInvoice = data.idSubscriberInvoice
      this.idSubscriberInvoiceDetails = data.idSubscriberInvoiceDetails
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
  }
  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
  setDate(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.dispatchDate = this.formatDate(selectedDate);
    }
  }
  cerrarDialog(){
    this.dialogRef.close({
      success : false,
      price : 0
    })
  }
  guardar(){
    console.log(this.idSubscriberInvoice)
    console.log(this.idSubscriberInvoiceDetails)
    console.log(this.requestedName)
    console.log(this.procedureType)
    console.log(this.dispatchDate)
    console.log(this.price)
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
        this.invoiceService.UpdateSubscriberInvoiceToCollect(this.idSubscriberInvoice, this.idSubscriberInvoiceDetails, this.requestedName, this.procedureType, this.dispatchDate, this.price).subscribe(
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
