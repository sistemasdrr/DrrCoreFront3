import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pais } from 'app/models/combo';
import { AbonadoT } from 'app/models/mantenimiento/abonado';
import { ComboService } from 'app/services/combo.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { ReportService } from 'app/services/report.service';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-abonados',
  templateUrl: './abonados.component.html',
  styleUrls: ['./abonados.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class AbonadosComponent implements OnInit {
  years: number[] = [];

  breadscrums = [
    {
      title: 'Reportes de Abonados',
      items: ['Reportes'],
      active: 'Abonados',
    },
  ];

  loading = false;

  idQuery = 1;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private abonadoService: AbonadoService,
    private reportService: ReportService,
    private comboService: ComboService
  ) {
    this.filterPais1 = new Observable<Pais[]>();
    this.filterPais2 = new Observable<Pais[]>();
  }

  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    this.query1_6_month = currentMonth+1
    this.query1_7_month = currentMonth+1
    this.query1_8_month = currentMonth+1
    this.query1_9_month = currentMonth+1
    const startYear = currentYear - 10;
    this.query1_5_year = currentYear;
    this.query1_6_year = currentYear;
    this.query1_7_year = currentYear;
    this.query1_8_year = currentYear;
    this.query1_9_year = currentYear;
    this.query1_10_year = currentYear;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
    this.abonadoService.getAbonados('', '', '').subscribe(
      (response) => {
        if (response.isSuccess === true && response.isWarning === false) {
          this.DTQuery1_1.data = response.data;
          this.DTQuery1_1.sort = this.sort;
          this.DTQuery1_1.paginator = this.paginator;
        }
      },
      (error) => {}
    );
    this.comboService.getPaises().subscribe((response) => {
      if (response.isSuccess == true) {
        this.paises = response.data;
      }
    });
    this.filterPais1 = this.query1_4_controlPaises.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.valor;
        return name ? this._filterPais(name as string) : this.paises.slice();
      })
    );
    this.filterPais2 = this.query1_5_controlPaises.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.valor;
        return name ? this._filterPais(name as string) : this.paises.slice();
      })
    );
  }
  descargarDocumento(idQuery: number, format: string) {
    switch (idQuery) {
      case 1:
        this.loading = true;
        this.reportService
          .DownloadReport6_1_5(this.query1_1_idSubscriber, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'Ficha de Abonado - ' +
              this.subcriberCode +
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
          .DownloadReport6_1_7(this.query1_2_orderBy, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'Lista de Abonado' + (format === 'pdf' ? '.pdf' : '.xlsx');
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
          .DownloadReport6_1_14(this.query1_3_show, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'Informes Pendientes, Vencidos y Por Vencer' +
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
          .DownloadReport6_1_15(this.query1_4_idCountry, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'Listado de Abonado Por País' +
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
          .DownloadReport6_1_18(
            this.query1_5_idCountry,
            this.query1_5_year,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'Informes Solicitados Por País' +
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
          .DownloadReport6_1_19_1(
            this.query1_6_month,
            this.query1_6_year,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'Informes Solicitados Por Dia - Abonado' +
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
          .DownloadReport6_1_19_2(
            this.query1_7_month,
            this.query1_7_year,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'Informes Solicitados Por Dia - País' +
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
          .DownloadReport6_1_20(this.query1_8_month, this.query1_8_year, format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'Informes Atendidos Por Dia' +
              (format === 'pdf' ? '.pdf' : '.xlsx');
            a.href = window.URL.createObjectURL(blob);
            a.click();
          })
          .add(() => {
            this.loading = false;
          });
        break;
      case 9:
        this.loading = true;
        this.reportService
          .DownloadReport6_1_21(
            this.query1_9_month,
            this.query1_9_year,
            this.query1_9_orderBy,
            format
          )
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'CUADRO ESTADISTICO DE INFORMES ATENDIDOS POR MES' +
              (format === 'pdf' ? '.pdf' : '.xlsx');
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
          .DownloadReport6_1_25(format)
          .subscribe((response) => {
            const blob: Blob = response.body as Blob;
            const a = document.createElement('a');
            a.download =
              'CUADRO ESTADISTICO DE INFORMES ATENDIDOS A LOS ABONADOS' +
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

  private _filterPais(description: string): Pais[] {
    const filterValue = description.toLowerCase();
    return this.paises.filter((pais) =>
      pais.valor.toLowerCase().includes(filterValue)
    );
  }
  displayPais(pais: Pais): string {
    return pais && pais.valor ? pais.valor : '';
  }

  DTQuery1_1 = new MatTableDataSource<AbonadoT>();
  columnsQuery1_1: string[] = ['name', 'options'];

  query1_1_idSubscriber = 0;
  subcriberCode = '';

  query1_1_pdfSrc: any;
  query1_1_pdfBlob: Blob = new Blob();

  quary1_1selectSubscriber(idSubscriber: number, code: string) {
    this.loading = true;
    this.reportService
      .DownloadReport6_1_5(idSubscriber, 'pdf')
      .subscribe((response) => {
        this.query1_1_idSubscriber = idSubscriber;
        this.subcriberCode = code;
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

  query1_2_orderBy = '';

  query1_2_pdfSrc: any;
  query1_2_pdfBlob: Blob = new Blob();
  seleccionarOrden(orderBy: string) {
    this.loading = true;
    this.reportService
      .DownloadReport6_1_7(orderBy, 'pdf')
      .subscribe((response) => {
        this.query1_2_orderBy = orderBy;
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

  query1_3_show = '';

  query1_3_pdfSrc: any;
  query1_3_pdfBlob: Blob = new Blob();

  selectQuary1_3(type: string) {
    this.loading = true;
    this.reportService
      .DownloadReport6_1_14(type, 'pdf')
      .subscribe((response) => {
        this.query1_3_pdfBlob = response.body as Blob;
        this.query1_3_show = type;
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

  paises: Pais[] = [];
  filterPais1: Observable<Pais[]>;

  query1_4_idCountry = 0;
  query1_4_iconoSeleccionado = '';

  query1_4_controlPaises = new FormControl<string | Pais>('');
  query1_4_msgPais = '';
  query1_4_colorMsgPais = '';
  query1_4_paisSeleccionado: Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',
  };

  query1_4_pdfSrc: any;
  query1_4_pdfBlob: Blob = new Blob();

  query1_4_limpiarSeleccionPais() {
    this.query1_4_controlPaises.reset();
    this.query1_4_idCountry = 0;
    this.query1_4_iconoSeleccionado = '';
  }
  async query1_4_cambioPais(pais: Pais) {
    if (pais !== null) {
      if (
        typeof pais === 'string' ||
        pais === null ||
        this.query1_4_paisSeleccionado.id === 0
      ) {
        this.query1_4_msgPais = 'Seleccione una opción.';
        this.query1_4_colorMsgPais = 'red';
        this.query1_4_iconoSeleccionado = '';
        this.query1_4_idCountry = 0;
      } else {
        this.query1_4_msgPais = 'Opción Seleccionada';
        this.query1_4_colorMsgPais = 'green';
        this.query1_4_iconoSeleccionado = pais.bandera;
        this.query1_4_idCountry = pais.id;


      }
    } else {
      this.query1_4_idCountry = 0;
      console.log(this.query1_4_idCountry);
      this.query1_4_msgPais = 'Seleccione una opción.';
      this.query1_4_colorMsgPais = 'red';
    }
  }

  selectQuery1_4(){
    this.loading = true;
        this.reportService
          .DownloadReport6_1_15(this.query1_4_idCountry, 'pdf')
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

  query1_5_idCountry = 0;
  query1_5_year = 0;
  query1_5_iconoSeleccionado = '';

  filterPais2: Observable<Pais[]>;
  query1_5_controlPaises = new FormControl<string | Pais>('');
  query1_5_msgPais = '';
  query1_5_colorMsgPais = '';
  query1_5_paisSeleccionado: Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',
  };

  query1_5_pdfSrc: any;
  query1_5_pdfBlob: Blob = new Blob();

  query1_5_limpiarSeleccionPais() {
    this.query1_5_controlPaises.reset();
    this.query1_5_idCountry = 0;
    this.query1_5_iconoSeleccionado = '';
  }
  async query1_5_cambioPais(pais: Pais) {
    if (pais !== null) {
      if (
        typeof pais === 'string' ||
        pais === null ||
        this.query1_5_paisSeleccionado.id === 0
      ) {
        this.query1_5_msgPais = 'Seleccione una opción.';
        this.query1_5_colorMsgPais = 'red';
        this.query1_5_iconoSeleccionado = '';
        this.query1_5_idCountry = 0;
      } else {
        this.query1_5_msgPais = 'Opción Seleccionada';
        this.query1_5_colorMsgPais = 'green';
        this.query1_5_iconoSeleccionado = pais.bandera;
        this.query1_5_idCountry = pais.id;


      }
    } else {
      this.query1_5_idCountry = 0;
      console.log(this.query1_5_idCountry);
      this.query1_5_msgPais = 'Seleccione una opción.';
      this.query1_5_colorMsgPais = 'red';
    }
  }

  selectQuery1_5(){
    this.loading = true;

        this.reportService
          .DownloadReport6_1_18(
            this.query1_5_idCountry,
            this.query1_5_year,
            'pdf'
          )
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

  query1_6_month = 1;
  query1_6_year = 0;
  query1_6_pdfSrc: any;
  query1_6_pdfBlob: Blob = new Blob();

  query1_6Cambio(query1_6_month: number, query1_6_year: number) {
    this.loading = true;

    this.reportService
      .DownloadReport6_1_19_1(query1_6_month, query1_6_year, 'pdf')
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
  query1_7_month = 1;
  query1_7_year = 0;
  query1_7_pdfSrc: any;
  query1_7_pdfBlob: Blob = new Blob();

  query1_7Cambio(query1_7_month: number, query1_7_year: number) {
    this.loading = true;

    this.reportService
      .DownloadReport6_1_19_2(query1_7_month, query1_7_year, 'pdf')
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

  query1_8_month = 1;
  query1_8_year = 0;
  query1_8_pdfSrc: any;
  query1_8_pdfBlob: Blob = new Blob();

  query1_8Cambio(query1_8_month: number, query1_8_year: number) {
    this.loading = true;

    this.reportService
      .DownloadReport6_1_20(query1_8_month, query1_8_year, 'pdf')
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

  query1_9_month = 1;
  query1_9_year = 0;
  query1_9_orderBy = 'C';
  query1_9_pdfSrc: any;
  query1_9_pdfBlob: Blob = new Blob();
  query1_9Cambio(query1_9_month: number, query1_9_year: number) {
    this.loading = true;
    this.reportService
      .DownloadReport6_1_21(
        query1_9_month,
        query1_9_year,
        this.query1_9_orderBy,
        'pdf'
      )
      .subscribe((response) => {
        this.query1_9_pdfBlob = response.body as Blob;
        const reader = new FileReader();
        reader.onloadend = () => {
          const dataUrl: string = reader.result as string;
          this.query1_9_pdfSrc = dataUrl;
        };
        reader.readAsDataURL(this.query1_9_pdfBlob);
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

  query1_11_pdfSrc: any;
  query1_11_pdfBlob: Blob = new Blob();
  query1_11Cambio() {
    this.loading = true;

    this.reportService
      .DownloadReport6_1_25('pdf')
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
  selectQuery() {
    console.log(this.idQuery);
    switch (this.idQuery) {
      case 6:
        this.query1_6Cambio(this.query1_6_month, this.query1_6_year);
        break;
      case 7:
        this.query1_7Cambio(this.query1_7_month, this.query1_7_year);
        break;
      case 8:
        this.query1_8Cambio(this.query1_8_month, this.query1_8_year);
        break;
      case 9:
        this.query1_9Cambio(this.query1_9_month, this.query1_9_year);
        break;
      case 10:
        this.query1_10Cambio();
        break;
      case 11:
        this.query1_11Cambio();
        break;
    }
  }
}
