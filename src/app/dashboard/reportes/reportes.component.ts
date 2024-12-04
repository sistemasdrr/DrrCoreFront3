import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComboDataName } from 'app/models/combo';
import { ComboService } from 'app/services/combo.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { GetReport7_10_1, Report7_10_2_Details, Report7_10_2_Main, ReportService } from 'app/services/report.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss'],
})
export class ReportesComponent implements OnInit {
  loading = false;
  constructor(
    private abonadoService: AbonadoService,
    private reportService: ReportService,
    private comboService: ComboService
  ) {}

  ngOnInit() {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const startYear = currentYear - 5;
    this.query5_1_2_year = currentYear;
    this.query6_3_10_year = currentYear;
    this.query7_1_start = currentYear - 1;
    this.query7_1_end = currentYear;
    this.query7_3_year = currentYear;
    this.query7_4_year = currentYear;
    this.query7_11_year = currentYear;
    this.query7_12_1_year = currentYear;
    this.query7_12_2_year = currentYear;
    this.query7_12_1_month = currentMonth + 1;
    this.query7_13_1_year = currentYear;
    this.query7_13_2_year = currentYear;
    this.query7_13_1_month = currentMonth + 1;
    this.query7_5_1_year = currentYear;
    this.query7_5_1_month = currentMonth + 1;
    this.query7_5_2_year = currentYear;
    this.query7_5_2_month = currentMonth + 1;
    this.query7_5_3_year = currentYear;
    this.query7_5_4_year = currentYear;
    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }

