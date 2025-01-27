import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';
import { SociosEmpresaComponent } from 'app/views/informe/info-empresa/ie-lista/socios-empresa/socios-empresa.component';
import { SociosPersonaComponent } from 'app/views/informe/info-persona/ip-lista/socios-persona/socios-persona.component';
import { VerPdfComponent } from '../ver-pdf/ver-pdf.component';

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
    standalone: false
})
export class BreadcrumbComponent implements OnInit{
  @Input()
  title!: string;
  @Input()
  subtitle!: string;
  @Input()
  usuario!: string;
  @Input()
  codigoInforme!: string;
  @Input()
  idCompany!: number;
  @Input()
  idPerson!: number;
  @Input()
  idTicket!: number;

  fecha : Date = new Date()
  @Input()
  items!: string[];
  @Input()
  active_item!: string;

  idEmployee = 0
  idSubscriber = 0

  constructor(private dialog : MatDialog, private datosEmpresaService : DatosEmpresaService ) {
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    const subscriberUser = JSON.parse(localStorage.getItem('subscriberUser') || '{}')
    if(auth){
      this.idEmployee = parseInt(auth.idEmployee)
      this.idSubscriber = 0
    }else if(!auth && subscriberUser){
      this.idSubscriber = parseInt(subscriberUser.id)
      this.idEmployee = 0
    }
console.log(this.idCompany);
console.log(this.idPerson);
  }
  ngOnInit(): void {
  }
  verSocios(){
    if(this.idCompany !== 0){

      const dialogRef = this.dialog.open(SociosEmpresaComponent, {
        data: {
          idCompany : this.idCompany,
        },
      });
    }else{
      const dialogRef = this.dialog.open(SociosPersonaComponent, {
        data: {
          idPerson : this.idPerson
        },
      });
    }

  }
  oldCode = ""
  verInforme(language : string){
    if(this.idCompany > 0){
      const dialogRef = this.dialog.open(VerPdfComponent,{
        data: {
          type : "E",
          idCompany : this.idCompany,
          idTicket : this.idTicket,
          section : "ALL",
          language : language
        },
      });
    }else{
      const dialogRef = this.dialog.open(VerPdfComponent,{
        data: {
          type : "P",
          idPerson : this.idPerson,
          idTicket : this.idTicket,
          section : "ALL",
          language : language
        },
      });
    }



  }
}
