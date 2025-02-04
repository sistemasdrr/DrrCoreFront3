import { Component, Inject, OnInit } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';

@Component({
    selector: 'app-export-f1',
    templateUrl: './export-f1.component.html',
    styleUrls: ['./export-f1.component.scss'],
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
export class ExportF1Component implements OnInit {
  titulo = "Generar Documento de la Empresa"
  idCompany = 0
  codigoEmpresa = ""
  idioma = "E"
  formato = "PDF"

  constructor(private datosEmpresaService : DatosEmpresaService, @Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ExportF1Component>) {
    if(data){
      this.idCompany = data.idCompany
      this.codigoEmpresa = data.oldCode
      console.log(this.idCompany)
      console.log(this.codigoEmpresa)
    }
  }

  ngOnInit(): void {
  }
  descargarDocumento(formato : string){
    const listaEmpresas = document.getElementById('loader-lista-empresas') as HTMLElement | null;
    if(listaEmpresas){
      listaEmpresas.classList.remove('hide-loader');
    }
    this.datosEmpresaService.downloadReportF8(this.idCompany,this.idioma,formato).subscribe(response=>{
      let blob : Blob = response.body as Blob;
      let a =document.createElement('a');
      const language = this.idioma === "I" ? "ENG" : "SPA"
      const extension = formato === "pdf" ? '.pdf' : formato === "word" ? '.doc' : '.xls'
      a.download= this.codigoEmpresa+"_"+language+"_"+Date.now()+extension;
      a.href=window.URL.createObjectURL(blob);
      a.click();
    }).add(
      () => {
        if(listaEmpresas){
          listaEmpresas.classList.add('hide-loader');
        }
      }
    );
}
  cerrar(){
    this.dialogRef.close()
  }
}
