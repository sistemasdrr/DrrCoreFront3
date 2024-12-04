import { DatosGeneralesService } from 'app/services/informes/persona/datos-generales.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';

@Component({
  selector: 'app-ver-pdf',
  templateUrl: './ver-pdf.component.html',
  styleUrls: ['./ver-pdf.component.scss']
})
export class VerPdfComponent implements OnInit {

  pdfSrc : any
  pdfBlob: Blob;
  loading = false
  idCompany = 0
  idPerson = 0
  idTicket = 0
  type = ""
  name = ""
  section = ""
  language = ""

  constructor(public dialogRef: MatDialogRef<VerPdfComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private datosEmpresaService : DatosEmpresaService, private datosGeneralesService : DatosGeneralesService){
      this.pdfBlob = new Blob
      if(data){
        this.type = data.type
        if(this.type === "E"){
          this.idCompany = data.idCompany
        }else{
          this.idPerson = data.idPerson
        }
        this.section = data.section
        this.idTicket = data.idTicket
        this.language = data.language
      }
      console.log(this.idTicket)
    }
  ngOnInit(): void {
    this.loading = true
    if(this.type === "E"){
      this.datosEmpresaService.getDatosEmpresaPorId(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.name = response.data.name
          }
        }
      )
      this.datosEmpresaService.downloadReportSection(this.idCompany, this.section, this.language, this.idTicket).subscribe(response => {
        this.pdfBlob = response.body as Blob;
        let reader = new FileReader();
        reader.onloadend = () => {
          let dataUrl: string = reader.result as string;
          this.pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.pdfBlob);
      }).add(
        () => {
          this.loading = false
        }
      );
    }else{
      this.datosGeneralesService.getPersonaById(this.idPerson).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.name = response.data.fullname
          }
        }
      )
      this.datosGeneralesService.downloadReportF8(this.idPerson, this.language, "pdf").subscribe(response => {
        this.pdfBlob = response.body as Blob;
        let reader = new FileReader();
        reader.onloadend = () => {
          let dataUrl: string = reader.result as string;
          this.pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.pdfBlob);
      }).add(
        () => {
          this.loading = false
        }
      );
    }


  }

  descargarPDF(){
    if (this.pdfBlob) {
      const url = window.URL.createObjectURL(this.pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.name + '_' + this.section + '.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } else {
      console.error('No hay un PDF cargado para descargar');
    }
  }

  cerrarDialog(){
    this.dialogRef.close();
  }
}
