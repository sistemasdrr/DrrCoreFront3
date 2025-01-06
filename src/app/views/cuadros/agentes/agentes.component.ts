import { Component, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ComboDataName } from 'app/models/combo';
import { ComboService } from 'app/services/combo.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { ReportService } from 'app/services/report.service';
import * as moment from 'moment';

@Component({
    selector: 'app-agentes',
    templateUrl: './agentes.component.html',
    styleUrls: ['./agentes.component.scss'],
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
export class AgentesComponent implements OnInit {
  years: number[] = [];

  breadscrums = [
    {
      title: 'Reportes de Agentes',
      items: ['Reportes'],
      active: 'Agentes',
    },
  ];

  loading = false;
  zoom_to: number = 0.5;
  idQuery = 1;

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
    this.query1_4_year = currentYear;
    this.query1_6_year = currentYear;
    this.query1_4_month = currentMonth+1;
    this.query1_7_year = currentYear;
    this.query1_8_year = currentYear;
    this.query1_11_year = currentYear;
    this.query1_7_month = currentMonth+1;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
    this.comboService.getAgents().subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.listaAgentes = response.data
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
      case 0:
        this.selectQuery6_3_0();
        break;
      case 4:
        this.selectQuery6_3_4();
        break;
      case 5:
        this.selectQuery6_3_5();
        break;
      case 8:
        this.selectQuery6_3_8();
        break;
    }
  }
  zoom_in() {
    this.zoom_to = this.zoom_to + 0.25;
  }

  zoom_out() {
    if (this.zoom_to > 1) {
       this.zoom_to = this.zoom_to - 0.25;
    }
  }
  query1_0_pdfSrc: any;
  query1_0_pdfBlob: Blob = new Blob();
  selectQuery6_3_0(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_0('pdf')
    .subscribe((response) => {
      this.query1_0_pdfBlob = response.body as Blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl: string = reader.result as string;
        this.query1_0_pdfSrc = dataUrl;
      };
      reader.readAsDataURL(this.query1_0_pdfBlob);
    })
    .add(() => {
      this.loading = false;
    });
  }
  descargarDocumento(idQuery: number, format: string) {
    switch (idQuery) {
      case 0:
        this.loading = true;
        this.reportService
          .DownloadReport6_3_0(format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.3.0 - ' +
              this.query1_1_code +
              (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 1:
        this.loading = true;
        this.reportService
          .DownloadReport6_3_1(this.query1_1_startString, this.query1_1_endString,this.query1_1_code, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.3.1 - ' +
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
          .DownloadReport6_3_2(this.query1_2_code, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.3.2 - ' +
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
          .DownloadReport6_3_3(this.query1_3_startString, this.query1_3_endString, this.query1_3_code, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.3.3 - ' +
              this.query1_3_code +
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
          .DownloadReport6_3_4(this.query1_4_month, this.query1_4_year, this.query1_4_orderBy, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.3.4 - ' +

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
            .DownloadReport6_3_5(format)
            .subscribe((response) => {
              const blob: Blob = response.body as Blob;
              const a = document.createElement('a');
              a.download =
                'REPORTE 6.3.5 - ' +
                this.query1_2_code +
                (format === 'pdf' ? '.pdf' : '.xlsx');
              a.href = window.URL.createObjectURL(blob);
              a.click();
            })
            .add(() => {
              this.loading = false;
            });
          break;
          case 6:
          this.loading = true;
          this.reportService
            .DownloadReport6_3_6(this.query1_6_code,this.query1_6_year,format)
            .subscribe((response) => {
              const blob: Blob = response.body as Blob;
              const a = document.createElement('a');
              a.download =
                'REPORTE 6.3.6 - ' +
                this.query1_2_code +
                (format === 'pdf' ? '.pdf' : '.xlsx');
              a.href = window.URL.createObjectURL(blob);
              a.click();
            })
            .add(() => {
              this.loading = false;
            });
          break;
          case 7:
          this.loading = true;
          this.reportService
            .DownloadReport6_3_7(this.query1_7_code,this.query1_7_month,this.query1_7_year,format)
            .subscribe((response) => {
              const blob: Blob = response.body as Blob;
              const a = document.createElement('a');
              a.download =
                'REPORTE 6.3.7 - ' +
                this.query1_2_code +
                (format === 'pdf' ? '.pdf' : '.xlsx');
              a.href = window.URL.createObjectURL(blob);
              a.click();
            })
            .add(() => {
              this.loading = false;
            });
          break;
          case 8:
            this.loading = true;
            this.reportService
              .DownloadReport6_3_8(this.query1_8_type,this.query1_8_year,format)
              .subscribe((response) => {
                const blob: Blob = response.body as Blob;
                const a = document.createElement('a');
                a.download =
                  'REPORTE 6.3.8 - ' +
                  this.query1_2_code +
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

  listaAgentes : ComboDataName[] = []

  query1_1_start : Date = new Date
  query1_1_startString = ""
  query1_1_end : Date = new Date
  query1_1_endString = ""

  query1_1_code = ""

  query1_1_pdfSrc: any;
  query1_1_pdfBlob: Blob = new Blob();

  selectQuery6_3_1(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_1(this.query1_1_startString, this.query1_1_endString,this.query1_1_code, 'pdf')
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
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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

  selectQuery6_3_2(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_2(this.query1_2_code, 'pdf')
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
  selectQuery6_3_3(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_3(this.query1_3_startString, this.query1_3_endString,this.query1_3_code, 'pdf')
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
  selectQuery6_3_4(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_4(this.query1_4_month, this.query1_4_year,this.query1_4_orderBy, 'pdf')
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
  selectQuery6_3_5(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_5('pdf')
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

  query1_6_code  = ""
  query1_6_year  = 0

  query1_6_pdfSrc: any;
  query1_6_pdfBlob: Blob = new Blob();
  selectQuery6_3_6(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_6(this.query1_6_code, this.query1_6_year,'pdf')
    .subscribe((response) => {
      this.query1_6_pdfBlob = response.body as Blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl: string = reader.result as string;
        this.query1_6_pdfSrc = dataUrl;
      };
      reader.readAsDataURL(this.query1_6_pdfBlob);
    })
    .add(() => {
      this.loading = false;
    });
  }

  query1_7_code  = ""
  query1_7_month  = 0
  query1_7_year  = 0

  query1_7_pdfSrc: any;
  query1_7_pdfBlob: Blob = new Blob();
  selectQuery6_3_7(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_7(this.query1_7_code,this.query1_7_month, this.query1_7_year,'pdf')
    .subscribe((response) => {
      this.query1_7_pdfBlob = response.body as Blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl: string = reader.result as string;
        this.query1_7_pdfSrc = dataUrl;
      };
      reader.readAsDataURL(this.query1_7_pdfBlob);
    })
    .add(() => {
      this.loading = false;
    });
  }

  query1_8_type  = "A"
  query1_8_year  = 0

  query1_8_pdfSrc: any;
  query1_8_pdfBlob: Blob = new Blob();
  selectQuery6_3_8(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_8(this.query1_8_type, this.query1_8_year,'pdf')
    .subscribe((response) => {
      this.query1_8_pdfBlob = response.body as Blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl: string = reader.result as string;
        this.query1_8_pdfSrc = dataUrl;
      };
      reader.readAsDataURL(this.query1_8_pdfBlob);
    })
    .add(() => {
      this.loading = false;
    });
  }
  query1_11_code  = ""
  query1_11_year  = 0

  query1_11_pdfSrc: any;
  query1_11_pdfBlob: Blob = new Blob();
  selectQuery6_3_11(){
    this.loading = true
    this.reportService
    .DownloadReport6_3_11(this.query1_11_code, this.query1_11_year,'pdf')
    .subscribe((response) => {
      this.query1_11_pdfBlob = response.body as Blob;
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl: string = reader.result as string;
        this.query1_11_pdfSrc = dataUrl;
      };
      reader.readAsDataURL(this.query1_11_pdfBlob);
    })
    .add(() => {
      this.loading = false;
    });
  }
}
