import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectionStrategy, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TraduccionDialogComponent } from '@shared/components/traduccion-dialog/traduccion-dialog.component';
import { EmpresaRelacionadaService } from 'app/services/informes/empresa-relacionada.service';
import { Observable, map, startWith } from 'rxjs';
import { CapitalPagadoComponent } from './capital-pagado/capital-pagado.component';
import { ActivatedRoute } from '@angular/router';
import { AntecedentesLegalesService } from 'app/services/informes/empresa/antecedentes-legales.service';
import { Background, CompanyRelationT } from 'app/models/informes/empresa/antecendentes-legales';
import { ComboService } from 'app/services/combo.service';
import { ComboData } from 'app/models/combo';
import Swal from 'sweetalert2';
import { ListaEmpresas1Component } from './lista-empresas/lista-empresas.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { VerPdfComponent } from '@shared/components/ver-pdf/ver-pdf.component';
import { ToastrService } from 'ngx-toastr';
import { formatNumber } from '@angular/common';

export interface data {
  name: string;
}

@Component({
    selector: 'app-antecedentes',
    templateUrl: './antecedentes.component.html',
    styleUrls: ['./antecedentes.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class AntecedentesComponent implements OnInit, OnDestroy{

  capitalPagadoActualInforme = ""
  //FORM ANTECENDENTES
  id = 0
  idCompany = 0
  constitutionDate = ""
  startFunctionYear = ""
  operationDuration = ""
  operationDurationEng = ""
  registerPlace = ""
  registerPlaceEng = ""
  notaryRegister = ""
  publicRegister = ""
  publicRegisterEng = ""
  currentPaidCapital = 0
  currentPaidCapitalCurrency = 0
  currentPaidCapitalCurrencyInforme : ComboData =  {
    id : 0,
    valor  : '',
  }
  currentPaidCapitalComentary = ""
  currentPaidCapitalComentaryEng = ""
  origin = ""
  increaceDateCapital = ""
  increaceDateCapitalEng = ""
  currency = 0
  currencyInforme : ComboData =  {
    id : 0,
    valor  : '',
  }
  traded = ""
  tradedBy = ""
  currentExchangeRate = ""
  currentExchangeRateEng = ""
  lastQueryRrpp = ""
  lastQueryRrppD : Date | null = null
  lastQueryRrppBy = ""
  background = ""
  backgroundEng = ""
  history = ""
  historyEng = ""


  modeloActual : Background[] = []
  modeloModificado : Background[] = []

  ctrlMoneda = new FormControl<string | ComboData>('');
  listaMonedas : ComboData[] = []
  filteredMoneda: Observable<ComboData[]>;
  //TABLA
  dataSource: MatTableDataSource<CompanyRelationT>;

  columnsToDisplay = ['name', 'taxTypeName', 'country', 'constitutionDate', 'situation', 'accion'];
  selection = new SelectionModel<CompanyRelationT>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;


constructor(
  public dialog: MatDialog,
  private toastr: ToastrService,

  private empresaRelacionadaService : EmpresaRelacionadaService,
  private activatedRoute: ActivatedRoute,
    private antecedentesLegalesService : AntecedentesLegalesService,
    private comboService : ComboService
  ) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id?.includes('nuevo')) {
      this.idCompany = 0
    } else {
      this.idCompany = parseInt(id + '')
    }
    console.log(this.idCompany)
    this.filteredMoneda = new Observable<ComboData[]>();
    this.dataSource = new MatTableDataSource<CompanyRelationT>
   
  }
  compararModelosF : any
  ngOnInit() {
    const input = document.getElementById('input_fecha_constitucion') as HTMLElement | null;
    if(input){
      input.focus()
    }
    const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
    if(paginaDetalleEmpresa){
      paginaDetalleEmpresa.classList.remove('hide-loader');
    }
    this.comboService.getTipoMoneda().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.listaMonedas = response.data
          console.log(this.listaMonedas)
        }
      }
    ).add(() => {
      this.antecedentesLegalesService.getListCompanyRelation(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSource.data = response.data
            this.dataSource.sort = this.sort
            this.dataSource.paginator = this.paginator
          }
        }
      )
      this.antecedentesLegalesService.getAntecedentesLegalesPorId(this.idCompany).subscribe(
        (response) => {
          console.log(response)
          if(response.isSuccess === true && response.isWarning === false){
            const antecedentesLegales = response.data
            this.id = antecedentesLegales.id
            this.constitutionDate = antecedentesLegales.constitutionDate

            console.log(antecedentesLegales)
            this.startFunctionYear = antecedentesLegales.startFunctionYear
            this.operationDuration = antecedentesLegales.operationDuration

            this.registerPlace = antecedentesLegales.registerPlace
            this.notaryRegister = antecedentesLegales.notaryRegister
            this.publicRegister = antecedentesLegales.publicRegister
            this.currentPaidCapital = antecedentesLegales.currentPaidCapital
            this.currentPaidCapitalComentary = antecedentesLegales.currentPaidCapitalComentary
            if(antecedentesLegales.traductions.length > 0){
              this.operationDurationEng = antecedentesLegales.traductions[0].value
              this.registerPlaceEng = antecedentesLegales.traductions[1].value
              this.publicRegisterEng = antecedentesLegales.traductions[2].value
              this.currentPaidCapitalComentaryEng = antecedentesLegales.traductions[3].value
              this.increaceDateCapitalEng = antecedentesLegales.traductions[4].value
              this.currentExchangeRateEng = antecedentesLegales.traductions[5].value
              this.backgroundEng = antecedentesLegales.traductions[6].value
              this.historyEng = antecedentesLegales.traductions[7].value
            }
            if(antecedentesLegales.currentPaidCapitalCurrency !== null && antecedentesLegales.currentPaidCapitalCurrency > 0){
              this.currentPaidCapitalCurrency = antecedentesLegales.currentPaidCapitalCurrency
              this.currentPaidCapitalCurrencyInforme = this.listaMonedas.filter(x => x.id === this.currentPaidCapitalCurrency)[0]
              this.capitalPagadoActualInforme = this.currentPaidCapitalCurrencyInforme.valor + ' | ' + (this.currentPaidCapital !== null ? this.currentPaidCapital : '') + ' | ' + this.currentPaidCapitalComentary

            }else{
              this.currentPaidCapitalCurrency = 0
              this.capitalPagadoActualInforme = ' | ' + (this.currentPaidCapital !== null ? this.currentPaidCapital : '') + ' | ' + this.currentPaidCapitalComentary

            }
            if(antecedentesLegales.currency !== null && antecedentesLegales.currency > 0 ){
              this.currency = antecedentesLegales.currentPaidCapitalCurrency !== null ? antecedentesLegales.currentPaidCapitalCurrency : 0
              this.currencyInforme = this.listaMonedas.filter(x => x.id === this.currency)[0]
            }else{
              this.limpiarSeleccionTipoMoneda()
            }
            this.currentPaidCapitalCurrencyInforme =  {
              id : 0,
              valor  : '',
            }
            this.origin = antecedentesLegales.origin
            this.increaceDateCapital = antecedentesLegales.increaceDateCapital
            if(antecedentesLegales.currency !== null && antecedentesLegales.currency > 0){
              this.currency = antecedentesLegales.currency
              this.currencyInforme = this.listaMonedas.filter(x => x.id === this.currency)[0]
            }else{
              this.limpiarSeleccionTipoMoneda()
            }
            this.traded = antecedentesLegales.traded
            this.tradedBy = antecedentesLegales.tradedBy
            this.currentExchangeRate = antecedentesLegales.currentExchangeRate
            if(antecedentesLegales.lastQueryRrpp !== '' && antecedentesLegales.lastQueryRrpp !== null){
              this.lastQueryRrpp = antecedentesLegales.lastQueryRrpp
              const fecha1 = this.lastQueryRrpp.split("/")
              this.lastQueryRrppD = fecha1.length > 0 ? new Date(parseInt(fecha1[2]), parseInt(fecha1[1]) - 1, parseInt(fecha1[0])) : null;
            }else{
              this.lastQueryRrppD = null
            }
            this.lastQueryRrppBy = antecedentesLegales.lastQueryRrppBy
            this.background = antecedentesLegales.background
            this.history = antecedentesLegales.history
          }
        }, (error) => {
          Swal.fire({
            title: 'Ocurrió un problema. Comunicarse con Sistemas',
            text: error,
            icon: 'warning',
            confirmButtonColor: 'blue',
            confirmButtonText: 'Ok',
            width: '40rem',
            heightAuto : true
          }).then(() => {
          })
        }).add(() => {
          console.log("prueba")
          this.currentPaidCapitalCurrencyInforme = this.listaMonedas.filter(x => x.id === this.currentPaidCapitalCurrency)[0]
          this.currencyInforme = this.listaMonedas.filter(x => x.id === this.currency)[0]
          const input = document.getElementById('input_fecha_constitucion') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
          if(input){
            input.focus()
          }
          this.armarModeloActual()
          this.armarModeloModificado()
        });
    });


    this.filteredMoneda = this.ctrlMoneda.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.valor;
        return name ? this._filter(name as string) : this.listaMonedas.slice();
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
  msgTipoMoneda = ""
  colorMsgTipoMoneda = ""
  seleccionarTipoMoneda(moneda : ComboData){
    if(moneda !== null){
      if (typeof moneda === 'string' || moneda === null || moneda === undefined) {
        this.msgTipoMoneda = "Seleccione una opción."
        this.currency = 0
        this.colorMsgTipoMoneda = "red"
      } else {
        this.msgTipoMoneda = "Opción Seleccionada."
        this.currency = moneda.id
        this.colorMsgTipoMoneda = "green"
      }
    }else{
      this.currency = 0
      this.msgTipoMoneda = "Seleccione una opción."
      this.colorMsgTipoMoneda = "red"
    }
  }
  limpiarSeleccionTipoMoneda() {
    this.ctrlMoneda.reset();
    this.currency = 0
  }

  compararModelos(){
    this.armarModeloModificado()
    if(JSON.stringify(this.modeloActual) !== JSON.stringify(this.modeloModificado)){
      const tabAntecedentes = document.getElementById('tab-antecedentes') as HTMLElement | null;
      if (tabAntecedentes) {
        tabAntecedentes.classList.add('tab-cambios')
      }
    }else{
      const tabAntecedentes = document.getElementById('tab-antecedentes') as HTMLElement | null;
      if (tabAntecedentes) {
        tabAntecedentes.classList.remove('tab-cambios')
      }
    }
  }

  displayFn(moneda: ComboData): string {
    return moneda && moneda.valor ? moneda.valor : '';
  }

  private _filter(name: string): ComboData[] {
    return this.listaMonedas.filter(option => option.valor.toLowerCase().includes(name.toLowerCase()));
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
        case 'comentarioAntecedentes':
          this.background = data.comentario_es;
          this.backgroundEng = data.comentario_en;
        break
        case 'historiaAntecedentes':
          this.history = data.comentario_es;
          this.historyEng = data.comentario_en;
        break
      }
    }
  });
  }
  verPdf(){
    const dialogRef = this.dialog.open(VerPdfComponent,{
      data: {
        type : "E",
        idCompany : this.idCompany,
        section : "ANTECEDENTES",
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
        section : "ANTECEDENTES",
        language : "I",
        idTicket : 0
      },
    });
  }
  empresasRelacionadas(){
    const dialogRef = this.dialog.open(ListaEmpresas1Component, {
      data : {
        idCompany : this.idCompany,
        listRelatedCompanies : this.dataSource.data
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      this.antecedentesLegalesService.getListCompanyRelation(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSource.data = response.data
          }
        }
      )
    })
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
          case 'duracion':
            this.operationDuration = data.comentario_es
            this.operationDurationEng = data.comentario_en
          break
          case 'registradaEn':
            this.registerPlace = data.comentario_es
            this.registerPlaceEng = data.comentario_en
          break
          case 'registrosPublicos':
          this.publicRegister = data.comentario_es
          this.publicRegisterEng = data.comentario_en
          break
          case 'fechaAumento':
          this.increaceDateCapital = data.comentario_es
          this.increaceDateCapitalEng = data.comentario_en
          break
          case 'actualTC':
          this.currentExchangeRate = data.comentario_es
          this.currentExchangeRateEng = data.comentario_en
          break
        }
      }
    });
  }
  abrirCapitalPagado(){
    const dialogRef = this.dialog.open(CapitalPagadoComponent, {
      data : {
        moneda : this.currentPaidCapitalCurrency,
        monto : this.currentPaidCapital,
        observacion : this.currentPaidCapitalComentary,
        observacionIng : this.currentPaidCapitalComentaryEng
      }
    })
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        console.log(data)
        this.currentPaidCapitalCurrency = data.idMoneda
        this.currentPaidCapital = data.monto
        this.currentPaidCapitalComentary = data.observacion
        this.currentPaidCapitalComentaryEng = data.observacionIng
      }
    }).add(
      () => {
        if(this.currentPaidCapitalCurrency !== 0) {
          const moneda = this.listaMonedas.filter(x => x.id === this.currentPaidCapitalCurrency)[0]
          this.capitalPagadoActualInforme = (moneda !== null ? moneda.valor.substring(0,3) + ' | ' : '')  + formatNumber(this.currentPaidCapital, 'en-US','.2')+ ' | ' + this.currentPaidCapitalComentary
          console.log(moneda.valor.substring(0,3))
          const input = document.getElementById('input_fecha_constitucion') as HTMLElement | null;
          if(input){
            input.focus()
          }
        }else{
          this.capitalPagadoActualInforme =formatNumber(this.currentPaidCapital, 'en-US','.2') + ' | ' + this.currentPaidCapitalComentary

        }

      }
    );
  }


  selectFechaUltimaConsulta(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.lastQueryRrpp = this.formatDate(selectedDate);
    }
  }

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }

  //TITULOS DE COMENTARIOS
  tituloDuracion : string = "Duración"
  tituloRegistradaEn : string = 'Registrada En'
  tituloRegistrosPublicos : string = 'Registros Públicos'
  tituloCapitalActual : string = 'Capital Actual'
  tituloFechaAumento : string = 'Fecha de Aumento'
  tituloActualTC : string = 'Actual T.C. Por 1US$ '
  tituloComentarioAntecedentes : string = 'Antecedentes Legales '
  subtituloComentarioAntecedentes: string = 'Anote aquí unicamente Datos de Contitución, Gestores del Negocio, Aumentos del Capital, Cambios de Razón Social, Objeto Social, Fusiones, Cotización de la Acciones, entre otros.'
  tituloHistoria : string = 'Historia (Antecedentes)'
  subtituloHistoria: string = 'Anote aquí unicamente el Historial de la Empresa a travéz del tiempo, a que grupo económico pertenecen, destacar al principal accionista, posición en el mercado, etc.'

  selectOrigen(origen : string){
    this.origin = origen
  }
  selectCotizadoEnBolsaPor(cotizadaEnBolsaPor : string){
    this.tradedBy = cotizadaEnBolsaPor
  }

  //ANTECEDENTES


  armarModeloActual(){
    this.modeloActual[0] = {
      id : this.id,
      idCompany : this.idCompany,
      constitutionDate : this.constitutionDate,
      startFunctionYear : this.startFunctionYear,
      operationDuration : this.operationDuration,
      registerPlace : this.registerPlace,
      notaryRegister : this.notaryRegister,
      publicRegister : this.publicRegister,
      currentPaidCapital : this.currentPaidCapital,
      currentPaidCapitalCurrency : this.currentPaidCapitalCurrency,
      currentPaidCapitalComentary : this.currentPaidCapitalComentary,
      origin : this.origin,
      increaceDateCapital : this.increaceDateCapital,
      currency : this.currency,
      traded : this.traded,
      tradedBy : this.tradedBy,
      currentExchangeRate : this.currentExchangeRate,
      lastQueryRrpp : this.lastQueryRrpp,
      lastQueryRrppBy : this.lastQueryRrppBy,
      background : this.background,
      history : this.history,
      traductions : [
        {
          key : "S_B_DURATION",
          value : this.operationDurationEng
        },
        {
          key : "S_B_REGISTERIN",
          value : this.registerPlaceEng
        },
        {
          key : "S_B_PUBLICREGIS",
          value : this.publicRegisterEng
        },
        {
          key : "L_B_PAIDCAPITAL",
          value : this.currentPaidCapitalComentaryEng
        },
        {
          key : "S_B_INCREASEDATE",
          value : this.increaceDateCapitalEng
        },
        {
          key : "S_B_TAXRATE",
          value : this.currentExchangeRateEng
        },
        {
          key : "L_B_LEGALBACK",
          value : this.backgroundEng
        },
        {
          key : "L_B_HISTORY",
          value : this.historyEng
        }
      ]
    }
  }
  armarModeloModificado(){

    this.modeloModificado[0] = {
      id : this.id,
      idCompany : this.idCompany,
      constitutionDate : this.constitutionDate,
      startFunctionYear : this.startFunctionYear,
      operationDuration : this.operationDuration,
      registerPlace : this.registerPlace,
      notaryRegister : this.notaryRegister,
      publicRegister : this.publicRegister,
      currentPaidCapital : this.currentPaidCapital,
      currentPaidCapitalCurrency : this.currentPaidCapitalCurrency,
      currentPaidCapitalComentary : this.currentPaidCapitalComentary,
      origin : this.origin,
      increaceDateCapital : this.increaceDateCapital,
      currency : this.currency,
      traded : this.traded,
      tradedBy : this.tradedBy,
      currentExchangeRate : this.currentExchangeRate,
      lastQueryRrpp : this.lastQueryRrpp,
      lastQueryRrppBy : this.lastQueryRrppBy,
      background : this.background,
      history : this.history,
      traductions : [
        {
          key : "S_B_DURATION",
          value : this.operationDurationEng
        },
        {
          key : "S_B_REGISTERIN",
          value : this.registerPlaceEng
        },
        {
          key : "S_B_PUBLICREGIS",
          value : this.publicRegisterEng
        },
        {
          key : "L_B_PAIDCAPITAL",
          value : this.currentPaidCapitalComentaryEng
        },
        {
          key : "S_B_INCREASEDATE",
          value : this.increaceDateCapitalEng
        },
        {
          key : "S_B_TAXRATE",
          value : this.currentExchangeRateEng
        },
        {
          key : "L_B_LEGALBACK",
          value : this.backgroundEng
        },
        {
          key : "L_B_HISTORY",
          value : this.historyEng
        }
      ]
    }
  }
  eliminarEmpresaRelacionada(id:number){
    Swal.fire({
      title: '¿Está seguro de eliminar la relación?',
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
        this.antecedentesLegalesService.deleteCompanyRelation(id).subscribe((response) => {
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
          this.antecedentesLegalesService.getListCompanyRelation(this.idCompany).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSource.data = response.data
              }
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


  guardar() {
    this.armarModeloModificado()
    console.log(this.constitutionDate+'cxc')
    if(this.id > 0){
     
          const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.remove('hide-loader');
          }
          console.log(this.modeloModificado[0])
          this.antecedentesLegalesService.updateAntecedentesLegales(this.modeloModificado[0]).subscribe((response) => {
          if(response.isSuccess === true && response.isWarning === false){
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            this.showSuccess("Datos guardados correctamente");

            this.armarModeloActual();
            this.armarModeloModificado();
          }else{
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            this.showError("Comunicarse con sistemas");
          }
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
       
      },(error)=>{
        if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            this.showError("Comunicarse con sistemas");
    
      });
    }else{
     
          const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.remove('hide-loader');
          }
          this.antecedentesLegalesService.updateAntecedentesLegales(this.modeloModificado[0]).subscribe((response) => {

            if(response.isSuccess === true && response.isWarning === false){
              if(paginaDetalleEmpresa){
                paginaDetalleEmpresa.classList.add('hide-loader');
              }

              const tabAntecedentes = document.getElementById('tab-antecedentes') as HTMLElement | null;
              if (tabAntecedentes) {
                tabAntecedentes.classList.add('tab-con-datos')
              }

              this.showSuccess("Datos guardados correctamente");
              this.armarModeloActual();
              this.armarModeloModificado();
            }else{
              if(paginaDetalleEmpresa){
                paginaDetalleEmpresa.classList.add('hide-loader');
              }
              this.showError("Comunicarse con sistemas");
            }
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            this.id = response.data
            console.log(response)
          }, (error) => {
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            this.showError("Comunicarse con sistemas");
          })
       
    }
  }
  salir(){
  }
  showSuccess(message: string) {
    this.toastr.success(message,'Operación Exitosa!!');
  }
  showError(message: string) {
    this.toastr.error( message,'Ocurrió un error!!');
  }
}
