import { ActivatedRoute, Router } from '@angular/router';
import { HistoricoVentasComponent } from './historico-ventas/historico-ventas.component';
import { HistoricoVentasService } from '../../../../../services/informes/historico-ventas.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { TraduccionDialogComponent } from '@shared/components/traduccion-dialog/traduccion-dialog.component';
import { BalanceSituacionalComponent } from './balance-situacional/balance-situacional.component';
import { ComboData, ComboData2 } from 'app/models/combo';
import { ComboService } from 'app/services/combo.service';
import { FinancialInformation, HistoricoVentasT } from 'app/models/informes/empresa/situacion-financiera';
import { FinanzasService } from 'app/services/informes/empresa/finanzas.service';
import { Traduction } from 'app/models/informes/empresa/datos-empresa';
import Swal from 'sweetalert2';
import { ApexAxisChartSeries, ApexChart, ApexDataLabels, ApexFill, ApexGrid, ApexLegend, ApexPlotOptions, ApexResponsive, ApexStates, ApexStroke, ApexTitleSubtitle, ApexTooltip, ApexXAxis, ApexYAxis } from 'ng-apexcharts';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { VerPdfComponent } from '@shared/components/ver-pdf/ver-pdf.component';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';

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
    selector: 'app-finanzas',
    templateUrl: './finanzas.component.html',
    styleUrls: ['./finanzas.component.scss'],
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
export class FinanzasComponent implements OnInit, OnDestroy{

  id = 0
  idCompany = 0
  interviewed = ""
  workPosition = ""
  workPositionEng = ""
  idCollaborationDegree = 0
  interviewCommentary = ""
  interviewCommentaryEng = ""
  auditors = ""
  idFinancialSituacion = 0
  reportCommentWithBalance = ""
  reportCommentWithoutBalance = ""
  financialCommentarySelected = ""
  financialCommentarySelectedEng = ""
  mainFixedAssets = ""
  mainFixedAssetsEng = ""
  analystCommentary = ""
  analystCommentaryEng = ""
  tabCommentary = ""
  tabCommentaryEng = ""
  traductions : Traduction[] = []
  riskCenter = ""

  checkComentarioConBalance : boolean = false
  checkComentarioSinBalance : boolean = false

  modeloActual : FinancialInformation[] = []
  modeloModificado : FinancialInformation[] = []

  listaGradoColaboracion : ComboData[] = []
  listaSituacionFinanciera : ComboData2[] = []




  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public areaChartOptions!: Partial<ChartOptions>;


  //TABLA HISTORICO VENTAS
  dataSourceHistoricoVentas = new MatTableDataSource<HistoricoVentasT>
  columnToDisplayHistoricoVentas : string[] = [
    "fecha","moneda","ventasMN","TC","equivaleDolar","accion"
  ]

