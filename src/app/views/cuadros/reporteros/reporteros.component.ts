import { Component, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ComboDataName, Pais } from 'app/models/combo';
import { GetCycles } from 'app/models/consulta';
import { ComboService } from 'app/services/combo.service';
import { ConsultaService } from 'app/services/Consultas/consulta.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { ReportService } from 'app/services/report.service';
import * as moment from 'moment';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-reporteros',
    templateUrl: './reporteros.component.html',
    styleUrls: ['./reporteros.component.scss'],
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
export class ReporterosComponent implements OnInit{
  years: number[] = [];

  breadscrums = [
    {
      title: 'Reportes de Reporteros',
      items: ['Reportes'],
      active: 'Reporteros',
    },
  ];

  loading = false;

  idQuery = 1;

  cycles : GetCycles[] = []
  constructor(
    private abonadoService: AbonadoService,
    private reportService: ReportService,
    private comboService: ComboService,
    private consultaService : ConsultaService
  ) {
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = currentYear - 10;
    this.query1_4_year = currentYear;
    this.query1_4_month = currentMonth+1;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
    this.comboService.getReporter().subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.listaReporteros = response.data
        }
      }
    )
    this.consultaService.GetCycles().subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.cycles = response.data
        }
      }
    )
    this.query1_1_startString = this.formatDateToString(this.query1_1_start);
    this.query1_1_endString = this.formatDateToString(this.query1_1_end);
    this.query1_3_startString = this.formatDateToString(this.query1_3_start);
    this.query1_3_endString = this.formatDateToString(this.query1_3_end);
  }
  selectQuery() {
    console.log(this.idQuery);
    switch (this.idQuery) {
      case 4:
        this.selectQuery6_2_4();
        break;
    }
  }
  descargarDocumento(idQuery: number, format: string) {
    switch (idQuery) {
      case 1:
        this.loading = true;
        this.reportService
          .DownloadReport6_2_1(this.query1_1_startString, this.query1_1_endString,this.query1_1_code, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.2.1 - ' +
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
          .DownloadReport6_2_2(this.query1_2_code, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.2.2 - ' +
              this.query1_2_code +
              (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
        case 3:
          this.loading = true;
          this.reportService
            .DownloadReport6_2_3(this.query1_3_cycle, this.query1_3_code, format)
            .subscribe((response) => {
              const blob: Blob = response.body as Blob;
              const a = document.createElement('a');
              a.download =
                'REPORTE 6.2.3 - ' +
                this.query1_2_code +
                (format === 'pdf' ? '.pdf' : '.xlsx');
              a.href = window.URL.createObjectURL(blob);
              a.click();
            })
            .add(() => {
              this.loading = false;
            });
          break;
          case 4:
          this.loading = true;
          this.reportService
            .DownloadReport6_2_4(this.query1_4_month,this.query1_4_year, this.query1_4_orderBy, format)
            .subscribe((response) => {
              const blob: Blob = response.body as Blob;
              const a = document.createElement('a');
              a.download =
                'REPORTE 6.2.4 - ' +
                this.query1_2_code +
                (format === 'pdf' ? '.pdf' : '.xlsx');
              a.href = window.URL.createObjectURL(blob);
              a.click();
            })
            .add(() => {
              this.loading = false;
            });
          break;
          case 5:
            this.loading = true;
            this.reportService
              .DownloadReport_Realizado_Pendiente(this.query1_4_month,this.query1_4_year, 'RP', format)
              .subscribe((response) => {
                const blob: Blob = response.body as Blob;
                const a = document.createElement('a');
                a.download =
                  'REPORTE_REALIZADOS_PENDIENTES_REPORTEROS' +
                  this.query1_4_month +
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

  listaReporteros : ComboDataName[] = []

  query1_1_start : Date = new Date
  query1_1_startString = ""
  query1_1_end : Date = new Date
  query1_1_endString = ""

  query1_1_code = ""

  query1_1_pdfSrc: any;
  query1_1_pdfBlob: Blob = new Blob();

  selectQuery6_2_1(){
    this.loading = true
    this.reportService
    .DownloadReport6_2_1(this.query1_1_startString, this.query1_1_endString,this.query1_1_code, 'pdf')
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
  formatDateToString(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0'); // Get day and pad with 0 if needed
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based) and pad
    const year = date.getFullYear(); // Get full year
    return `${day}/${month}/${year}`; // Return formatted string
}
  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
  selectStartDate_1(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query1_1_startString = this.formatDate(selectedDate);
    }
  }
  selectEndDate_1(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query1_1_endString = this.formatDate(selectedDate);
    }
  }

  query1_2_code = ""

  query1_2_pdfSrc: any;
  query1_2_pdfBlob: Blob = new Blob();

  selectQuery6_2_2(){
    this.loading = true
    this.reportService
    .DownloadReport6_2_2(this.query1_2_code, 'pdf')
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

  query1_3_start : Date = new Date
  query1_3_startString = ""
  query1_3_end : Date = new Date
  query1_3_endString = ""

  query1_3_code = ""
  query1_3_cycle = ""

  query1_3_pdfSrc: any;
  query1_3_pdfBlob: Blob = new Blob();

  selectStartDate_3(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query1_3_startString = this.formatDate(selectedDate);
    }
  }
  selectEndDate_3(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query1_3_endString = this.formatDate(selectedDate);
    }
  }
  selectQuery6_2_3(){
    this.loading = true
    this.reportService
    .DownloadReport6_2_3(this.query1_3_cycle,this.query1_3_code, 'pdf')
    .subscribe((response) => {
      this.query1_3_pdfBlob = response.body as Blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl: string = reader.result as string;
        this.query1_3_pdfSrc = dataUrl;
      };
      reader.readAsDataURL(this.query1_3_pdfBlob);
    })
    .add(() => {
      this.loading = false;
    });
  }

  query1_4_month = 1;
  query1_4_year = 2024;
  query1_4_orderBy = "C";

  query1_4_pdfSrc: any;
  query1_4_pdfBlob: Blob = new Blob();
  selectQuery6_2_4(){
    this.loading = true
    this.reportService
    .DownloadReport6_2_4(this.query1_4_month, this.query1_4_year,this.query1_4_orderBy, 'pdf')
    .subscribe((response) => {
      this.query1_4_pdfBlob = response.body as Blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl: string = reader.result as string;
        this.query1_4_pdfSrc = dataUrl;
      };
      reader.readAsDataURL(this.query1_4_pdfBlob);
    })
    .add(() => {
      this.loading = false;
    });
  }
  query1_5_pdfSrc: any;
  query1_5_pdfBlob: Blob = new Blob();
  selectQuery6_2_5(){
    this.loading = true
    this.reportService
    .DownloadReport_Realizado_Pendiente(this.query1_4_month, this.query1_4_year,'RP', 'pdf')
    .subscribe((response) => {
      this.query1_5_pdfBlob = response.body as Blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl: string = reader.result as string;
        this.query1_5_pdfSrc = dataUrl;
      };
      reader.readAsDataURL(this.query1_5_pdfBlob);
    })
    .add(() => {
      this.loading = false;
    });
  }

}
