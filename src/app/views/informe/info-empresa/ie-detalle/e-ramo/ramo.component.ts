import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CuadroImpoExpoComponent } from '@shared/components/cuadro-impo-expo/cuadro-impo-expo.component';
import { RamoActividadDialogComponent } from './ramo-actividad/ramo-actividad.component';
import { TraduccionDialogComponent } from '@shared/components/traduccion-dialog/traduccion-dialog.component';
import { Observable, map, startWith } from 'rxjs';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Pais } from 'app/models/combo';
import { PaisService } from 'app/services/pais.service';
import { DialogComercioComponent } from './dialog-comercio/dialog-comercio.component';
import { ComboService } from 'app/services/combo.service';
import { ComboData, ComboData3 } from 'app/models/combo';
import { ActivatedRoute } from '@angular/router';
import { RamoNegociosService } from 'app/services/informes/empresa/ramo-negocios.service';
import { CompanyBranch, WorkerHistory } from 'app/models/informes/empresa/ramo-negocios';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTooltip,
  ApexPlotOptions,
  ApexDataLabels,
  ApexYAxis,
  ApexXAxis,
  ApexLegend,
  ApexResponsive,
  ApexFill,
  ApexStroke,
  ApexGrid,
  ApexTitleSubtitle,
  ApexStates,
} from 'ng-apexcharts';
import { MatSort } from '@angular/material/sort';
import { AgregarHistorialTrabajadorComponent } from './agregar-historial-trabajador/agregar-historial-trabajador.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatPaginator } from '@angular/material/paginator';
import { VerPdfComponent } from '@shared/components/ver-pdf/ver-pdf.component';

export interface data {
  name: string;
}
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  colors: string[];
  legend: ApexLegend;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  states: ApexStates;
  fill: ApexFill;
};

