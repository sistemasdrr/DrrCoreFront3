import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComboService } from 'app/services/combo.service';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { Ticket } from 'app/models/pedidos/ticket';
import Swal from 'sweetalert2';
import { TicketService } from 'app/services/pedidos/ticket.service';

@Component({
    selector: 'app-confirmar-pedido',
    templateUrl: './confirmar-pedido.component.html',
    styleUrls: ['./confirmar-pedido.component.scss'],
    standalone: false
})
export class ConfirmarPedidoComponent implements OnInit {

  id : number = 0
  number : number = 0
  idSubscriber : number = 0
  revealName : boolean = false
  code = ""
  nameRevealed : string = ""
  referenceNumber : string = ""
  language : string = ""
  queryCredit : string = ""
  timeLimit : string = ""
  aditionalData : string = ""
  about : string = "E"
  orderDate : Date = new Date()
  expireDate : Date = new Date()
  realExpireDate : Date = new Date()
  idContinent : number = 0
  idCountry : number = 0
  reportType : string = "RV"
  procedureType : string = "T4"
  idCompany : number = 0
  idPerson : number = 0
  busineesName : string = ""
  comercialName : string = ""
  taxType : string = ""
  taxCode : string = ""
  email : string = ""
  address : string = ""
  city : string = ""
  telephone : string = ""
  creditrisk : number = 0
  enable : boolean = true
  requestedName : string = ""
  price : number = 0

  country = ""
  flag = ""

  lastSearched = ""
  sendTo = ""
  rubro = ""
  ticket : Ticket[] = []

  constructor(public dialogRef: MatDialogRef<ConfirmarPedidoComponent>, private abonadoService : AbonadoService,
    @Inject(MAT_DIALOG_DATA) public data: any, private datosEmpresaService : DatosEmpresaService,
    private comboService : ComboService, private ticketService : TicketService){
      if(data){
        this.idCompany = data.idCompany
      }
      const subscriberUser = JSON.parse(localStorage.getItem('subscriberUser') || '{}')
      if(subscriberUser.id > 0){
        this.idSubscriber = parseInt(subscriberUser.id)
      }
  }

  ngOnInit(): void {

    this.datosEmpresaService.getDatosEmpresaPorId(this.idCompany).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          console.log(response.data)
          this.busineesName = response.data.name
          this.lastSearched = response.data.lastSearched
          this.idCountry = response.data.idCountry
          this.language = response.data.language
          this.comercialName = response.data.socialName
          this.telephone = response.data.telephone
          this.taxCode = response.data.taxTypeCode
          this.email = response.data.email
          this.address = response.data.address
          this.city = response.data.place
          this.requestedName = response.data.name
        }
      }
    ).add(
      () => {
        if(this.idCountry !== 0 && this.idCountry !== null){
          this.comboService.getPaisById(this.idCountry).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.country = response.data.valor
                this.flag = response.data.bandera
                this.taxType = response.data.regtrib
              }
            }
          )
        }
      }
    )
    this.abonadoService.getAbonadoPorId(this.idSubscriber).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          console.log(response.data)
          this.revealName = response.data.revealName
          this.code = response.data.code
          this.nameRevealed = this.revealName === true ? response.data.name : ""
          this.sendTo = response.data.sendReportToEmail
        }
      }
    )
  }
  armarModelo(){
    this.ticket[0] = {
      id : 0,
      number : 0,
      idSubscriber : this.idSubscriber,
      revealName : this.revealName,
      nameRevealed : this.nameRevealed,
      referenceNumber : "",
      language : this.language,
      queryCredit : "",
      timeLimit : "",
      aditionalData : "",
      subscriberIndications : "",
      about : "E",
      orderDate : this.orderDate,
      expireDate : this.expireDate,
      realExpireDate : this.realExpireDate,
      idContinent : 0,
      idCountry : this.idCountry,
      reportType : "RV",
      procedureType :  "T4",
      idCompany : this.idCompany,
      idPerson : 0,
      busineesName : this.busineesName,
      comercialName : this.comercialName,
      taxType : this.taxType,
      taxCode : this.taxCode,
      email : this.email,
      address : this.address,
      city : this.city,
      telephone : this.telephone,
      creditrisk : 0,
      enable : true,
      requestedName : this.requestedName,
      price : 0,
      userFrom : this.code,
      commentary : '',
      webPage : ''
    }
  }
  cerrarDialog(){
    this.dialogRef.close()
  }
  confirmarPedido(){
    this.armarModelo()
    console.log(this.ticket[0])
    Swal.fire({
      title: '¿Está seguro de realizar el pedido?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí',
      width: '30rem',
      heightAuto: true
    }).then((result) => {
      if (result.value) {
        const loader = document.getElementById('loader-lista-cupon') as HTMLElement | null;
        if(loader){
          loader.classList.remove('hide-loader');
        }
        this.ticketService.addTicketOnline(this.ticket[0],this.rubro,this.sendTo).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title: 'Se realizó el pedido con exito',
                text: "",
                icon: 'success',

                width: '30rem',
                heightAuto: true
              })
            }
          }
        ).add(
          () => {
            if(loader){
              loader.classList.add('hide-loader');
            }
          }
        )
      }
    })
  }
  addDays(noOfDaysToAdd:number,orderDate:Date){
    let endDate : Date=new Date, count = 0;
    while(count < noOfDaysToAdd){
        endDate = new Date(orderDate.setDate(orderDate.getDate() + 1));
        if(endDate.getDay() != 0 && endDate.getDay() != 6){
           count++;
        }
    }
    return endDate;
  }
}
