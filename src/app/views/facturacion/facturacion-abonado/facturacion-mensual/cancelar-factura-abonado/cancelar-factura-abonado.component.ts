import { Component, Inject } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { InvoiceService } from 'app/services/Facturacion/invoice.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-cancelar-factura-abonado',
    templateUrl: './cancelar-factura-abonado.component.html',
    styleUrls: ['./cancelar-factura-abonado.component.scss'],
    standalone: false
})
export class CancelarFacturaAbonadoComponent {
  loading = false
  idSubscriberInvoice = 0
  cancelDateD : Date | null = new Date()

  date = new Date()
  day = this.date.getDate();
  month = this.date.getMonth() + 1;
  year = this.date.getFullYear();

  type = ""

  cancelDate = this.day + "/" + this.month + "/" + this.year;

  constructor(public dialogRef: MatDialogRef<CancelarFacturaAbonadoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private invoiceService : InvoiceService) {
    if(data){
      console.log(data)
      this.idSubscriberInvoice = data.idSubscriberInvoice
      this.type = data.type
      console.log(this.idSubscriberInvoice)
      console.log(this.type)
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
    console.log(this.idSubscriberInvoice)
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
        if(this.type === "CC"){
          this.invoiceService.CancelSubscriberInvoiceCCToCollect(this.idSubscriberInvoice,this.cancelDate).subscribe(
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
        }else{
          this.invoiceService.CancelSubscriberInvoiceToCollect(this.idSubscriberInvoice,this.cancelDate).subscribe(
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

      }
    })
  }

}
