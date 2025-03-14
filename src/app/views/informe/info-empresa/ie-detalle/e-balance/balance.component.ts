import { Component, OnInit,   } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { ComboData } from 'app/models/combo';
import { Balance } from 'app/models/informes/empresa/balance';
import { ComboService } from 'app/services/combo.service';
import { BalanceFinancieroService } from 'app/services/informes/empresa/balance-financiero.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { TraduccionDialogComponent } from '@shared/components/traduccion-dialog/traduccion-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { VerPdfComponent } from '@shared/components/ver-pdf/ver-pdf.component';
import { state, trigger, style, transition, animate } from '@angular/animations';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-balance',
    templateUrl: './balance.component.html',
    styleUrls: ['./balance.component.scss'],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'es' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
        },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }
    ],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class BalanceComponent implements OnInit {

  agregar = false
  editar = false;
  balanceSeleccionado = 0
  listaBalances : ComboData[] = []
  separator = ','
  modeloModificado : Balance[] = []

  //BALANCE
  id = 0
  idCompany = 0
  date = ""
  dateD : Date | null = null
  balanceType = "GENERAL"
  balanceTypeEng = ""
  duration = ""
  durationEng = ""
  idCurrency = 0

  currencyInforme : ComboData =  {
    id : 0,
    valor  : '',
  }
  ctrlMoneda = new FormControl<string | ComboData>('');
  listaMonedas : ComboData[] = []
  filteredMoneda: Observable<ComboData[]>;

  exchangeRate = 0
  sales = 0
  utilities = 0
  //ACTIVOS
  totalAssets = 0
  //ACTIVOS CORRIENTES
  totalCurrentAssets = 0
  aCashBoxBank = 0
  aToCollect = 0
  aInventory = 0
  aOtherCurrentAssets = 0
  //ACTIVOS NO CORRIENTES
  totalNonCurrentAssets = 0
  aFixed = 0
  aOtherNonCurrentAssets = 0
  //PASIVOS
  totalLliabilities = 0
  //PASIVOS CORRIENTES
  totalCurrentLiabilities = 0
  lCashBoxBank = 0
  lOtherCurrentLiabilities = 0
  //PASIVOS NO CORRIENTES
  totalNonCurrentLiabilities = 0
  lLongTerm = 0
  lOtherNonCurrentLiabilities = 0
  //PATRIMONIO
  totalPatrimony = 0
  pCapital = 0
  pStockPile = 0
  pUtilities = 0
  pOther = 0
  actualCurrency=0;
  totalLiabilitiesPatrimony = 0
  //RATIOS
  liquidityRatio = 0
  debtRatio = 0
  profitabilityRatio = 0
  workingCapital = 0
  loading: boolean=false;

  constructor(public dialog: MatDialog,private activatedRoute : ActivatedRoute, private toastr: ToastrService, private balanceService : BalanceFinancieroService, private comboService : ComboService){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id?.includes('nuevo')) {
        this.idCompany = 0
      } else {
        this.idCompany = parseInt(id + '')
      }
      this.filteredMoneda = new Observable<ComboData[]>();

  }

  ngOnInit(): void {
    const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
    if(paginaDetalleEmpresa){
      paginaDetalleEmpresa.classList.remove('hide-loader');
    }
    this.comboService.getTipoMoneda().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning == false){
          this.listaMonedas = response.data
        }
      }
    ).add(
      () => {
        this.filteredMoneda = this.ctrlMoneda.valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.valor;
            return name ? this._filter(name as string) : this.listaMonedas.slice();
          }),
        );
        this.balanceService.getBalances(this.idCompany, 'GENERAL').subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false && response.data.length > 0){
              this.listaBalances = response.data
              this.listaBalances.sort((b, a) => a.valor.localeCompare(b.valor));
              this.limpiarBalance()
              if(this.listaBalances.length > 0 ){
                this.balanceSeleccionado = this.listaBalances[0].id
              }
            }else{
              if(paginaDetalleEmpresa){
                paginaDetalleEmpresa.classList.add('hide-loader');
              }
            }
          }
        ).add(
          () => {
            this.balanceSeleccionado = this.listaBalances[0].id
            this.actualizarBalance(this.balanceSeleccionado)
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
          }
        )
      }
    )
  }
  displayFn(moneda: ComboData): string {
    return moneda && moneda.valor ? moneda.valor : '';
  }

  private _filter(name: string): ComboData[] {
    return this.listaMonedas.filter(option => option.valor.toLowerCase().includes(name.toLowerCase()));
  }
  msgTipoMoneda = ""
  colorMsgTipoMoneda = ""
  seleccionarTipoMoneda(moneda : ComboData){
    if(moneda !== null){
      console.log(moneda)
      if (typeof moneda === 'string' || moneda.id === 0 || moneda === null || moneda === undefined ) {
        this.msgTipoMoneda = "Seleccione una opción."
        this.idCurrency = 0
        this.colorMsgTipoMoneda = "red"
      } else {
        this.msgTipoMoneda = "Opción Seleccionada."
        this.idCurrency = moneda.id
        this.colorMsgTipoMoneda = "green"
      }
    }else{
      this.idCurrency = 0
      this.msgTipoMoneda = "Seleccione una opción."
      this.colorMsgTipoMoneda = "red"
    }
  }
  limpiarSeleccionTipoMoneda() {
    this.ctrlMoneda.reset();
    this.idCurrency = 0
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
            this.duration = data.comentario_es
            this.durationEng = data.comentario_en
          break
        }
      }
    })
  }
  verPdf(){
    const dialogRef = this.dialog.open(VerPdfComponent,{
      data: {
        type : "E",
        idCompany : this.idCompany,
        section : "BALANCES",
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
        section : "BALANCES",
        language : "I",
        idTicket : 0
      },
    });
  }
  armarModelo(){
    this.seleccionarTipoMoneda(this.currencyInforme);
    console.log(this.idCurrency)
    this.modeloModificado[0] = {
      id : this.id,
      idCompany : this.idCompany,
      date : this.date,
      balanceType : this.balanceType,
      duration : this.duration,
      durationEng : this.durationEng,
      idCurrency : this.idCurrency,
      exchangeRate :this.exchangeRate,
      sales : this.sales,
      utilities : this.utilities,
      totalAssets : this.totalAssets,
      totalCurrentAssets: this.totalCurrentAssets,
      aCashBoxBank: this.aCashBoxBank,
      aToCollect: this.aToCollect,
      aInventory: this.aInventory,
      aOtherCurrentAssets: this.aOtherCurrentAssets,
      totalNonCurrentAssets: this.totalNonCurrentAssets,
      aFixed: this.aFixed,
      aOtherNonCurrentAssets: this.aOtherNonCurrentAssets,
      totalLliabilities: this.totalLliabilities,
      totalCurrentLiabilities: this.totalCurrentLiabilities,
      lCashBoxBank: this.lCashBoxBank,
      lOtherCurrentLiabilities: this.lOtherCurrentLiabilities,
      totalNonCurrentLiabilities: this.totalNonCurrentLiabilities,
      lLongTerm: this.lLongTerm,
      lOtherNonCurrentLiabilities: this.lOtherNonCurrentLiabilities,
      totalPatrimony: this.totalPatrimony,
      pCapital: this.pCapital,
      pStockPile: this.pStockPile,
      pOther: this.pOther,
      totalLiabilitiesPatrimony: this.totalLiabilitiesPatrimony,
      liquidityRatio: this.liquidityRatio,
      debtRatio: this.debtRatio,
      pUtilities: this.pUtilities,
      profitabilityRatio: this.profitabilityRatio,
      workingCapital: this.workingCapital,
    }
  }
  updActivoCorriente(){
    console.log(this.totalCurrentAssets)
    this.totalCurrentAssets = this.aCashBoxBank + this.aToCollect + this.aInventory + this.aOtherCurrentAssets
    this.totalAssets = this.totalCurrentAssets + this.totalNonCurrentAssets
    this.updRatios()
  }
  updActivoNoCorriente(){
    this.totalNonCurrentAssets = this.aFixed + this.aOtherNonCurrentAssets
    this.totalAssets = this.totalCurrentAssets + this.totalNonCurrentAssets
    this.updRatios()
  }

  updPasivoCorriente(){
    this.totalCurrentLiabilities = this.lCashBoxBank + this.lOtherCurrentLiabilities
    this.totalLliabilities = this.totalCurrentLiabilities + this.totalNonCurrentLiabilities
    this.totalLiabilitiesPatrimony = this.totalPatrimony + this.totalLliabilities
    this.updRatios()
  }
  updPasivoNoCorriente(){
    this.totalNonCurrentLiabilities = this.lLongTerm + this.lOtherNonCurrentLiabilities
    this.totalLliabilities = this.totalCurrentLiabilities + this.totalNonCurrentLiabilities
    this.totalLiabilitiesPatrimony = this.totalPatrimony + this.totalLliabilities
    this.updRatios()
  }

  updPatrimonio(){
    this.totalPatrimony = this.pCapital + this.pStockPile + this.pOther + this.pUtilities
    this.totalLiabilitiesPatrimony = this.totalPatrimony + this.totalLliabilities
    this.updRatios()
  }

  updRatios(){
    console.log(this.totalAssets)
    this.totalLiabilitiesPatrimony = this.totalPatrimony + this.totalLliabilities
    this.liquidityRatio = parseFloat((this.totalCurrentAssets / this.totalCurrentLiabilities).toFixed(2));
    this.debtRatio = parseFloat((this.totalPatrimony / this.totalCurrentLiabilities * 100).toFixed(2));
    this.profitabilityRatio = parseFloat((this.utilities / this.sales * 100).toFixed(2));
    this.workingCapital = parseFloat((this.totalCurrentAssets - this.totalCurrentLiabilities).toFixed(2));
    if(this.totalCurrentAssets !== 0 || this.totalNonCurrentAssets !== 0){
      this.totalAssets = this.totalCurrentAssets + this.totalNonCurrentAssets
    }
    this.totalLliabilities = this.totalCurrentLiabilities + this.totalNonCurrentLiabilities
  }