  constructor(private router : Router, private historicoVentasService : HistoricoVentasService,private dialog : MatDialog,
    private comboService : ComboService, private finanzasService : FinanzasService, private activatedRoute : ActivatedRoute){

      const id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id?.includes('nuevo')) {
        this.idCompany = 0
      } else {
        this.idCompany = parseInt(id + '')
      }
      this.chart1()
  }
  compararModelosF: any

  ngOnInit() {
    const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
    if(paginaDetalleEmpresa){
      paginaDetalleEmpresa.classList.remove('hide-loader');
    }
    this.comboService.getGradoColaboracion().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.listaGradoColaboracion = response.data
        }
      }
    ).add(
      () => {
        this.comboService.getSituacionFinanciera().subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.listaSituacionFinanciera = response.data
              console.log(this.listaSituacionFinanciera)
            }
          }
        ).add(
          () => {
            console.log(this.idCompany)
            this.finanzasService.getFinanzasByIdCompany(this.idCompany).subscribe(
              (response) => {
                if(response.isSuccess === true && response.isWarning === false){
                  const finanzas = response.data
                  if(finanzas){
                    this.id = finanzas.id
                    this.interviewed = finanzas.interviewed
                    this.workPosition = finanzas.workPosition
                    this.idCollaborationDegree = finanzas.idCollaborationDegree
                    this.interviewCommentary = finanzas.interviewCommentary
                    this.auditors = finanzas.auditors
                    this.idFinancialSituacion = finanzas.idFinancialSituacion
                    this.riskCenter = this.idFinancialSituacion === 8 ? '' : this.idFinancialSituacion === 9 ? 'A+ : SIN RIESGO (Solventes, Situación Financiera Muy Buena)' :this.idFinancialSituacion === 10 ? 'A- : RIESGO MINIMO (Solventes, Situación Financiera Satisfactoria)' :this.idFinancialSituacion === 11 ? 'B : RIESGO MODERADO (Situación Financiera levemente extendida)' :this.idFinancialSituacion === 12 ? 'C : RIESGO ALTO (Situación Extendida. Se recomienda garantía colateral)' :this.idFinancialSituacion === 13 ? 'D : RIESGO MUY ALTO (Situación Financiera Pesada. Pérdidas)' :this.idFinancialSituacion === 15 ? 'E : RIESGO MUY ALTO (Inoperativa o Liquidada o Quebrada)' :this.idFinancialSituacion === 14 ? 'NN : RIESGO INDETERMINADO (Información insuficiente o inexistente).' : ''
                    this.selectSituacionFinanciera(this.idFinancialSituacion)
                    this.reportCommentWithBalance = finanzas.reportCommentWithBalance
                    this.reportCommentWithoutBalance = finanzas.reportCommentWithoutBalance
                    this.financialCommentarySelected = finanzas.financialCommentarySelected
                    this.mainFixedAssets = finanzas.mainFixedAssets
                    this.analystCommentary = finanzas.analystCommentary
                    this.tabCommentary = finanzas.tabCommentary
                    this.traductions = finanzas.traductions
                    finanzas.traductions[0].value === null ? this.workPositionEng = '' : this.workPositionEng = finanzas.traductions[0].value
                    finanzas.traductions[1].value === null ? this.interviewCommentaryEng = '' : this.interviewCommentaryEng = finanzas.traductions[1].value
                    finanzas.traductions[3].value === null ? this.financialCommentarySelectedEng = '' : this.financialCommentarySelectedEng = finanzas.traductions[3].value
                    finanzas.traductions[2].value === null ? this.mainFixedAssetsEng = '' : this.mainFixedAssetsEng = finanzas.traductions[2].value
                    finanzas.traductions[4].value === null ? this.analystCommentaryEng = '' : this.analystCommentaryEng = finanzas.traductions[4].value
                    finanzas.traductions[5].value === null ? this.tabCommentaryEng = '' : this.tabCommentaryEng = finanzas.traductions[5].value
                  }
                }else{
                  const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
                    if(paginaDetalleEmpresa){
                      paginaDetalleEmpresa.classList.add('hide-loader');
                    }
                }
              }
            ).add(
              () => {
                this.finanzasService.getListHistoricoVentas(this.idCompany).subscribe(
                  (response) => {
                    if(response.isSuccess === true && response.isWarning === false){
                      this.dataSourceHistoricoVentas.data = response.data
                      this.dataSourceHistoricoVentas.sort = this.sort
                      this.dataSourceHistoricoVentas.paginator = this.paginator
                      console.log(this.dataSourceHistoricoVentas.data)
                    }
                  }
                ).add(
                  () => {

                    this.armarModeloActual()
                    this.armarModeloModificado()
                    const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
                    if(paginaDetalleEmpresa){
                      paginaDetalleEmpresa.classList.add('hide-loader');
                    }
                    try {

                      this.chart2()
                    } catch (error) {
                      console.log(error)
                    }
                  }
                )
                this.armarModeloActual()
                this.armarModeloModificado()
                this.compararModelosF = setInterval(() => {
                  this.compararModelos();
                }, 2000);
              }
            )
          }
        )
      }
    );
  }
  compararModelos(): void {
    this.armarModeloModificado();
    const tabFinanzas = document.getElementById('tab-finanzas') as HTMLElement | null;
    if (JSON.stringify(this.modeloActual) !== JSON.stringify(this.modeloModificado)) {
      if (tabFinanzas) {
        tabFinanzas.classList.add('tab-cambios');
      }
    } else {
      if (tabFinanzas) {
        tabFinanzas.classList.remove('tab-cambios');
      }
    }
  }
  verPdf(){
    const dialogRef = this.dialog.open(VerPdfComponent,{
      data: {
        type : "E",
        idCompany : this.idCompany,
        section : "FINANZAS",
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
        section : "FINANZAS",
        language : "I",
        idTicket : 0
      },
    });
  }
  ngOnDestroy(): void {
    clearInterval(this.compararModelosF);

  }
  private chart1() {
    this.areaChartOptions = {
      series: [

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
    if (this.dataSourceHistoricoVentas.data.length > 0 || this.idCompany !== 0) {
      const listaFechas: string[] = [];
      const listaMN: number[] = [];
      const listaME: number[] = [];
      const listaER: number[] = [];

      this.dataSourceHistoricoVentas.data.forEach(data => {
        const fecha = data.date.split("/");
        if (fecha) {
          const date: string = fecha[2] + '-' + fecha[1] + '-' + fecha[0];
          listaFechas.push(date);
        }

        const amount = parseInt(data.amount);
        const equivalentToDollars = parseInt(data.equivalentToDollars);
        const exchangeRate = parseFloat(data.exchangeRate);

        if (!isNaN(amount)) {
          listaMN.push(amount);
        }

        if (!isNaN(equivalentToDollars)) {
          listaME.push(equivalentToDollars);
        }

        if (!isNaN(exchangeRate)) {
          listaER.push(exchangeRate);
        }
      });

      this.areaChartOptions = {
        series: [
          {
            name: 'Moneda Nacional',
            data: listaMN,
          },
          {
            name: 'Moneda en USD',
            data: listaME,
          },
          {
            name: 'Tasa de Cambio',
            data: listaER,

          },
        ],
        chart: {
          height: 300,
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


    }
  }

  elegirComentarioConBalance(){
    if(this.checkComentarioConBalance == true){
      this.financialCommentarySelected = this.reportCommentWithBalance
      this.checkComentarioSinBalance = false
    }else if(this.checkComentarioConBalance == false){
      this.financialCommentarySelected = ""
    }
  }
  elegirComentarioSinBalance(){
    if(this.checkComentarioSinBalance == true){
      this.financialCommentarySelected = this.reportCommentWithoutBalance
      this.checkComentarioConBalance = false
    }else if(this.checkComentarioSinBalance == false){
      this.financialCommentarySelected = ""
    }
  }

  agregarHistoricoVentas(){
    const dialogR1 = this.dialog.open(HistoricoVentasComponent, {
      data: {
        id : 0,
        idCompany : this.idCompany
      }
      });
    dialogR1.afterClosed().subscribe(() => {
      this.finanzasService.getListHistoricoVentas(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            console.log(response.data)
            this.dataSourceHistoricoVentas.data = response.data
          }
        }).add(
          () => {
            this.chart2()
          }
        )
    });
  }
  editarHistoricoVentas(id : number){
    const dialogR2 = this.dialog.open(HistoricoVentasComponent, {
      data: {
        id : id,
        idCompany : this.idCompany
      }
      });
      dialogR2.afterClosed().subscribe(() => {
        this.finanzasService.getListHistoricoVentas(this.idCompany).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.dataSourceHistoricoVentas.data = response.data
            }
          }
        ).add(
          () => {
            this.chart2()
          }
        )
      });
  }
  eliminarHistoricoVentas(id: number) {
    console.log(id)
    Swal.fire({
      title: '¿Está seguro de eliminar el registro?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí',
      width: '30rem',
      heightAuto: true
    }).then((result) => {
      if (result.value) {
        const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
        if(paginaDetalleEmpresa){
          paginaDetalleEmpresa.classList.remove('hide-loader');
        }
        this.finanzasService.deleteHistoricoVentas(id).subscribe((response) => {
        if(response.isSuccess === true && response.isWarning === false){
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
          Swal.fire({
            title: 'Se eliminó el registro correctamente',
            text: "",
            icon: 'success',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Ok',
            width: '30rem',
            heightAuto: true
          }).then(
            () => {
              this.finanzasService.getListHistoricoVentas(this.idCompany).subscribe(
                (response) => {
                  if(response.isSuccess === true && response.isWarning === false){
                    this.dataSourceHistoricoVentas.data = response.data
                  }
                }
              ).add(
                () => {
                  this.chart2()
                }
              )
            }
          )
        }else{
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
          Swal.fire({
            title: 'Ocurrió un problema.',
            text: 'Comunicarse con Sistemas',
            icon: 'warning',
            confirmButtonColor: 'blue',
            confirmButtonText: 'Ok',
            width: '30rem',
            heightAuto : true
          }).then(() => {
          })
        }
        if(paginaDetalleEmpresa){
          paginaDetalleEmpresa.classList.add('hide-loader');
        }
      })
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
          case 'cargos':
          this.workPosition = data.comentario_es;
          this.workPositionEng = data.comentario_en;
          break
        }
      }
    });
  }
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
          case 'comentarioEntrevista':
          this.interviewCommentary = data.comentario_es;
          this.interviewCommentaryEng = data.comentario_en;
          break
          case 'principalesActivos':
          this.mainFixedAssets = data.comentario_es;
          this.mainFixedAssetsEng = data.comentario_en;
          break
          case 'comentarioElegido':
          this.financialCommentarySelected = data.comentario_es;
          this.financialCommentarySelectedEng = data.comentario_en;
          break
          case 'comentarioAnalista':
          this.analystCommentary = data.comentario_es;
          this.analystCommentaryEng = data.comentario_en;
          break
        }
      }
    });
  }
  cuadroTabulado(titulo : string, subtitulo : string, comentario_es : string, comentario_en : string, input : string) {
    const dialogRef = this.dialog.open(TraduccionDialogComponent, {
      data: {
        titulo : titulo,
        subtitulo : subtitulo,
        tipo : 'ckeditor',
        comentario_es : comentario_es,
        comentario_en : comentario_en
        },
      });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        console.log(data)
        switch(input){
          case 'tab':
          this.tabCommentary = data.comentario_es;
          this.tabCommentaryEng = data.comentario_en;
          break
        }
      }
    });
  }
  balanceSituacional(idCompany : number) {
    const dialogRef = this.dialog.open(BalanceSituacionalComponent, {
      data : this.idCompany,
    });
  }
  selectSituacionFinanciera(idSituacionFinanciera : number){
    if(idSituacionFinanciera > 0){
      const sit = this.listaSituacionFinanciera.filter(x => x.id === idSituacionFinanciera)[0]
      if(sit){
        this.reportCommentWithBalance = sit.reportCommentWithBalance
        this.reportCommentWithoutBalance = sit.reportCommentWithoutBalance
      }
    }

  }

  titulo = 'Comentario - Traduccion'
  tituloActivos = 'Principales Activos Fijos de la Empresa '
  tituloCargo = 'Cargos de la Empresa '
  tituloComentarioEntrevista = 'Comentarios de la Entrevista'
  tituloComentarioFinanciero = 'Comentario Financiero'
  tituloComentarioAnalista = 'Comentarios del Analista'

  subtituloActivos = '(Inmuebles, Vehículos, etc. Detalle - Valor)'

  armarModeloActual(){
    this.modeloActual[0] = {
      id : this.id,
      idCompany : this.idCompany,
      interviewed : this.interviewed,
      workPosition : this.workPosition,
      idCollaborationDegree : this.idCollaborationDegree,
      interviewCommentary : this.interviewCommentary,
      auditors : this.auditors,
      idFinancialSituacion : this.idFinancialSituacion,
      reportCommentWithBalance : this.reportCommentWithBalance,
      reportCommentWithoutBalance : this.reportCommentWithoutBalance,
      financialCommentarySelected : this.financialCommentarySelected,
      mainFixedAssets : this.mainFixedAssets,
      analystCommentary : this.analystCommentary,
      tabCommentary : this.tabCommentary,
      traductions : [
        {
          key : 'S_F_JOB',
          value : this.workPositionEng
        },
        {
          key : 'L_F_COMENT',
          value : this.interviewCommentaryEng
        },
        {
          key : 'L_F_PRINCACTIV',
          value : this.mainFixedAssetsEng
        },
        {
          key : 'L_F_SELECTFIN',
          value : this.financialCommentarySelectedEng
        },
        {
          key : 'L_F_ANALISTCOM',
          value : this.analystCommentaryEng
        },
        {
          key : 'L_F_TABCOMM',
          value : this.tabCommentaryEng
        },
      ]
    }
  }
  armarModeloModificado(){
    this.modeloModificado[0] = {
      id : this.id,
      idCompany : this.idCompany,
      interviewed : this.interviewed,
      workPosition : this.workPosition,
      idCollaborationDegree : this.idCollaborationDegree,
      interviewCommentary : this.interviewCommentary,
      auditors : this.auditors,
      idFinancialSituacion : this.idFinancialSituacion,
      reportCommentWithBalance : this.reportCommentWithBalance,
      reportCommentWithoutBalance : this.reportCommentWithoutBalance,
      financialCommentarySelected : this.financialCommentarySelected,
      mainFixedAssets : this.mainFixedAssets,
      analystCommentary : this.analystCommentary,
      tabCommentary : this.tabCommentary,
      traductions : [
        {
          key : 'S_F_JOB',
          value : this.workPositionEng
        },
        {
          key : 'L_F_COMENT',
          value : this.interviewCommentaryEng
        },
        {
          key : 'L_F_PRINCACTIV',
          value : this.mainFixedAssetsEng
        },
        {
          key : 'L_F_SELECTFIN',
          value : this.financialCommentarySelectedEng
        },
        {
          key : 'L_F_ANALISTCOM',
          value : this.analystCommentaryEng
        },
        {
          key : 'L_F_TABCOMM',
          value : this.tabCommentaryEng
        },
      ]
    }
  }

  guardar(){
    this.armarModeloModificado()
    console.log(this.modeloModificado)
    if(this.id === 0){
      Swal.fire({
        title: '¿Está seguro de agregar este registro?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí',
        width: '30rem',
        heightAuto: true
      }).then((result) => {
        if (result.value) {
          const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.remove('hide-loader');
          }
          this.finanzasService.addOrUpdateFinanzas(this.modeloModificado[0]).subscribe((response) => {
          if(response.isSuccess === true && response.isWarning === false){
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            Swal.fire({
              title: 'Se agrego el registro correctamente',
              text: "",
              icon: 'success',
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
              width: '30rem',
              heightAuto: true
            })
            console.log(response.data)
            this.id = response.data
            const tabFinanzas = document.getElementById('tab-finanzas') as HTMLElement | null;
            if (tabFinanzas) {
              tabFinanzas.classList.add('tab-con-datos');
            }
            this.armarModeloActual();
            this.armarModeloModificado();
          }else{
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            Swal.fire({
              title: 'Ocurrió un problema.',
              text: 'Comunicarse con Sistemas',
              icon: 'warning',
              confirmButtonColor: 'blue',
              confirmButtonText: 'Ok',
              width: '30rem',
              heightAuto : true
            }).then(() => {
            })
          }
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
        })
        }
      });
    }else{
      Swal.fire({
        title: '¿Está seguro de guardar los cambios?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí',
        width: '30rem',
        heightAuto: true
      }).then((result) => {
        if (result.value) {
          const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.remove('hide-loader');
          }
          this.finanzasService.addOrUpdateFinanzas(this.modeloModificado[0]).subscribe((response) => {
          if(response.isSuccess === true && response.isWarning === false){
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            Swal.fire({
              title: 'Se guardaron los cambios correctamente',
              text: "",
              icon: 'success',
              confirmButtonColor: '#d33',
              cancelButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
              width: '30rem',
              heightAuto: true
            })
            console.log(response.data)
            this.id = response.data

            this.armarModeloActual();
            this.armarModeloModificado();
          }else{
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            Swal.fire({
              title: 'Ocurrió un problema.',
              text: 'Comunicarse con Sistemas',
              icon: 'warning',
              confirmButtonColor: 'blue',
              confirmButtonText: 'Ok',
              width: '30rem',
              heightAuto : true
            }).then(() => {
            })
          }
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
        })
        }
      });
    }

  }
  salir() {
    this.armarModeloModificado();

    if(JSON.stringify(this.modeloActual) !== JSON.stringify(this.modeloModificado)){
      Swal.fire({
        title: '¿Está seguro de salir sin guardar los cambios?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText : 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí',
        width: '20rem',
        heightAuto : true
      }).then((result) => {
        if (result.value) {
          this.router.navigate(['informes/empresa/lista']);
        }
      });
    }else{
      this.router.navigate(['informes/empresa/lista']);
    }
  }
}
