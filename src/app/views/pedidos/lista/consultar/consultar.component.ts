import { formatDate } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SendQuery } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-consultar',
    templateUrl: './consultar.component.html',
    styleUrls: ['./consultar.component.scss'],
    standalone: false
})
export class ConsultarComponent implements OnInit{
  loading:boolean = false;
  dateQuery:any
  ticket:any;
  language:string ='';
  subscriber:string='';
  email:string='';
  report:string='';
  message:string='';
  response:string='';
  canWork:boolean=false;  
  canSend:boolean=false;
  canCheck:boolean=false;
  constructor(public dialogRef: MatDialogRef<ConsultarComponent>,
     @Inject(MAT_DIALOG_DATA) public data: any,
  private ticketService : TicketService,
  private dateAdapter: DateAdapter<Date>
  ) {
    this.dateAdapter.setLocale('en-GB'); 
    if(data){
    this.ticket=data.ticket;
    this.canWork=data.ticket.status==='PENDIENTE' || data.ticket.status==='EN CONSULTA';
    this.canCheck=data.ticket.hasQuery && data.ticket.statusQuery===1;
    this.canSend=!data.ticket.hasQuery;
    console.log(this.ticket)
    }
   
  }
  ngOnInit(): void {    
    this.loading=true;
    this.ticketService.getTicketQuery(this.ticket.id).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
           this.dateQuery=response.data.queryDate;   
           this.language=response.data.language;   
           this.report= response.data.report;
           this.subscriber= response.data.subscriberName;
           this.email= response.data.email;
           this.message= response.data.message;
           this.response=response.data.response;

        }
        this.loading=false;
      }
    )
  }
  selectIdioma(idioma: string) {
    this.language = idioma;
  }

  guardar(){
       var query: SendQuery={
      idTicket: this.ticket.id,
      queryDate: this.dateQuery,
      idSubscriber: this.ticket.idSubscriber,
      language: this.language,
      email: this.email,
      message: this.message,
      response: this.response,     
      user:''
    };
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    query.user = auth.idUser
    this.loading=true;
    Swal.fire({
      title: '¿Está seguro de enviar la consulta?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText : 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      width: '30rem',
      heightAuto : true
    }).then((result) => {
      if (result.value) {
       
      this.loading=true;
        this.ticketService.sendQuery(query).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
               this.loading=false;  
              Swal.fire({
                title: 'Se ha enviado la consulta al abonado',
                text: '',
                icon: 'success',
                width: '30rem',
                heightAuto: true
              }).then(() => {
                this.dialogRef.close();
              })
    
            }
          }
        )
  }
})
  }
  resolver(){
    this.loading=true;
    Swal.fire({
      title: '¿El cliente ha respondido su consulta?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText : 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      width: '30rem',
      heightAuto : true
    }).then((result) => {
      if (result.value) {
        

        this.ticketService.resolveQuery(this.ticket.id,this.response).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
             this.loading=false;
              Swal.fire({
                title: 'El ticket se encuentra listo para ser derivado',
                text: '',
                icon: 'success',
                width: '30rem',
                heightAuto: true
              }).then(() => {
                this.dialogRef.close();
              })
    
            }
          }
        )
  }
})
  }
  salir(){
    this.dialogRef.close()
  }
}
