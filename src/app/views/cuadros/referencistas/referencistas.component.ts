import { Component, OnInit } from '@angular/core';
import { ReportService } from 'app/services/report.service';

@Component({
  selector: 'app-referencistas',  
  templateUrl: './referencistas.component.html',
  styleUrl: './referencistas.component.scss',
  standalone: false
})
export class ReferencistasComponent implements OnInit {
 
  years: number[] = [];

  breadscrums = [
    {
      title: 'Reportes de Supervisores',
      items: ['Reportes'],
      active: 'Supervisores',
    },
  ];

  loading = false;

  idQuery = 1;
   year=2025;
   month=1;
constructor(   
    private reportService: ReportService,
   
  ) {
  }
   ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = currentYear - 10;
    this.year = currentYear;
    this.month = currentMonth+1;
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
  }
  selectQuery() {
    console.log(this.idQuery);
    switch (this.idQuery) {
      case 1:
        this.selectQuery6_7_1();
        break;
       
    }
}
descargarDocumento(idQuery: number, format: string) {
  console.log(idQuery)
  switch (idQuery) {   
        case 1:
      this.loading = true;
      this.reportService
      .DownloadReport_Realizado_Pendiente(this.month,this.year,'RF', 'pdf')
        .subscribe((response) => {
          const blob: Blob = response.body as Blob;
          const a = document.createElement('a');
          a.download =
            'REPORTE_REALIZADOS_PENDIENTES_REFERENCISTAS' +
                this.month +           
            (format === 'pdf' ? '.pdf' : '.xlsx');
          a.href = window.URL.createObjectURL(blob);
          a.click();
        })
        .add(() => {
          this.loading = false;
        });
        break;
      }
    }
    query1_1_pdfSrc: any;
    query1_1_pdfBlob: Blob = new Blob()
    selectQuery6_7_1(){
      this.loading = true
      this.reportService
      .DownloadReport_Realizado_Pendiente(this.month,this.year,'RF', 'pdf')
            .subscribe((response) => {
        this.query1_1_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query1_1_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query1_1_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
    }

}

