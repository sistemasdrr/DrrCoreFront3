import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Pais } from 'app/models/combo';
import { PedidoService } from 'app/services/pedido.service';
import { PaisService } from 'app/services/pais.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { TicketService } from 'app/services/pedidos/ticket.service';
import { TicketFile } from 'app/models/pedidos/ticket';
import { flatGroup } from 'd3';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss'],
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
export class DetalleComponent implements OnInit{
  loading = false

  idUser = 0

  idTicket = 0
  name = ""
  requestedName = ""
  date = new Date()
  dispatchedDate = this.date.getDate() + "/" + (this.date.getMonth() + 1) + "/" + this.date.getFullYear()
  idSubscriber = 0
  reportInPdf  = false
  reportInWord  = false
  reportInExcel  = false
  reportInXml  = false
  reportInXmlCredendo  = false

  adjuntos : TicketFile[] = []
  adjuntosSeleccionados : number[] = []


  constructor(public dialogRef: MatDialogRef<DetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any, private abonadoService : AbonadoService,
    private ticketService : TicketService, private paisService : PaisService){
      if(data !== null){
        this.idTicket = data.idTicket
        this.idUser = data.idUser
      }
  }
  ngOnInit(): void {
    this.ticketService.getById(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.name = response.data.busineesName
          this.requestedName = response.data.requestedName
          this.idSubscriber = response.data.idSubscriber
        }
      }
    ).add(
      () => {
        if(this.idSubscriber !== null && this.idSubscriber !== 0){
          this.abonadoService.getAbonadoPorId(this.idSubscriber).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.reportInPdf = response.data.reportInPdf
                this.reportInWord = response.data.reportInWord
                this.reportInExcel = response.data.reportInExcel
                this.reportInXml = response.data.reportInXml
                this.reportInXmlCredendo = response.data.reportInXmlCredendo
              }
            }
          )
        }
        this.ticketService.getTicketFiles(this.idTicket).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.adjuntos = response.data
              this.adjuntos.forEach(element => {
                element.flag = false
              });
            }
          }
        )
      }
    )
    // this.direccionInforme = order.direccion
    // this.tipoRT = order.tipoRT
    // this.codigoRT = order.codigoRT
  }
  despachar(){
    this.adjuntosSeleccionados = []
    this.adjuntos.forEach(element => {
      if(element.flag === true){
        this.adjuntosSeleccionados.push(element.id)
      }
    });
    console.log(this.adjuntosSeleccionados)
    Swal.fire({
      title: '¿Está seguro de despachar este pedido?',
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
      if(result.value){
        this.loading = true
        this.ticketService.dispatchTicket(this.idTicket, this.idUser,this.adjuntosSeleccionados).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title : 'El Pedido se envio correctamente',
                  icon : 'success',
                  width: '20rem',
                  heightAuto : true
                }).then(
                  () => {
                    this.loading = false
                    this.dialogRef.close()
                  }
                );
            }else{
              Swal.fire({
                title : 'Ocurrio un error al enviar el informe',
                text: response.message,
                icon : 'warning',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.loading = false
                  this.dialogRef.close()
                }
              );
            }
          },(error) => {
            Swal.fire({
              title : 'Ocurrio un error al enviar el informe',
              text: error,
              icon : 'error',
              width: '20rem',
              heightAuto : true
            }).then(
              () => {
                this.loading = false
                this.dialogRef.close()
              }
            );
          }
        )
      }
    })
  }
  salir(){
    this.dialogRef.close()
  }
}
