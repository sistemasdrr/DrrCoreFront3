import { Component, Inject } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceService } from 'app/services/Facturacion/invoice.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cancelar-factura',
    templateUrl: './cancelar-factura.component.html',
    styleUrls: ['./cancelar-factura.component.scss'],
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
export class CancelarFacturaComponent {

  loading = false
  idAgentInvoice = 0
  cancelDateD : Date | null = new Date()

  date = new Date()
  day = this.date.getDate();
  month = this.date.getMonth() + 1;
  year = this.date.getFullYear();

  cancelDate = this.day + "/" + this.month + "/" + this.year;

  constructor(public dialogRef: MatDialogRef<CancelarFacturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private invoiceService : InvoiceService) {
    if(data){
      console.log(data)
      this.idAgentInvoice = data.idAgentInvoice
    }
  }

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
  selectDate(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.cancelDate = this.formatDate(selectedDate);
    }
  }
  cerrarDialog(){
    this.dialogRef.close({
      success : false
    })
  }
  guardar(){
    console.log(this.idAgentInvoice)
    console.log(this.cancelDate)
    Swal.fire({
      title: '¿Está seguro de cancelar esta factura?',
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
        this.invoiceService.CancelAgentInvoiceToCollect(this.idAgentInvoice,this.cancelDate).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title: 'Se cancelo la factura del agente correctamente',
                text: "",
                icon: 'success',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.loading = false;
                  this.dialogRef.close({
                    success : true
                  })
                }
              )
            }
          },(error) => {
            this.loading = false;
          }
        )
      }
    })
  }

}
