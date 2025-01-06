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

  constructor(
    private abonadoService: AbonadoService,
    private reportService: ReportService,
    private comboService: ComboService
  ) {
  }

  ngOnInit(): void {
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
    }
  }
  descargarDocumento(idQuery: number, format: string) {
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
}