    this.selectQuery5_1_2();
    this.comboService.getAgents().subscribe((response) => {
      if (response.isSuccess === true) {
        this.listaAgentes = response.data;
      }
    });
    this.comboService.getReporter().subscribe((response) => {
      if (response.isSuccess === true) {
        this.listaReporteros = response.data;
      }
    });
    this.comboService.getAbonados().subscribe((response) => {
      if (response.isSuccess === true) {
        this.listaAbonados = response.data;
      }
    });
  }

  years: number[] = [];

  breadscrums = [
    {
      title: 'Reportes de Gerencia',
      items: ['Reportes'],
      active: 'Gerencia',
    },
  ];

  descargarDocumento(idQuery: number, format: string) {
    switch (idQuery) {
      case 1:
        this.loading = true;
        this.reportService
          .DownloadReport5_1_2(this.query5_1_2_year, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 5.1.2' + (format === 'pdf' ? '.pdf' : '.xlsx');
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
          .DownloadReport6_1_7Ger(
            this.query6_1_7_orderBy,
            this.query6_1_7_type,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.1.7.1' + (format === 'pdf' ? '.pdf' : '.xlsx');
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
          .DownloadReport6_1_7Ger(
            this.query6_1_7_orderBy,
            this.query6_1_7_type,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.1.7.2' + (format === 'pdf' ? '.pdf' : '.xlsx');
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
          .DownloadReport6_1_7Ger(
            this.query6_1_7_orderBy,
            this.query6_1_7_type,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.1.7.4' + (format === 'pdf' ? '.pdf' : '.xlsx');
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
          .DownloadReport6_1_7Ger(
            this.query6_1_7_orderBy,
            this.query6_1_7_type,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.1.7.5' + (format === 'pdf' ? '.pdf' : '.xlsx');
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
          .DownloadReport6_1_7Ger(
            this.query6_1_7_orderBy,
            this.query6_1_7_type,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.1.7.6' + (format === 'pdf' ? '.pdf' : '.xlsx');
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
          .DownloadReport6_1_7Ger(
            this.query6_1_7_orderBy,
            this.query6_1_7_type,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.1.7.7' + (format === 'pdf' ? '.pdf' : '.xlsx');
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
          .DownloadReport6_1_7Ger(
            this.query6_1_7_orderBy,
            this.query6_1_7_type,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.1.7.8' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 10:
        this.loading = true;
        this.reportService
          .DownloadReport6_1_22(
            this.query1_10_year,
            this.query1_10_orderBy,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'CUADRO ESTADISTICO DE INFORMES ATENDIDOS POR AÑO' +
              (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 11:
        this.loading = true;
        this.reportService
          .DownloadReport6_3_10(
            this.query6_3_10_code,
            this.query6_3_10_year,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 6.3.10' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 12:
        this.loading = true;
        this.reportService
          .DownloadReport7_1(this.query7_1_start, this.query7_1_end, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download = 'REPORTE 7.1' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 13:
        this.loading = true;
        this.reportService
          .DownloadReport7_3(this.query7_3_code, this.query7_3_year, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download = 'REPORTE 7.3' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 14:
        this.loading = true;
        this.reportService
          .DownloadReport7_4(this.query7_4_year, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download = 'REPORTE 7.4' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
        case 17:
        this.loading = true;
        this.reportService
          .DownloadReport7_10_1(this.query7_10_1_number, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download = 'REPORTE 7.10.1' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 18:
        this.loading = true;
        this.reportService
          .DownloadReport7_11(this.query7_11_code, this.query7_11_year, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download = 'REPORTE 7.11' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 19:
        this.loading = true;
        this.reportService
          .DownloadReport7_12_1(
            this.query7_12_1_month,
            this.query7_12_1_year,
            this.query7_12_1_code,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 7.12.1' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 20:
        this.loading = true;
        this.reportService
          .DownloadReport7_12_2(
            this.query7_12_2_year,
            this.query7_12_2_code,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 7.12.2' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 21:
        this.loading = true;
        this.reportService
          .DownloadReport7_13_1(
            this.query7_13_1_month,
            this.query7_13_1_year,
            this.query7_13_1_code,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 7.13.1' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 22:
        this.loading = true;
        this.reportService
          .DownloadReport7_13_2(
            this.query7_13_2_year,
            this.query7_13_2_code,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'REPORTE 7.13.2' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 23:
        this.loading = true;
        this.reportService
          .DownloadReport7_15(format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download = 'REPORTE 7.15' + (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
        case 31:
          this.loading = true;
          this.reportService
            .DownloadReport7_5_1(this.query7_5_1_month,this.query7_5_1_year,format)
            .subscribe((response) => {
              const blob: Blob = response.body as Blob;
              const a = document.createElement('a');
              a.download = 'REPORTE 7.5.1' + (format === 'pdf' ? '.pdf' : '.xlsx');
              a.href = window.URL.createObjectURL(blob);
              a.click();
            })
            .add(() => {
              this.loading = false;
            });
        break;
        case 32:
          this.loading = true;
          this.reportService
            .DownloadReport7_5_2(this.query7_5_2_month,this.query7_5_2_year,this.query7_5_2_code,format)
            .subscribe((response) => {
              const blob: Blob = response.body as Blob;
              const a = document.createElement('a');
              a.download = 'REPORTE 7.5.2' + (format === 'pdf' ? '.pdf' : '.xlsx');
              a.href = window.URL.createObjectURL(blob);
              a.click();
            })
            .add(() => {
              this.loading = false;
            });
        break;
        case 33:
          this.loading = true;
          this.reportService
            .DownloadReport7_5_3(this.query7_5_3_year,format)
            .subscribe((response) => {
              const blob: Blob = response.body as Blob;
              const a = document.createElement('a');
              a.download = 'REPORTE 7.5.3' + (format === 'pdf' ? '.pdf' : '.xlsx');
              a.href = window.URL.createObjectURL(blob);
              a.click();
            })
            .add(() => {
              this.loading = false;
            });
        break;
        case 34:
          this.loading = true;
          this.reportService
            .DownloadReport7_5_4(this.query7_5_4_year,format)
            .subscribe((response) => {
              const blob: Blob = response.body as Blob;
              const a = document.createElement('a');
              a.download = 'REPORTE 7.5.4' + (format === 'pdf' ? '.pdf' : '.xlsx');
              a.href = window.URL.createObjectURL(blob);
              a.click();
            })
            .add(() => {
              this.loading = false;
            });
        break;
    }
  }
  descargarDocumento7_10_2(format : string){
    this.loading = true;
    this.reportService
      .DownloadReport7_10_2(this.query7_10_2_id,this.query7_10_2_about, format)
      .subscribe((response) => {
        const blob: Blob = response.body as Blob;
        const a = document.createElement('a');
        a.download = 'REPORTE 7.10.2' + (format === 'pdf' ? '.pdf' : '.xlsx');
        a.href = window.URL.createObjectURL(blob);
        a.click();
      })
      .add(() => {
        this.loading = false;
      });
  }
  idQuery = 1;
  selectQuery() {
    switch (this.idQuery) {
      case 1:
        this.selectQuery5_1_2();
        break;
      case 2:
        this.query6_1_7_type = 'To';
        this.selectQuery6_1_7();
        break;
      case 3:
        this.query6_1_7_type = 'Na';
        this.selectQuery6_1_7();
        break;
      case 4:
        this.query6_1_7_type = 'Am';
        this.selectQuery6_1_7();
        break;
      case 5:
        this.query6_1_7_type = 'Eu';
        this.selectQuery6_1_7();
        break;
      case 6:
        this.query6_1_7_type = 'As';
        this.selectQuery6_1_7();
        break;
      case 7:
        this.query6_1_7_type = 'Af';
        this.selectQuery6_1_7();
        break;
      case 8:
        this.query6_1_7_type = 'Oc';
        this.selectQuery6_1_7();
        break;
      case 12:
        this.selectQuery7_1();
        break;
      case 14:
        this.selectQuery7_4();
        break;
      case 17:
        this.selectQuery7_10_1();
        break;
      case 23:
        this.selectQuery7_15();
        break;
      case 31:
        this.selectQuery7_5_1();
        break;
      case 33:
        this.selectQuery7_5_3();
        break;
      case 34:
        this.selectQuery7_5_4();
        break;
    }
  }

  query5_1_2_year = 0;
  query5_1_2_pdfSrc: any;
  query5_1_2_pdfBlob: Blob = new Blob();
  selectQuery5_1_2() {
    this.loading = true;

    this.reportService
      .DownloadReport5_1_2(this.query5_1_2_year, 'pdf')
      .subscribe((response) => {
        this.query5_1_2_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query5_1_2_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query5_1_2_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query6_1_7_orderBy = 'C';
  query6_1_7_type = 'To';
  query6_1_7_pdfSrc: any;
  query6_1_7_pdfBlob: Blob = new Blob();
  selectQuery6_1_7() {
    this.loading = true;

    this.reportService
      .DownloadReport6_1_7Ger(
        this.query6_1_7_orderBy,
        this.query6_1_7_type,
        'pdf'
      )
      .subscribe((response) => {
        this.query6_1_7_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query6_1_7_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query6_1_7_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query1_10_year = 0;
  query1_10_orderBy = 'C';
  query1_10_pdfSrc: any;
  query1_10_pdfBlob: Blob = new Blob();
  query1_10Cambio() {
    this.loading = true;

    this.reportService
      .DownloadReport6_1_22(this.query1_10_year, this.query1_10_orderBy, 'pdf')
      .subscribe((response) => {
        this.query1_10_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query1_10_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query1_10_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  listaAgentes: ComboDataName[] = [];
  listaReporteros: ComboDataName[] = [];
  listaAbonados: ComboDataName[] = [];

  query6_3_10_code = '';
  query6_3_10_year = 0;
  query6_3_10_pdfSrc: any;
  query6_3_10_pdfBlob: Blob = new Blob();
  query6_3_10() {
    this.loading = true;

    this.reportService
      .DownloadReport6_3_10(this.query6_3_10_code, this.query6_3_10_year, 'pdf')
      .subscribe((response) => {
        this.query6_3_10_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query6_3_10_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query6_3_10_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_1_start = 0;
  query7_1_end = 0;
  query7_1_pdfSrc: any;
  query7_1_pdfBlob: Blob = new Blob();
  selectQuery7_1() {
    this.loading = true;
    this.reportService
      .DownloadReport7_1(this.query7_1_start, this.query7_1_end, 'pdf')
      .subscribe((response) => {
        this.query7_1_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_1_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_1_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_3_code = '';
  query7_3_year = 0;
  query7_3_pdfSrc: any;
  query7_3_pdfBlob: Blob = new Blob();
  selectQuery7_3() {
    this.loading = true;
    this.reportService
      .DownloadReport7_3(this.query7_3_code, this.query7_3_year, 'pdf')
      .subscribe((response) => {
        this.query7_3_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_3_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_3_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_4_year = 0;
  query7_4_pdfSrc: any;
  query7_4_pdfBlob: Blob = new Blob();
  selectQuery7_4() {
    this.loading = true;
    this.reportService
      .DownloadReport7_4(this.query7_4_year, 'pdf')
      .subscribe((response) => {
        this.query7_4_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_4_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_4_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_5_1_month = 0
  query7_5_1_year = 0
  query7_5_1_pdfSrc: any;
  query7_5_1_pdfBlob: Blob = new Blob();
  selectQuery7_5_1() {
    this.loading = true;
    this.reportService
      .DownloadReport7_5_1(this.query7_5_1_month,this.query7_5_1_year , 'pdf')
      .subscribe((response) => {
        this.query7_5_1_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_5_1_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_5_1_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_5_2_code = ""
  query7_5_2_month = 0
  query7_5_2_year = 0
  query7_5_2_pdfSrc: any;
  query7_5_2_pdfBlob: Blob = new Blob();
  selectQuery7_5_2() {
    this.loading = true;
    this.reportService
      .DownloadReport7_5_2(this.query7_5_2_month,this.query7_5_2_year, this.query7_5_2_code, 'pdf')
      .subscribe((response) => {
        this.query7_5_2_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_5_2_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_5_2_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_5_3_year = 0
  query7_5_3_pdfSrc: any;
  query7_5_3_pdfBlob: Blob = new Blob();
  selectQuery7_5_3() {
    this.loading = true;
    this.reportService
      .DownloadReport7_5_3(this.query7_5_3_year, 'pdf')
      .subscribe((response) => {
        this.query7_5_3_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_5_3_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_5_3_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }
  query7_5_4_year = 0
  query7_5_4_pdfSrc: any;
  query7_5_4_pdfBlob: Blob = new Blob();
  selectQuery7_5_4() {
    this.loading = true;
    this.reportService
      .DownloadReport7_5_4(this.query7_5_4_year, 'pdf')
      .subscribe((response) => {
        this.query7_5_4_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_5_4_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_5_4_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_10_1_number = 1

  query7_10_2_id = 0
  query7_10_2_about = ""

  @ViewChild(MatPaginator) paginator1!: MatPaginator;
  @ViewChild(MatPaginator) paginator2!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource1  = new MatTableDataSource<GetReport7_10_1>
  dataSource1_columns = ["name","country","counting","lastSearched"]
  dataSource2_main_columns = ["orderDate","dispatchtDate","name","procedureType"]
  dataSource2_details_columns = ["name","counting"]
  dataSource2_main  = new MatTableDataSource<Report7_10_2_Main>
  dataSource2_details  = new MatTableDataSource<Report7_10_2_Details>

  selectQuery7_10_1(){
    this.loading = true;
    this.reportService
      .GetReport7_10_1(this.query7_10_1_number)
      .subscribe((response) => {
        if(response.isSuccess === true){
          this.dataSource1.data = response.data
          this.dataSource1.paginator = this.paginator1

          this.dataSource2_main.data = []
          this.dataSource2_details.data = []
          this.query7_10_2_id = 0
          this.query7_10_2_about = ""
        }
      })
      .add(() => {
        this.loading = false;
      });
  }
  selectQuery7_10_2(id : number, about : string){
    this.query7_10_2_id = id
    this.query7_10_2_about = about

    this.loading = true;
    this.reportService
      .GetReport7_10_2(id, about)
      .subscribe((response) => {
        if(response.isSuccess === true){
          this.dataSource2_main.data = response.data.main
          this.dataSource2_details.data = response.data.details
        }
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_11_code = '';
  query7_11_year = 0;
  query7_11_pdfSrc: any;
  query7_11_pdfBlob: Blob = new Blob();
  selectQuery7_11() {
    this.loading = true;
    this.reportService
      .DownloadReport7_11(this.query7_11_code, this.query7_11_year, 'pdf')
      .subscribe((response) => {
        this.query7_11_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_11_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_11_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_12_1_code = '';
  query7_12_1_month = 0;
  query7_12_1_year = 0;
  query7_12_1_pdfSrc: any;
  query7_12_1_pdfBlob: Blob = new Blob();
  selectQuery7_12_1() {
    this.loading = true;
    this.reportService
      .DownloadReport7_12_1(
        this.query7_12_1_month,
        this.query7_12_1_year,
        this.query7_12_1_code,
        'pdf'
      )
      .subscribe((response) => {
        this.query7_12_1_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_12_1_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_12_1_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_12_2_code = '';
  query7_12_2_year = 0;
  query7_12_2_pdfSrc: any;
  query7_12_2_pdfBlob: Blob = new Blob();
  selectQuery7_12_2() {
    this.loading = true;
    this.reportService
      .DownloadReport7_12_2(this.query7_12_2_year, this.query7_12_2_code, 'pdf')
      .subscribe((response) => {
        this.query7_12_2_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_12_2_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_12_2_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_13_1_code = '';
  query7_13_1_month = 0;
  query7_13_1_year = 0;
  query7_13_1_pdfSrc: any;
  query7_13_1_pdfBlob: Blob = new Blob();
  selectQuery7_13_1() {
    this.loading = true;
    this.reportService
      .DownloadReport7_13_1(
        this.query7_13_1_month,
        this.query7_13_1_year,
        this.query7_13_1_code,
        'pdf'
      )
      .subscribe((response) => {
        this.query7_13_1_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_13_1_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_13_1_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }

  query7_13_2_code = '';
  query7_13_2_year = 0;
  query7_13_2_pdfSrc: any;
  query7_13_2_pdfBlob: Blob = new Blob();
  selectQuery7_13_2() {
    this.loading = true;
    this.reportService
      .DownloadReport7_13_2(this.query7_13_2_year, this.query7_13_2_code, 'pdf')
      .subscribe((response) => {
        this.query7_13_2_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_13_2_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_13_2_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }
  query7_15_pdfSrc: any;
  query7_15_pdfBlob: Blob = new Blob();
  selectQuery7_15() {
    this.loading = true;
    this.reportService
      .DownloadReport7_15('pdf')
      .subscribe((response) => {
        this.query7_15_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query7_15_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query7_15_pdfBlob);
      })
      .add(() => {
        this.loading = false;
      });
  }
}
