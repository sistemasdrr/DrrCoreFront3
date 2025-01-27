import { Component, OnInit } from '@angular/core';
import { ComboDataName } from 'app/models/combo';
import { ComboService } from 'app/services/combo.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { ReportService } from 'app/services/report.service';

@Component({
    selector: 'app-supervisores',
    templateUrl: './supervisores.component.html',
    styleUrls: ['./supervisores.component.scss'],
    standalone: false
})
export class SupervisoresComponent implements OnInit {
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
    private abonadoService: AbonadoService,
    private reportService: ReportService,
    private comboService: ComboService
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
    this.comboService.getSupervisores().subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.listaSupervisores = response.data
        }
      }
    )
  }
  selectQuery() {
    console.log(this.idQuery);
    switch (this.idQuery) {
      case 1:
        this.selectQuery6_6_1();
        break;
        case 2:
        this.selectQuery6_6_2();
        break;
    }
  }
  descargarDocumento(idQuery: number, format: string) {
    console.log(idQuery)
    switch (idQuery) {

      case 1:
        this.loading = true;
        this.reportService
          .DownloadReport6_6_1(this.query1_1_code, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.6.1 - ' +
              this.query1_1_code +
              (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
          break;
          case 2:
        this.loading = true;
        this.reportService
        .DownloadReport_Realizado_Pendiente(this.month,this.year,'SU', 'pdf')
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE_REALIZADOS_PENDIENTES_REPORTEROS' +
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


  listaSupervisores : ComboDataName[] = []
  query1_1_code = ""

  query1_1_pdfSrc: any;
  query1_1_pdfBlob: Blob = new Blob();

  selectQuery6_6_1(){
    this.loading = true
    this.reportService
    .DownloadReport6_6_1(this.query1_1_code, 'pdf')
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
   query1_2_pdfSrc: any;
  query1_2_pdfBlob: Blob = new Blob()
  selectQuery6_6_2(){
    this.loading = true
    this.reportService
    .DownloadReport_Realizado_Pendiente(this.month,this.year,'SU', 'pdf')
          .subscribe((response) => {
      this.query1_2_pdfBlob = response.body as Blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl: string = reader.result as string;
        this.query1_2_pdfSrc = dataUrl;
      };
      reader.readAsDataURL(this.query1_2_pdfBlob);
    })
    .add(() => {
      this.loading = false;
    });
  }
}