//(selectionChange)="actualizarBalance($event.value)"
formatDate(date: moment.Moment): string {
  const formattedDate = date.format('DD/MM/YYYY');
  return formattedDate;
}

  agregarBalance(){
    this.agregar = true
    this.limpiarBalance();
  }
  limpiarBalance(){
    this.id = 0
    this.date = ""
    this.dateD = null
    this.balanceType = "GENERAL"
    this.duration = ""
    this.idCurrency = 0
    this.exchangeRate = 0
    this.sales = 0
    this.utilities = 0
    //ACTIVOS
    this.totalAssets = 0
    //ACTIVOS CORRIENTES
    this.totalCurrentAssets = 0
    this.aCashBoxBank = 0
    this.aToCollect = 0
    this.aInventory = 0
    this.aOtherCurrentAssets = 0
    //ACTIVOS NO CORRIENTES
    this.totalNonCurrentAssets = 0
    this.aFixed = 0
    this.aOtherNonCurrentAssets = 0
    //PASIVOS
    this.totalLliabilities = 0
    //PASIVOS CORRIENTES
    this.totalCurrentLiabilities = 0
    this.lCashBoxBank = 0
    this.lOtherCurrentLiabilities = 0
    //PASIVOS NO CORRIENTES
    this.totalNonCurrentLiabilities = 0
    this.lLongTerm = 0
    this.lOtherNonCurrentLiabilities = 0
    //PATRIMONIO
    this.totalPatrimony = 0
    this.pCapital = 0
    this.pStockPile = 0
    this.pUtilities = 0
    this.pOther = 0

    this.totalLiabilitiesPatrimony = 0
    //RATIOS
    this.liquidityRatio = 0
    this.debtRatio = 0
    this.profitabilityRatio = 0
    this.workingCapital = 0
    this.editar = false
  }
  selectFecha(event: MatDatepickerInputEvent<Date>) {
    this.dateD = event.value!
    if (moment.isMoment(this.dateD)) {
      this.date = this.formatDate(this.dateD);
    }
  }
  editarBalance(){
    this.agregar = true
  }
  eliminarBalance(){
    console.log(this.id)
    Swal.fire({
      title: '¿Está seguro de eliminar este balance?',
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
        this.balanceService.deleteBalance(this.id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.showSuccess('¡Se eliminó el balance correctamente!')
            
                this.balanceService.getBalances(this.idCompany, 'GENERAL').subscribe(
                  (response) => {
                    if(response.isSuccess === true && response.isWarning === false){
                      this.listaBalances = response.data
                      this.limpiarBalance()
                      if(this.listaBalances.length > 0 ){
                        this.balanceSeleccionado = this.listaBalances[0].id
                      }
                      this.agregar = false
                    }
                  }
                )             
            }
          }
        )
      }
    });

  }
  confirmarAgregar(){
    this.armarModelo()
    console.log(this.modeloModificado[0])
    if(this.id === 0){
         this.loading=true;
          this.balanceService.addOrUpdateBalance(this.modeloModificado[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.loading=false;
                this.showSuccess('¡Se agregó el balance correctamente!')
                  this.balanceService.getBalances(this.idCompany, 'GENERAL').subscribe(
                    (response) => {
                      if(response.isSuccess === true && response.isWarning === false){
                        this.listaBalances = response.data
                        this.agregar = false
                      }
                    }
                  )
        }
      },(error)=>{
        this.loading=false;
          this.showError(error.message);

      });
    }else if(this.id > 0){
     
          this.balanceService.addOrUpdateBalance(this.modeloModificado[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.loading=false;
                this.showSuccess('¡Se modificó el balance correctamente!')
            
                  this.balanceService.getBalances(this.idCompany, 'GENERAL').subscribe(
                    (response) => {
                      if(response.isSuccess === true && response.isWarning === false){
                        this.listaBalances = response.data
                        this.agregar = false
                      }
                    }
                  )
        }
      },(error)=>{
        this.loading=false;
        this.showError(error.message);

    });
    }

  }
  cancelarAgregarBalance(){
    this.agregar = false
    this.balanceSeleccionado = 0
    this.id = 0
  }
  actualizarBalance(id : number){
    this.loading=true;
    this.balanceService.getBalanceById(id).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.loading=false;
          const balance = response.data
          console.log(response.data)
          if(balance){
            this.id = balance.id
            if(balance.date !== null && balance.date !== ""){
              const fecha = balance.date.split("/")
              if(fecha.length > 0){
                this.dateD = new Date(parseInt(fecha[2]),parseInt(fecha[1])-1,parseInt(fecha[0]))
                this.date = balance.date
              }else{
                this.dateD = null
              }
            }
            this.balanceType = balance.balanceType
            this.duration = balance.duration
            this.durationEng = balance.durationEng
            this.idCurrency = balance.idCurrency
            this.exchangeRate = balance.exchangeRate
            this.sales = balance.sales
            this.utilities = balance.utilities
            this.totalAssets = balance.totalAssets
            this.totalCurrentAssets = balance.totalCurrentAssets
            this.aCashBoxBank = balance.aCashBoxBank
            this.aToCollect = balance.aToCollect
            this.aInventory = balance.aInventory
            this.aOtherCurrentAssets = balance.aOtherCurrentAssets
            this.totalNonCurrentAssets = balance.totalNonCurrentAssets
            this.aFixed = balance.aFixed
            this.aOtherNonCurrentAssets = balance.aOtherNonCurrentAssets
            this.totalLliabilities = balance.totalLliabilities
            this.totalCurrentLiabilities = balance.totalCurrentLiabilities
            this.lCashBoxBank = balance.lCashBoxBank
            this.lOtherCurrentLiabilities = balance.lOtherCurrentLiabilities
            this.totalNonCurrentLiabilities = balance.totalNonCurrentLiabilities
            this.lLongTerm = balance.lLongTerm
            this.lOtherNonCurrentLiabilities = balance.lOtherNonCurrentLiabilities
            this.totalPatrimony = balance.totalPatrimony
            this.pCapital = balance.pCapital
            this.pStockPile = balance.pStockPile
            this.pUtilities = balance.pUtilities
            this.pOther = balance.pOther
            this.totalLiabilitiesPatrimony = balance.totalLiabilitiesPatrimony
            this.liquidityRatio = balance.liquidityRatio
            this.debtRatio = balance.debtRatio
            this.profitabilityRatio = balance.profitabilityRatio
            this.workingCapital = balance.workingCapital
          }
        }
      }
    ).add(
      () => {
        if(this.idCurrency !== null && this.idCurrency !== 0){
          this.currencyInforme = this.listaMonedas.filter(x => x.id === this.idCurrency)[0]
        }
      }
    )
  }

  enter(event : any){
    console.log(event)
  }

  pintar(){
    console.log("balance mostrado")
  }
  showSuccess(message: string) {
    this.toastr.success(message,'Operación Exitosa!!');
  }
  showError(message: string) {
    this.toastr.error( message,'Ocurrió un error!!');
  }
}