@Component({
    selector: 'app-ramo',
    templateUrl: './ramo.component.html',
    styleUrls: ['./ramo.component.scss'],
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


export class RamoComponent implements OnInit, OnDestroy{

  id = 0
  idCompany = 0
  idBranchSector = 0
  idBusinessBranch = 0
  idBusinessBranchN = ""
  import = false
  export = false

  cashSale = ""
  cashSalePercentage = 0
  cashSaleComentary = ""
  cashSaleComentaryEng = ""

  creditSale = ""
  creditSalePercentage = 0
  creditSaleComentary = ""
  creditSaleComentaryEng = ""

  territorySale = ""
  territorySalePercentage = 0
  territorySaleComentary = ""
  territorySaleComentaryEng = ""

  abroadSale = ""
  abroadSalePercentage = 0
  abroadSaleComentary = ""
  abroadSaleComentaryEng = ""

  nationalPurchase = ""
  nationalPurchasesPercentage = 0
  nationalPurchasesComentary = ""
  nationalPurchasesComentaryEng = ""

  internationPurchase = ""
  internationalPurchasesPercentage = 0
  internationalPurchasesComentary = ""
  internationalPurchasesComentaryEng = ""

  workerNumber = 0
  idLandOwnership = 0
  totalArea = ""
  totalAreaEng = ""
  previousAddress = ""
  otherLocations = ""
  otherLocationsEng = ""
  activityDetailCommentary = ""
  activityDetailCommentaryEng = ""
  aditionalCommentary = ""
  aditionalCommentaryEng = ""
  descPrincipalAddress = ""
  descPrincipalAddressEng = ""
  tabCommentary = ""
  countriesExport = ""
  countriesImport = ""
  countriesExportEng = ""
  countriesImportEng = ""
  specificActivities = ""
  specificActivitiesEng = ""

  modeloActual : CompanyBranch[] = []
  modeloModificado : CompanyBranch[] = []

  listaSectorPrincipal : ComboData[] = []
  listaRamoNegocio : ComboData[] = []
  listaActividadEspecifica : ComboData3[] = []
  listaTitularidad : ComboData[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA];

  controlPaisesImpo = new FormControl<string | Pais>('')
  paisesImpo : Pais[] = []
  paisesSeleccionadosImpo : Pais[] = []
  filterPaisImpo : Observable<Pais[]>
  paisInformeImpo : Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',
  }

  controlPaisesExpo = new FormControl<string | Pais>('')
  paisesExpo : Pais[] = []
  paisesSeleccionadosExpo : Pais[] = []
  filterPaisExpo : Observable<Pais[]>
  paisInformeExpo : Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',
  }

  columnsWorkerHistory : string[] = ['numberYear', 'numberWorker','acciones']
  dataSourceWorkerHistory : MatTableDataSource<WorkerHistory>
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public areaChartOptions!: Partial<ChartOptions>;

  @ViewChild('paisExpoInput') paisExpoInput!: ElementRef<HTMLInputElement>;
  announcer = inject(LiveAnnouncer);

  public Editor: any = ClassicEditor;

  constructor(private dialog : MatDialog, private activatedRoute : ActivatedRoute,
    private paisService : PaisService, private comboService : ComboService, private ramoNegocioService : RamoNegociosService){

    this.filteredOptions = new Observable<data[]>()
    this.filterPaisImpo = new Observable<Pais[]>()
    this.filterPaisExpo = new Observable<Pais[]>()
    this.dataSourceWorkerHistory = new MatTableDataSource
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id?.includes('nuevo')) {
      this.idCompany = 0
    } else {
      this.idCompany = parseInt(id + '')
    }
  }
  compararModelosF : any

  ngOnInit() {
    const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
    if(paginaDetalleEmpresa){
      paginaDetalleEmpresa.classList.remove('hide-loader');
    }
    this.paisService.getPaises().subscribe(data => {
      if(data.isSuccess == true){
        this.paisesImpo = data.data;
        this.paisesExpo = data.data;
      }
    }
    )
    this.comboService.getTitularidad().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.listaTitularidad = response.data
        }
      }
    )

    if(this.idCompany !== 0){
      this.ramoNegocioService.getListWorkerHistory(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceWorkerHistory.data = response.data
            if(this.dataSourceWorkerHistory.data.length > 0){
              this.dataSourceWorkerHistory.data.sort((a, b) => {
                let numberA = parseInt(a.numberYear.toString(), 10);
                let numberB = parseInt(b.numberYear.toString(), 10);

                return numberB - numberA;
              });
              this.workerNumber = this.dataSourceWorkerHistory.data[0].numberWorker
            }
            this.dataSourceWorkerHistory.sort = this.sort
            this.dataSourceWorkerHistory.sort = this.sort
            this.dataSourceWorkerHistory.paginator = this.paginator
          }
        }
      )
      this.chart1()
      this.ramoNegocioService.getRamoNegocioByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            console.log(response.data)
            const ramoNegocio = response.data
            if(ramoNegocio){
              this.id = ramoNegocio.id
              this.idBranchSector = ramoNegocio.idBranchSector
              this.idBusinessBranch = ramoNegocio.idBusinessBranch
              this.specificActivities = ramoNegocio.specificActivities
              this.specificActivitiesEng = ramoNegocio.specificActivitiesEng
              this.import = ramoNegocio.import
              this.export = ramoNegocio.export

              this.cashSalePercentage = ramoNegocio.cashSalePercentage !== null ? ramoNegocio.cashSalePercentage : 0
              this.cashSaleComentary = ramoNegocio.cashSaleComentary
              this.cashSale = this.cashSalePercentage + '% | ' + ramoNegocio.cashSaleComentary

              this.creditSalePercentage = (ramoNegocio.creditSalePercentage !== null ? ramoNegocio.creditSalePercentage : 0)
              this.creditSaleComentary = ramoNegocio.creditSaleComentary
              this.creditSale = this.creditSalePercentage + '% | ' + ramoNegocio.creditSaleComentary

              this.territorySalePercentage = ramoNegocio.territorySalePercentage !== null ? ramoNegocio.territorySalePercentage : 0
              this.territorySaleComentary = ramoNegocio.territorySaleComentary
              this.territorySale = this.territorySalePercentage + '% | ' + ramoNegocio.territorySaleComentary

              this.abroadSalePercentage = ramoNegocio.abroadSalePercentage !== null ? ramoNegocio.abroadSalePercentage : 0
              this.abroadSaleComentary = ramoNegocio.abroadSaleComentary
              this.abroadSale = this.abroadSalePercentage + '% | ' + ramoNegocio.abroadSaleComentary

              this.nationalPurchasesPercentage = ramoNegocio.nationalPurchasesPercentage !== null ? ramoNegocio.nationalPurchasesPercentage : 0
              this.nationalPurchasesComentary = ramoNegocio.nationalPurchasesComentary
              this.nationalPurchase = this.nationalPurchasesPercentage + '% | ' + ramoNegocio.nationalPurchasesComentary

              this.internationalPurchasesPercentage = ramoNegocio.internationalPurchasesPercentage !== null ? ramoNegocio.internationalPurchasesPercentage : 0
              this.internationalPurchasesComentary = ramoNegocio.internationalPurchasesComentary
              this.internationPurchase = this.internationalPurchasesPercentage + '% | ' + ramoNegocio.internationalPurchasesComentary

              this.countriesImportEng = ramoNegocio.countriesImportEng
              this.countriesExportEng = ramoNegocio.countriesExportEng

              this.workerNumber = this.dataSourceWorkerHistory.data.length > 0 ? this.dataSourceWorkerHistory.data[0].numberWorker : ramoNegocio.workerNumber
              this.idLandOwnership = ramoNegocio.idLandOwnership
              this.totalArea = ramoNegocio.totalArea?? ''
              this.previousAddress = ramoNegocio.previousAddress?? ''
              this.otherLocations = ramoNegocio.otherLocations?? ''
              this.activityDetailCommentary = ramoNegocio.activityDetailCommentary?? ''
              this.aditionalCommentary = ramoNegocio.aditionalCommentary?? ''
              this.tabCommentary = ramoNegocio.tabCommentary?? ''
              this.descPrincipalAddress = ramoNegocio.descPrincipalAddress ?? ''

              if(ramoNegocio.traductions.length > 0){

                this.cashSaleComentaryEng = ramoNegocio.traductions[0].value === null ? "" : ramoNegocio.traductions[0].value
                this.creditSaleComentaryEng = ramoNegocio.traductions[1].value === null ? "" : ramoNegocio.traductions[1].value
                this.territorySaleComentaryEng = ramoNegocio.traductions[2].value === null ? "" : ramoNegocio.traductions[2].value
                this.abroadSaleComentaryEng = ramoNegocio.traductions[3].value === null ? "" : ramoNegocio.traductions[3].value
                this.nationalPurchasesComentaryEng = ramoNegocio.traductions[4].value === null ? "" : ramoNegocio.traductions[4].value
                this.internationalPurchasesComentaryEng = ramoNegocio.traductions[5].value === null ? "" : ramoNegocio.traductions[5].value
                this.totalAreaEng = ramoNegocio.traductions[6].value === null ? "" : ramoNegocio.traductions[6].value
                this.otherLocationsEng = ramoNegocio.traductions[7].value === null ? "" : ramoNegocio.traductions[7].value
                this.activityDetailCommentaryEng = ramoNegocio.traductions[8].value === null ? "" : ramoNegocio.traductions[8].value
                this.aditionalCommentaryEng = ramoNegocio.traductions[9].value === null ? "" : ramoNegocio.traductions[9].value
                this.descPrincipalAddressEng = ramoNegocio.traductions[10].value === null ? "" : ramoNegocio.traductions[10].value
              }
              if(ramoNegocio.countriesImport !== '' && ramoNegocio.countriesImport !== null){
                this.countriesImport = ramoNegocio.countriesImport
                // const paises = ramoNegocio.countriesImport.split(', ')
                // if(paises.length > 0){
                //   paises.forEach(p => {
                //     const pais = this.paisesImpo.filter(x => x.valor === p)[0]
                //     if(pais){
                //       this.paisesSeleccionadosImpo.push(pais)
                //     }
                //   });
                // }
              }

              if(ramoNegocio.countriesExport.length > 0 && ramoNegocio.countriesExport !== null){
                this.countriesExport = ramoNegocio.countriesExport
                // const paises = ramoNegocio.countriesExport.split(',')
                // if(paises.length > 0){
                //   paises.forEach(idPais => {
                //     const pais = this.paisesExpo.filter(x => x.id === parseInt(idPais))[0]
                //     if(pais){
                //       this.paisesSeleccionadosExpo.push(pais)
                //     }
                //   });
                // }
              }
            }
          }
        }
      ).add(
        () => {
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
          this.chart2()
          this.armarModeloActual()
          this.armarModeloModificado()
        }
      )
    }else{
      if(paginaDetalleEmpresa){
        paginaDetalleEmpresa.classList.add('hide-loader');
      }
    }
    this.comboService.getSectorPrincipal().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.listaSectorPrincipal = response.data
        }
      }
    ).add(
      () => {
        this.comboService.getRamoNegocio().subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.listaRamoNegocio = response.data
            }
          }
        ).add(
          () => {
            if(this.idBusinessBranch !== 0 && this.idBusinessBranch !== null){
              this.comboService.getActividadesEspecificas(this.idBusinessBranch).subscribe(
                (response) => {
                  if(response.isSuccess === true && response.isWarning === false){
                    this.listaActividadEspecifica = response.data
                  }
                }
              )
            }
          }
        )
      }
    )

    this.chart1();
    this.filterPaisImpo = this.controlPaisesImpo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.valor
        return name ? this._filterPaisImpo(name as string) : this.paisesImpo.slice()
      }),
    )
    this.filterPaisExpo = this.controlPaisesExpo.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.valor
        return name ? this._filterPaisExpo(name as string) : this.paisesExpo.slice()
      }),
    )
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.options.slice();
      }),
    );

    this.armarModeloActual()
    this.armarModeloModificado()
    this.compararModelosF = setInterval(() => {
      this.compararModelos();
    }, 2000);
  }
  ngOnDestroy(): void {
    if (this.compararModelosF) {
      clearInterval(this.compararModelosF);
    }
  }
  verPdf(){
    const dialogRef = this.dialog.open(VerPdfComponent,{
      data: {
        type : "E",
        idCompany : this.idCompany,
        section : "RAMO",
        language : "E",
        idTicket : 0
      },
    });
  }
  verPdfIngles(){
    const dialogRef = this.dialog.open(VerPdfComponent,{
      data: {
        type : "E",
        idCompany : this.idCompany,
        section : "RAMO",
        language : "I",
        idTicket : 0
      },
    });
  }
  compararModelos(){
    this.armarModeloModificado()
    if(JSON.stringify(this.modeloActual) !== JSON.stringify(this.modeloModificado)){
      const tabRamo = document.getElementById('tab-ramo-negocio') as HTMLElement | null;
      if (tabRamo) {
        tabRamo.classList.add('tab-cambios')
      }
    }else{
      const tabAntecedentes = document.getElementById('tab-ramo-negocio') as HTMLElement | null;
      if (tabAntecedentes) {
        tabAntecedentes.classList.remove('tab-cambios')
      }
    }
  }
  private chart1() {
    this.areaChartOptions = {
      series: [
        {
          name: 'New Clients',
          data: [31, 40, 28, 51, 42, 85, 77],
        },
        {
          name: 'Old Clients',
          data: [11, 32, 45, 32, 34, 52, 41],
        },
      ],
      chart: {
        height: 350,
        type: 'area',
        toolbar: {
          show: false,
        },
        foreColor: '#9aa0ac',
      },
      colors: ['#FC8380', '#6973C6'],
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      xaxis: {
        type: 'datetime',
        categories: [
          '2018-01-19',
          '2018-09-20',
          '2018-09-21',
          '2018-09-22',
          '2018-09-23',
          '2018-09-24',
          '2018-09-25',
        ],
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        offsetX: 0,
        offsetY: 0,
      },
      grid: {
        show: true,
        borderColor: '#9aa0ac',
        strokeDashArray: 1,
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true,
        },
        x: {
          show: true,
        },
      },
    };
  }
  private chart2() {
    if (this.dataSourceWorkerHistory.data.length > 0 || this.idCompany !== 0) {
      const listaFechas: string[] = [];
      const listaNW: number[] = [];
    
      this.dataSourceWorkerHistory.data.forEach(data => {
        listaFechas.push(data.numberYear+"");

        const amount = data.numberWorker

        if (!isNaN(amount)) {
          listaNW.push(amount);
        }
      });
       
      this.areaChartOptions = {
        series: [
          {
            name: 'Número de Trabajadores',
            data: listaNW,
          },
        ],
        chart: {
          height: 200,
          type: 'area',
          toolbar: {
            show: true,
          },
          foreColor: '#9aa0ac',
        },
        colors: ['#FC8380', '#6973C6', '#34eb80'],
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        xaxis: {
          type: 'category',
          categories: listaFechas,
        },
        legend: {
          show: true,
          position: 'top',
          horizontalAlign: 'center',
          offsetX: 0,
          offsetY: 0,
        },
        grid: {
          show: true,
          borderColor: '#9aa0ac',
          strokeDashArray: 1,
        },
        tooltip: {
          theme: 'dark',
          marker: {
            show: true,
          },
          x: {
            show: false,
          },
        },
      };

      console.log(listaFechas);
      console.log(listaNW);
    }
  }

  agregarHistorialTrabajador(){
    const dialogRef1 = this.dialog.open(AgregarHistorialTrabajadorComponent, {
      data: {
        id : 0,
        idCompany : this.idCompany
        },
      });
    dialogRef1.afterClosed().subscribe((data) => {
      if (data) {
        this.ramoNegocioService.getListWorkerHistory(this.idCompany).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){

              this.dataSourceWorkerHistory.data = response.data
              if(this.dataSourceWorkerHistory.data.length > 0){
                this.dataSourceWorkerHistory.data.sort((a, b) => {
                  let numberA = parseInt(a.numberYear.toString(), 10);
                  let numberB = parseInt(b.numberYear.toString(), 10);

                  return numberB - numberA;
                });
                this.workerNumber = this.dataSourceWorkerHistory.data[0].numberWorker
              }
              this.dataSourceWorkerHistory.sort = this.sort
              this.chart2()
            }
          }
        )
      }
    })
  }
  editarHistorialTrabajador(id : number){
    const dialogRef1 = this.dialog.open(AgregarHistorialTrabajadorComponent, {
      data: {
        id : id,
        idCompany : this.idCompany
        },
      });
    dialogRef1.afterClosed().subscribe((data) => {
      if (data) {
        this.ramoNegocioService.getListWorkerHistory(this.idCompany).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.dataSourceWorkerHistory.data = response.data
              if(this.dataSourceWorkerHistory.data.length > 0){
                this.dataSourceWorkerHistory.data.sort((a, b) => {
                  let numberA = parseInt(a.numberYear.toString(), 10);
                  let numberB = parseInt(b.numberYear.toString(), 10);

                  return numberB - numberA;
                });
                this.workerNumber = this.dataSourceWorkerHistory.data[0].numberWorker
              }
              this.dataSourceWorkerHistory.sort = this.sort
              this.chart2()
            }
          }
        )
      }
    })
  }

  eliminarHistorialTrabajador(id : number){
    Swal.fire({
      title: '¿Está seguro de eliminar este registro?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText : 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      width: '20rem',
      heightAuto : true
    }).then((result) => {
      if (result.value) {
        const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
        if(paginaDetalleEmpresa){
          paginaDetalleEmpresa.classList.remove('hide-loader');
        }
        this.ramoNegocioService.deleteWorkerHistory(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title: 'Se elimino el registro correctamente.',
                text: "",
                icon: 'success',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.ramoNegocioService.getListWorkerHistory(this.idCompany).subscribe(
                    (response) => {
                      if(response.isSuccess === true && response.isWarning === false){
                        this.dataSourceWorkerHistory.data = response.data
                        this.dataSourceWorkerHistory.data.sort((a, b) => {
                          let numberA = parseInt(a.numberYear.toString(), 10);
                          let numberB = parseInt(b.numberYear.toString(), 10);

                          return numberB - numberA;
                        });
                        this.workerNumber = this.dataSourceWorkerHistory.data[0].numberWorker
                        this.dataSourceWorkerHistory.sort = this.sort
                        this.chart2()
                      }
                    }
                  )
                }
              )
            }
          }
        ).add(
        () => {
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
        }
        )
      }
    })
  }
  armarModeloActual(){

    this.modeloActual[0] = {
      id : this.id,
      idCompany : this.idCompany,
      idBranchSector : this.idBranchSector,
      idBusinessBranch : this.idBusinessBranch,
      import : this.import,
      export : this.export,
      cashSalePercentage : this.cashSalePercentage === null ? 0 : this.cashSalePercentage,
      cashSaleComentary : this.cashSaleComentary,
      creditSalePercentage : this.creditSalePercentage === null ? 0 : this.creditSalePercentage,
      creditSaleComentary : this.creditSaleComentary,
      territorySalePercentage : this.territorySalePercentage === null ? 0 : this.territorySalePercentage,
      territorySaleComentary : this.territorySaleComentary,
      abroadSalePercentage : this.abroadSalePercentage === null ? 0 : this.abroadSalePercentage,
      abroadSaleComentary : this.abroadSaleComentary,
      nationalPurchasesPercentage : this.nationalPurchasesPercentage === null ? 0 : this.nationalPurchasesPercentage,
      nationalPurchasesComentary : this.nationalPurchasesComentary,
      internationalPurchasesPercentage : this.internationalPurchasesPercentage === null ? 0 : this.internationalPurchasesPercentage,
      internationalPurchasesComentary : this.internationalPurchasesComentary,
      workerNumber : this.workerNumber === null ? 0 : this.workerNumber,
      idLandOwnership : this.idLandOwnership,
      totalArea : this.totalArea,
      previousAddress : this.previousAddress,
      otherLocations : this.otherLocations,
      activityDetailCommentary : this.activityDetailCommentary,
      aditionalCommentary : this.aditionalCommentary,
      tabCommentary : this.tabCommentary,
      countriesExport : this.countriesExport,
      countriesImport : this.countriesImport,
      countriesExportEng : this.countriesExportEng,
      countriesImportEng : this.countriesImportEng,
      specificActivities : this.specificActivities,
      specificActivitiesEng : this.specificActivitiesEng,
      descPrincipalAddress : this.descPrincipalAddress,
      traductions : [
        {
          key : 'S_R_SALEPER',
          value : this.cashSaleComentaryEng === null ? "" : this.cashSaleComentaryEng
        },
        {
          key : 'S_R_CREDITPER',
          value : this.creditSaleComentaryEng === null ? "" : this.creditSaleComentaryEng
        },
        {
          key : 'S_R_TERRITORY',
          value : this.territorySaleComentaryEng === null ? "" : this.territorySaleComentaryEng
        },
        {
          key : 'S_R_EXTSALES',
          value : this.abroadSaleComentaryEng === null ? "" : this.abroadSaleComentaryEng
        },
        {
          key : 'S_R_NATIBUY',
          value : this.nationalPurchasesComentaryEng === null ? "" : this.nationalPurchasesComentaryEng
        },
        {
          key : 'S_R_INTERBUY',
          value : this.internationalPurchasesComentaryEng === null ? "" : this.internationalPurchasesComentaryEng
        },
        {
          key : 'S_R_TOTALAREA',
          value : this.totalAreaEng === null ? "" : this.totalAreaEng
        },
        {
          key : 'L_R_OTRHERLOCALS',
          value : this.otherLocationsEng === null ? "" : this.otherLocationsEng
        },
        {
          key : 'L_R_PRINCACT',
          value : this.activityDetailCommentaryEng === null ? "" : this.activityDetailCommentaryEng
        },
        {
          key : 'L_R_ADIBUS',
          value : this.aditionalCommentaryEng === null ? "" : this.aditionalCommentaryEng
        },
        {
          key : 'L_R_DESCADD',
          value : this.descPrincipalAddressEng === null ? "" : this.descPrincipalAddressEng
        },
      ]
    }
  }
  armarModeloModificado(){
    console.log(Number(this.cashSalePercentage))
    this.modeloModificado[0] = {
      id : this.id,
      idCompany : this.idCompany,
      idBranchSector : this.idBranchSector,
      idBusinessBranch : this.idBusinessBranch,
      import : this.import,
      export : this.export,
      cashSalePercentage : this.cashSalePercentage === null ? 0 : Number(this.cashSalePercentage),
      cashSaleComentary : this.cashSaleComentary,
      creditSalePercentage : this.creditSalePercentage === null ? 0 : Number(this.creditSalePercentage),
      creditSaleComentary : this.creditSaleComentary,
      territorySalePercentage : this.territorySalePercentage === null ? 0 : Number(this.territorySalePercentage),
      territorySaleComentary : this.territorySaleComentary,
      abroadSalePercentage : this.abroadSalePercentage === null ? 0 :Number(this.abroadSalePercentage) ,
      abroadSaleComentary : this.abroadSaleComentary,
      nationalPurchasesPercentage : this.nationalPurchasesPercentage === null ? 0 : Number( this.nationalPurchasesPercentage),
      nationalPurchasesComentary : this.nationalPurchasesComentary,
      internationalPurchasesPercentage : this.internationalPurchasesPercentage === null ? 0 : Number(this.internationalPurchasesPercentage),
      internationalPurchasesComentary : this.internationalPurchasesComentary,
      workerNumber : this.workerNumber === null ? 0 : this.workerNumber,
      idLandOwnership : this.idLandOwnership,
      totalArea : this.totalArea,
      previousAddress : this.previousAddress,
      otherLocations : this.otherLocations,
      activityDetailCommentary : this.activityDetailCommentary,
      aditionalCommentary : this.aditionalCommentary,
      tabCommentary : this.tabCommentary,
      countriesExport : this.countriesExport,
      countriesImport : this.countriesImport,
      countriesExportEng : this.countriesExportEng,
      countriesImportEng : this.countriesImportEng,
      specificActivities : this.specificActivities,
      specificActivitiesEng : this.specificActivitiesEng,
      descPrincipalAddress : this.descPrincipalAddress,
      traductions : [
        {
          key : 'S_R_SALEPER',
          value : this.cashSaleComentaryEng === null ? "" : this.cashSaleComentaryEng
        },
        {
          key : 'S_R_CREDITPER',
          value : this.creditSaleComentaryEng === null ? "" : this.creditSaleComentaryEng
        },
        {
          key : 'S_R_TERRITORY',
          value : this.territorySaleComentaryEng === null ? "" : this.territorySaleComentaryEng
        },
        {
          key : 'S_R_EXTSALES',
          value : this.abroadSaleComentaryEng === null ? "" : this.abroadSaleComentaryEng
        },
        {
          key : 'S_R_NATIBUY',
          value : this.nationalPurchasesComentaryEng === null ? "" : this.nationalPurchasesComentaryEng
        },
        {
          key : 'S_R_INTERBUY',
          value : this.internationalPurchasesComentaryEng === null ? "" : this.internationalPurchasesComentaryEng
        },
        {
          key : 'S_R_TOTALAREA',
          value : this.totalAreaEng === null ? "" : this.totalAreaEng
        },
        {
          key : 'L_R_OTRHERLOCALS',
          value : this.otherLocationsEng === null ? "" : this.otherLocationsEng
        },
        {
          key : 'L_R_PRINCACT',
          value : this.activityDetailCommentaryEng === null ? "" : this.activityDetailCommentaryEng
        },
        {
          key : 'L_R_ADIBUS',
          value : this.aditionalCommentaryEng === null ? "" : this.aditionalCommentaryEng
        },
        {
          key : 'L_R_DESCADD',
          value : this.descPrincipalAddressEng === null ? "" : this.descPrincipalAddressEng
        },
      ]
    }
  }

  private _filterPaisImpo(description: string): Pais[] {
    const filterValue = description.toLowerCase();
    return this.paisesImpo.filter(pais => pais.valor.toLowerCase().includes(filterValue));
  }
  private _filterPaisExpo(description: string): Pais[] {
    const filterValue = description.toLowerCase();
    return this.paisesExpo.filter(pais => pais.valor.toLowerCase().includes(filterValue));
  }
  private _filter(name: string): data[] {
    const filterValue = name.toLowerCase();
    return this.options.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  displayPais(pais : Pais): string {
    return pais && pais.valor ? pais.valor : '';
  }
  displayFn(user: data): string {
    return user && user.name ? user.name : '';
  }

  addImpo(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    event.chipInput!.clear();
    this.controlPaisesImpo.setValue(null);
  }

  removeImpo(pais: string): void {
    const deletePais = this.paisesSeleccionadosImpo.filter(x => x.valor === pais)
    if (deletePais.length > 0) {
      this.paisesSeleccionadosImpo = this.paisesSeleccionadosImpo.filter(x => x.valor !== pais)
      this.announcer.announce(`Se Removio  ${pais}`);
    }
  }
  selectedImpo(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value)
    const pais = this.paisesImpo.filter(x => x.valor === event.option.value)[0]
    if(pais){
      const paisRepetido = this.paisesSeleccionadosImpo.filter(x => x.valor === event.option.value)[0]
      if(paisRepetido){
        console.log('Pais Repetido')
      }else{
        this.paisesSeleccionadosImpo.push(pais)
      }
    }
    this.paisExpoInput.nativeElement.value = '';
    this.controlPaisesImpo.setValue(null);
  }
  addExpo(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    event.chipInput!.clear();
    this.controlPaisesExpo.setValue(null);
  }

  removeExpo(pais: string): void {
    const deletePais = this.paisesSeleccionadosExpo.filter(x => x.valor === pais)
    if (deletePais.length > 0) {
      this.paisesSeleccionadosExpo = this.paisesSeleccionadosExpo.filter(x => x.valor !== pais)
      this.announcer.announce(`Se Removio  ${pais}`);
    }
  }
  selectedExpo(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value)
    const pais = this.paisesExpo.filter(x => x.valor === event.option.value)[0]
    if(pais){
      const paisRepetido = this.paisesSeleccionadosExpo.filter(x => x.valor === event.option.value)[0]
      if(paisRepetido){
        console.log('Pais Repetido')
      }else{
        this.paisesSeleccionadosExpo.push(pais)
      }
    }
    this.paisExpoInput.nativeElement.value = '';
    this.controlPaisesExpo.setValue(null);
  }

  ramoActividadDialog() {
    const dialogRef1 = this.dialog.open(RamoActividadDialogComponent, {
      data: {
        idBusinessBranch : this.idBusinessBranch,
        specificActivities : this.specificActivities
        },
      });
    dialogRef1.afterClosed().subscribe((data) => {
      if (data) {
        console.log(data)
        this.idBusinessBranch = data.idBusinessBranch
        this.specificActivities = ''
        this.specificActivitiesEng = ''
        data.specificActivities.forEach((actividad : ComboData3)  => {
          if(data.specificActivities[data.specificActivities.length-1] == actividad){
            this.specificActivities += actividad.valor
            this.specificActivitiesEng += actividad.valorEng
          }else{
            this.specificActivities += actividad.valor + ' - '
            this.specificActivitiesEng += actividad.valorEng + ' - '
          }
        });
      }
    })
  }
  ImportacionDialog() {
    let dialogRef2 = this.dialog.open(CuadroImpoExpoComponent, {
      data: {
        titulo : "Importaciones",
        idCompany : this.idCompany,
        tipo : "I"
      },
    });
  }
  ExportacionDialog() {
    const dialogRef3 = this.dialog.open(CuadroImpoExpoComponent, {
      data: {
        titulo : "Exportaciones",
        idCompany : this.idCompany,
        tipo : "E"
      },
  });
  }
  comercioDialog(titulo : string, porcentaje : number, comentario : string, comentarioEng : string, input : string){
    const dialogRef1 = this.dialog.open(DialogComercioComponent, {
      data: {
        titulo : titulo,
        porcentaje : porcentaje,
        comentario : comentario,
        comentarioEng : comentarioEng,
        },
      });
    dialogRef1.afterClosed().subscribe(
      (data) => {
        if(data){
          switch(input){
            case 'cashSale':
              this.cashSalePercentage = data.porcentaje
              this.cashSaleComentary = data.comentario
              this.cashSaleComentaryEng = data.comentarioEng
              this.cashSale = this.cashSalePercentage + '% | ' + this.cashSaleComentary
              break
            case 'creditSale':
              this.creditSalePercentage = data.porcentaje
              this.creditSaleComentary = data.comentario
              this.creditSaleComentaryEng = data.comentarioEng
              this.creditSale = this.creditSalePercentage + '% | ' + this.creditSaleComentary
              break
            case 'territorySale':
              this.territorySalePercentage = data.porcentaje
              this.territorySaleComentary = data.comentario
              this.territorySaleComentaryEng = data.comentarioEng
              this.territorySale = this.territorySalePercentage + '% | ' + this.territorySaleComentary
              break
            case 'abroadSale':
              this.abroadSalePercentage = data.porcentaje
              this.abroadSaleComentary = data.comentario
              this.abroadSaleComentaryEng = data.comentarioEng
              this.abroadSale = this.abroadSalePercentage + '% | ' + this.abroadSaleComentary
              break
            case 'nationalPurchase':
              this.nationalPurchasesPercentage = data.porcentaje
              this.nationalPurchasesComentary = data.comentario
              this.nationalPurchasesComentaryEng = data.comentarioEng
              this.nationalPurchase = this.nationalPurchasesPercentage + '% | ' + this.nationalPurchasesComentary
              break
            case 'internationPurchase':
              this.internationalPurchasesPercentage = data.porcentaje
              this.internationalPurchasesComentary = data.comentario
              this.internationalPurchasesComentaryEng = data.comentarioEng
              this.internationPurchase = this.internationalPurchasesPercentage + '% | ' + this.internationalPurchasesComentary
              break
          }
        }
      }
    )
  }

  //titularidad
  myControl = new FormControl<string | data>('');
  options: data[] = [{name: 'Alquilado'}, {name: 'Comodato'}, {name: 'Compartido'}, {name: 'No Revelado'}, {name: 'Oficina Virtual'}, {name: 'Propio Cancelado'}, {name: 'Propio Pagandolo'}];
  filteredOptions: Observable<data[]>;

  agregarComentario(titulo : string, subtitulo : string, comentario_es : string, comentario_en : string, input : string) {
    const dialogRef = this.dialog.open(TraduccionDialogComponent, {
    data: {
      titulo : titulo,
      subtitulo : subtitulo,
      tipo : 'textarea',
      comentario_es : comentario_es,
      comentario_en : comentario_en

    },
  });
  dialogRef.afterClosed().subscribe((data) => {
    if (data) {
      console.log(data)
      switch(input){
        case 'otrosLocales':
        this.otherLocations = data.comentario_es;
        this.otherLocationsEng = data.comentario_en;
        break
        case 'comentarioActividadPrincipal':
        this.activityDetailCommentary = data.comentario_es;
        this.activityDetailCommentaryEng = data.comentario_en;
        break
        case 'comentarioNegocio':
        this.aditionalCommentary = data.comentario_es;
        this.aditionalCommentaryEng = data.comentario_en;
        break
        case 'localPrincipal':
        this.descPrincipalAddress = data.comentario_es;
        this.descPrincipalAddressEng = data.comentario_en;
        break

      }
    }
  });
  }
  agregarTraduccion(titulo : string, subtitulo : string, comentario_es : string, comentario_en : string, input : string) {
    const dialogRef = this.dialog.open(TraduccionDialogComponent, {
      data: {
        titulo : titulo,
        subtitulo : subtitulo,
        tipo : 'input',
        comentario_es : comentario_es,
        comentario_en : comentario_en
      },
    });
  dialogRef.afterClosed().subscribe((data) => {
    if (data) {
      console.log(data)
      switch(input){

        case 'areaTotal':
        this.totalArea = data.comentario_es;
        this.totalAreaEng = data.comentario_en;
        break
        case 'exportacion':
        this.countriesExport = data.comentario_es;
        this.countriesExportEng = data.comentario_en;
        break
        case 'importacion':
        this.countriesImport = data.comentario_es;
        this.countriesImportEng = data.comentario_en;
        break

      }
    }
  });
  }

  //TITULOS DE COMENTARIOS
  codEmpresa = "cod de empresa o nombre"
  titulo : string = 'Comentario - Traduccion'
  tituloImportacion : string = 'Importación en Países '
  tituloExportacion : string = 'Exportación en Países '
  tituloVentaContado : string = '% de Venta al Contado / Forma '
  tituloCreditoTerminos : string = '% de Créditos / Términos'
  tituloTerritorioVentas : string = 'Territorio de Ventas '
  tituloVentaExterior : string = '% de Ventas al Exterior '
  tituloComprasNacionales : string = '% de Compras Nacionales '
  tituloExterior : string = '% del Exterior'
  tituloAreaTotal : string = 'Área Total '
  tituloOtrosLocales : string = 'Otros Locales '
  subtituloOtrosLocales: string = 'Plantas, Almacenes, Depósitos y Sucursales'

  guardar(){
    if(this.id === 0){
      // this.countriesImport = ""
      // this.countriesExport = ""
      // this.paisesSeleccionadosImpo.forEach(pais => {
      //   if(this.paisesSeleccionadosImpo[this.paisesSeleccionadosImpo.length-1] == pais){
      //     this.countriesImport += pais.valor
      //   }else{
      //     this.countriesImport += pais.valor + ', '
      //   }
      // });
      // this.paisesSeleccionadosExpo.forEach(pais => {
      //   if(this.paisesSeleccionadosExpo[this.paisesSeleccionadosExpo.length-1] == pais){
      //     this.countriesExport += pais.valor
      //   }else{
      //     this.countriesExport += pais.valor + ', '
      //   }
      // });
      this.armarModeloModificado()

      console.log(this.modeloModificado[0])
      Swal.fire({
        title: '¿Está seguro de guardar este registro?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText : 'No',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        width: '20rem',
        heightAuto : true
      }).then((result) => {
        if (result.value) {
          const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.remove('hide-loader');
          }
          this.ramoNegocioService.addRamoNegocio(this.modeloModificado[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){

                const tabRamo = document.getElementById('tab-ramo-negocio') as HTMLElement | null;
                if (tabRamo) {
                  tabRamo.classList.add('tab-con-datos')
                }
                Swal.fire({
                  title: 'El registro se guardo correctamente.',
                  text: '',
                  icon: 'success',
                  width: '30rem',
                  heightAuto: true
                }).then(() => {
                  this.armarModeloActual()
                  this.armarModeloModificado()
                })
                this.id = response.data
              }
            }
          ).add(
            () => {
              if(paginaDetalleEmpresa){
                paginaDetalleEmpresa.classList.add('hide-loader');
              }
            }
          )
        }
      });
    }else{
      // this.countriesImport = ""
      // this.countriesExport = ""
      // this.paisesSeleccionadosImpo.forEach(pais => {
      //   if(this.paisesSeleccionadosImpo[this.paisesSeleccionadosImpo.length-1] == pais){
      //     this.countriesImport += pais.valor
      //   }else{
      //     this.countriesImport += pais.valor + ', '
      //   }
      // });
      // this.paisesSeleccionadosExpo.forEach(pais => {
      //   if(this.paisesSeleccionadosExpo[this.paisesSeleccionadosExpo.length-1] == pais){
      //     this.countriesExport += pais.valor
      //   }else{
      //     this.countriesExport += pais.valor + ', '
      //   }
      // });
      this.armarModeloModificado()
      console.log(this.modeloModificado[0])
      Swal.fire({
        title: '¿Está seguro de modificar este registro?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText : 'No',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        width: '20rem',
        heightAuto : true
      }).then((result) => {
        if (result.value) {
          const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.remove('hide-loader');
          }
          this.ramoNegocioService.addRamoNegocio(this.modeloModificado[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title: 'El registro se guardo correctamente.',
                  text: '',
                  icon: 'success',
                  width: '30rem',
                  heightAuto: true
                }).then(() => {
                  this.armarModeloActual()
                  this.armarModeloModificado()
                })
                this.id = response.data
              }
            }
          ).add(
            () => {
              if(paginaDetalleEmpresa){
                paginaDetalleEmpresa.classList.add('hide-loader');
              }
            }
          )
        }
      });
    }

  }
}
