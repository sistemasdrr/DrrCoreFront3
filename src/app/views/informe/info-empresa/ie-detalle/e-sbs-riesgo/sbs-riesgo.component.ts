import { CompanySbs, ProveedorHistory } from './../../../../../models/informes/empresa/sbs-riesgo';
import { ActivatedRoute } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleProveedorComponent } from './detalle-proveedor/detalle-proveedor.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { MorosidadComercialComponent } from './morosidad-comercial/morosidad-comercial.component';
import { DeudaBancariaComponent } from './deuda-bancaria/deuda-bancaria.component';
import { Avales, DeudaBancariaT, MorosidadComercialT, ProveedorT } from 'app/models/informes/empresa/sbs-riesgo';
import { SbsRiesgoService } from 'app/services/informes/empresa/sbs-riesgo.service';
import { ComboService } from 'app/services/combo.service';
import { ComboData } from 'app/models/combo';
import { AvalesComponent } from './avales/avales.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TraduccionDialogComponent } from '@shared/components/traduccion-dialog/traduccion-dialog.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import * as moment from 'moment';
import { VerPdfComponent } from '@shared/components/ver-pdf/ver-pdf.component';

@Component({
    selector: 'app-sbs-riesgo',
    templateUrl: './sbs-riesgo.component.html',
    styleUrls: ['./sbs-riesgo.component.scss'],
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
export class SbsRiesgoComponent implements OnInit, OnDestroy{

  id = 0
  idCompany = 0
  idOpcionalCommentarySbs = 0
  aditionalCommentaryRiskCenter = ""
  aditionalCommentaryRiskCenterEng = ""
  debtRecordedDate = ""
  debtRecordedDateD : Date | null = null
  exchangeRate = 0
  bankingCommentary = ""
  bankingCommentaryEng = ""
  endorsementsObservations = ""
  endorsementsObservationsEng = ""
  referentOrAnalyst = ""
  date = ""
  dateD : Date | null = null
  litigationsCommentary = ""
  litigationsCommentaryEng = ""
  creditHistoryCommentary = ""
  creditHistoryCommentaryEng = ""
  guaranteesOfferedNc = 0
  guaranteesOfferedFc = 0

  totalesMN = 0
  totalesME = 0
  totalesMD = 0
  idTicket = 0

  listaOpcionalCommentary : ComboData[] = []
  modeloActual : CompanySbs[] = []
  modeloModificado : CompanySbs[] = []

  dataSourceProveedor: MatTableDataSource<ProveedorT>
  dataSourceProveedorHistory: MatTableDataSource<ProveedorHistory>
  dataSourceMorosidadComercial: MatTableDataSource<MorosidadComercialT>
  dataSourceDeudaBancaria: MatTableDataSource<DeudaBancariaT>
  dataSourceAvales: MatTableDataSource<Avales>
  columnsToDisplayProveedor = ['name', 'telephone', 'country', 'maximumAmount', 'timeLimit', 'compliance', 'date','productsTheySell', 'attendedBy','accion'];
  columnsToDisplayMorosidadComercial = ['creditorOrSupplier', 'documentType', 'date', 'amountNc', 'amountFc', 'pendingPaymentDate', 'daysLate', 'accion'];
  columnsToDisplayDeudaBancaria = ['bankName', 'qualification', 'debtDate', 'debtNc', 'debtFc', 'memo', 'accion'];
  columnsToDisplayAval = ['endorsementName', 'ruc', 'amountUs', 'amountNc', 'date', 'receivingEntity', 'accion'];

  constructor(private dialog : MatDialog,private sbsService : SbsRiesgoService, private activatedRoute : ActivatedRoute, private comboService : ComboService){
    this.dataSourceProveedor = new MatTableDataSource()
    this.dataSourceProveedorHistory = new MatTableDataSource()
    this.dataSourceMorosidadComercial = new MatTableDataSource()
    this.dataSourceDeudaBancaria = new MatTableDataSource()
    this.dataSourceAvales = new MatTableDataSource()
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id?.includes('nuevo')) {
      this.idCompany = 0
    } else {
      this.idCompany = parseInt(id + '')
    }
    const cupon = this.activatedRoute.snapshot.paramMap.get('cupon');
    if(cupon){
      this.idTicket = parseInt(cupon)
      console.log(this.idTicket)
    }
  }
  compararModelosF : any

  ngOnInit(): void {
    const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
    if(paginaDetalleEmpresa){
      paginaDetalleEmpresa.classList.remove('hide-loader');
    }
    this.comboService.getComentarioOpcionalSbs().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.listaOpcionalCommentary = response.data
        }
      }
    ).add(
      () => {
        if(this.idCompany !== 0){
          this.sbsService.getCompanySbsById(this.idCompany).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                const companySbs = response.data
                console.log(response)
                if(companySbs){
                  this.id = companySbs.id
                  this.idOpcionalCommentarySbs = companySbs.idOpcionalCommentarySbs
                  this.aditionalCommentaryRiskCenter = companySbs.aditionalCommentaryRiskCenter
                  this.exchangeRate = companySbs.exchangeRate
                  this.bankingCommentary = companySbs.bankingCommentary
                  this.endorsementsObservations = companySbs.endorsementsObservations
                  this.referentOrAnalyst = companySbs.referentOrAnalyst
                  this.litigationsCommentary = companySbs.litigationsCommentary
                  this.creditHistoryCommentary = companySbs.creditHistoryCommentary
                  this.guaranteesOfferedNc = companySbs.guaranteesOfferedNc
                  this.guaranteesOfferedFc = companySbs.guaranteesOfferedFc
                  if(companySbs.date !== null && companySbs.date !== ''){
                    const fecha = companySbs.date.split("/")
                    if(fecha.length > 0){
                      this.dateD = new Date(parseInt(fecha[2]),parseInt(fecha[1])-1,parseInt(fecha[0]))
                      this.date = companySbs.date
                    }else{
                      this.dateD = null
                    }
                  }
                  if(companySbs.debtRecordedDate !== null && companySbs.debtRecordedDate !== ''){
                    const fecha = companySbs.debtRecordedDate.split("/")
                    if(fecha.length > 0){
                      this.debtRecordedDateD = new Date(parseInt(fecha[2]),parseInt(fecha[1])-1,parseInt(fecha[0]))
                      this.debtRecordedDate = companySbs.debtRecordedDate
                    }else{
                      this.debtRecordedDateD = null
                    }
                  }
                  if(companySbs.traductions.length >= 3){
                    if(companySbs.traductions[0].value !== null){
                      this.aditionalCommentaryRiskCenterEng = companySbs.traductions[0].value
                    }
                    if(companySbs.traductions[1].value !== null){
                      this.bankingCommentaryEng = companySbs.traductions[1].value
                    }
                    if(companySbs.traductions[2].value !== null){
                      this.endorsementsObservationsEng = companySbs.traductions[2].value
                    }
                    if(companySbs.traductions[3].value !== null){
                      this.litigationsCommentaryEng = companySbs.traductions[3].value
                    }
                    if(companySbs.traductions[4].value !== null){
                      this.creditHistoryCommentaryEng = companySbs.traductions[4].value
                    }
                  }
                }
              }
            }
          ).add(() => {

            this.armarModeloActual()
            this.armarModeloModificado()
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
          })
          this.sbsService.getProviderByIdCompany(this.idCompany).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSourceProveedor.data = response.data
              }
            }
          )
          this.sbsService.getLatePaymentByIdCompany(this.idCompany).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSourceMorosidadComercial.data = response.data
              }
            }
          )
          this.sbsService.getEndorsementByIdCompany(this.idCompany).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSourceAvales.data = response.data
              }
            }
          )
          this.sbsService.getBankDebtByIdCompany(this.idCompany).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSourceDeudaBancaria.data = response.data
                this.totalesMN = 0
                this.totalesME = 0
                response.data.forEach(deudaBancaria => {
                  this.totalesMN += deudaBancaria.debtNc
                  this.totalesME += deudaBancaria.debtFc
                });
                if(this.exchangeRate !== 0 && this.exchangeRate !== null){
                  this.totalesMD = parseFloat((this.totalesMN / this.exchangeRate).toFixed(2))
                }

              }
            }
          )
        }
      }
    )
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
  compararModelos(){
    this.armarModeloModificado()
    if(JSON.stringify(this.modeloActual) !== JSON.stringify(this.modeloModificado)){
      const tabSbs = document.getElementById('tab-sbs-riesgo') as HTMLElement | null;
      if (tabSbs) {
        tabSbs.classList.add('tab-cambios')
      }
    }else{
      const tabSbs = document.getElementById('tab-sbs-riesgo') as HTMLElement | null;
      if (tabSbs) {
        tabSbs.classList.remove('tab-cambios')
      }
    }
  }
  verPdf(){
    const dialogRef = this.dialog.open(VerPdfComponent,{
      data: {
        type : "E",
        idCompany : this.idCompany,
        section : "SBS",
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
        section : "SBS",
        language : "I",
        idTicket : 0
      },
    });
  }
  armarModeloActual(){
    this.modeloActual[0] = {
      id : this.id,
      idCompany : this.idCompany,
      idOpcionalCommentarySbs : this.idOpcionalCommentarySbs,
      aditionalCommentaryRiskCenter : this.aditionalCommentaryRiskCenter,
      debtRecordedDate : this.debtRecordedDate,
      exchangeRate : this.exchangeRate,
      bankingCommentary : this.bankingCommentary,
      endorsementsObservations : this.endorsementsObservations,
      referentOrAnalyst : this.referentOrAnalyst,
      date : this.date,
      litigationsCommentary : this.litigationsCommentary,
      creditHistoryCommentary : this.creditHistoryCommentary,
      guaranteesOfferedNc : this.guaranteesOfferedNc,
      guaranteesOfferedFc : this.guaranteesOfferedFc,
      traductions : [
        {
          key : 'L_S_COMENTARY',
          value : this.aditionalCommentaryRiskCenterEng
        },
        {
          key : 'L_S_BANCARIOS',
          value : this.bankingCommentaryEng
        },
        {
          key : 'L_S_AVALES',
          value : this.endorsementsObservationsEng
        },
        {
          key : 'L_S_LITIG',
          value : this.litigationsCommentaryEng
        },
        {
          key : 'L_S_CREDHIS',
          value : this.creditHistoryCommentaryEng
        },
      ]
    }
  }
  armarModeloModificado(){
    this.modeloModificado[0] = {
      id : this.id,
      idCompany : this.idCompany,
      idOpcionalCommentarySbs : this.idOpcionalCommentarySbs,
      aditionalCommentaryRiskCenter : this.aditionalCommentaryRiskCenter,
      debtRecordedDate : this.debtRecordedDate,
      exchangeRate : this.exchangeRate,
      bankingCommentary : this.bankingCommentary,
      endorsementsObservations : this.endorsementsObservations,
      referentOrAnalyst : this.referentOrAnalyst,
      date : this.date,
      litigationsCommentary : this.litigationsCommentary,
      creditHistoryCommentary : this.creditHistoryCommentary,
      guaranteesOfferedNc : this.guaranteesOfferedNc,
      guaranteesOfferedFc : this.guaranteesOfferedFc,
      traductions : [
        {
          key : 'L_S_COMENTARY',
          value : this.aditionalCommentaryRiskCenterEng
        },
        {
          key : 'L_S_BANCARIOS',
          value : this.bankingCommentaryEng
        },
        {
          key : 'L_S_AVALES',
          value : this.endorsementsObservationsEng
        },
        {
          key : 'L_S_LITIG',
          value : this.litigationsCommentaryEng
        },
        {
          key : 'L_S_CREDHIS',
          value : this.creditHistoryCommentaryEng
        },
      ]
    }
  }

  agregarTraduccion(titulo : string, subtitulo : string, comentario_es : string, comentario_en : string, input : string) {
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
          case 'comentarioAdicional':
            this.aditionalCommentaryRiskCenter = data.comentario_es
            this.aditionalCommentaryRiskCenterEng = data.comentario_en
          break
          case 'comentarioBancario':
            this.bankingCommentary = data.comentario_es
            this.bankingCommentaryEng = data.comentario_en
          break
        }
      }
    });
  }

  //TABLA PROVEEDOR
  agregarProveedor() {
    const dialogR1 = this.dialog.open(DetalleProveedorComponent, {
      data: {
        accion : 'AGREGAR',
        id : 0,
        idCompany : this.idCompany
        },
      });
    dialogR1.afterClosed().subscribe(() => {
      this.sbsService.getProviderByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceProveedor.data = response.data
          }
        }
      )
    });
  }
  editarProveedor(id : number) {
    const dialogR2 = this.dialog.open(DetalleProveedorComponent, {
      data: {
        accion : 'EDITAR',
        id : id,
        idCompany : this.idCompany
      },
    });
    dialogR2.afterClosed().subscribe(() => {
      this.sbsService.getProviderByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceProveedor.data = response.data
          }
        }
      )
    });
  }
  eliminarProveedor(id : number){
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
        this.sbsService.deleteProvider(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title :'¡Eliminado!',
                text : 'El registro se eliminó correctamente.',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              })
            }
            this.ngOnInit();
          }
        )
      }
    })
  }

  //TABLA MOROSIDAD COMERCIAL
  agregarMorosidadComercial() {
    const dialogR1 = this.dialog.open(MorosidadComercialComponent, {
      data: {
        accion : 'AGREGAR',
        id : 0,
        idCompany : this.idCompany
        },
      });
    dialogR1.afterClosed().subscribe(() => {
      this.sbsService.getLatePaymentByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceMorosidadComercial.data = response.data
          }
        }
      )
    });
  }
  editarMorosidadComercial(id : number) {
    const dialogR2 = this.dialog.open(MorosidadComercialComponent, {
      data: {
        accion : 'EDITAR',
        id : id,
        idCompany : this.idCompany
      },
    });
    dialogR2.afterClosed().subscribe(() => {
      this.sbsService.getLatePaymentByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceMorosidadComercial.data = response.data
          }
        }
      )
    });
  }
  eliminarMorosidadComercial(id : number){
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
        this.sbsService.deleteLatePayment(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title :'¡Eliminado!',
                text : 'El registro se eliminó correctamente.',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              })
              this.sbsService.getLatePaymentByIdCompany(this.idCompany).subscribe(
                (response) => {
                  if(response.isSuccess === true && response.isWarning === false){
                    this.dataSourceMorosidadComercial.data = response.data
                  }
                }
              )
            }
          }
        )
      }
    })
  }
  //TABLA SBS
  agregarDeudaBancaria() {
    const dialogR1 = this.dialog.open(DeudaBancariaComponent, {
      data: {
        accion : 'AGREGAR',
        id : 0,
        idCompany : this.idCompany
        },
      });
    dialogR1.afterClosed().subscribe(() => {
      this.sbsService.getBankDebtByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceDeudaBancaria.data = response.data
            this.totalesMN = 0
            this.totalesME = 0
            response.data.forEach(deudaBancaria => {
              this.totalesMN += deudaBancaria.debtNc
              this.totalesME += deudaBancaria.debtFc
            });
            if(this.exchangeRate !== 0 && this.exchangeRate !== null){
              this.totalesMD = parseFloat((this.totalesMN / this.exchangeRate).toFixed(2))
            }
           }
        }
      )
    });
  }
  editarDeudaBancaria(id : number) {
    const dialogR2 = this.dialog.open(DeudaBancariaComponent, {
      data: {
        accion : 'EDITAR',
        id : id,
        idCompany : this.idCompany
      },
    });
    dialogR2.afterClosed().subscribe(() => {
      this.sbsService.getBankDebtByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceDeudaBancaria.data = response.data
            this.totalesMN = 0
            this.totalesME = 0
            response.data.forEach(deudaBancaria => {
              this.totalesMN += deudaBancaria.debtNc
              this.totalesME += deudaBancaria.debtFc
            });
            if(this.exchangeRate !== 0 && this.exchangeRate !== null){
              this.totalesMD = parseFloat((this.totalesMN / this.exchangeRate).toFixed(2))
            }
          }
        }
      )
    });
  }
  eliminarDeudaBancaria(id : number){
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
        this.sbsService.deleteBankDebt(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title :'¡Eliminado!',
                text : 'El registro se eliminó correctamente.',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              })
              this.sbsService.getBankDebtByIdCompany(this.idCompany).subscribe(
                (response) => {
                  if(response.isSuccess === true && response.isWarning === false){
                    this.dataSourceDeudaBancaria.data = response.data
                    this.totalesMN = 0
                    this.totalesME = 0
                    response.data.forEach(deudaBancaria => {
                      this.totalesMN += deudaBancaria.debtNc
                      this.totalesME += deudaBancaria.debtFc
                    });
                    if(this.exchangeRate !== 0 && this.exchangeRate !== null){
                      this.totalesMD = parseFloat((this.totalesMN / this.exchangeRate).toFixed(2))
                    }
                  }
                }
              )
            }
          }
        )
      }
    })
  }
  //AVALES
  agregarAval() {
    const dialogR1 = this.dialog.open(AvalesComponent, {
      data: {
        accion : 'AGREGAR',
        id : 0,
        idCompany : this.idCompany
        },
      });
    dialogR1.afterClosed().subscribe(() => {
      this.sbsService.getEndorsementByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceAvales.data = response.data
          }
        }
      )
    });
  }
  editarAval(id : number) {
    const dialogR2 = this.dialog.open(AvalesComponent, {
      data: {
        accion : 'EDITAR',
        id : id,
        idCompany : this.idCompany
      },
    });
    dialogR2.afterClosed().subscribe(() => {
      this.sbsService.getEndorsementByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceAvales.data = response.data
          }
        }
      )
    });
  }
  eliminarAval(id : number){
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
        this.sbsService.deleteEndorsement(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title :'¡Eliminado!',
                text : 'El registro se eliminó correctamente.',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              })
              this.sbsService.getEndorsementByIdCompany(this.idCompany).subscribe(
                (response) => {
                  if(response.isSuccess === true && response.isWarning === false){
                    this.dataSourceAvales.data = response.data
                  }
                }
              )
            }
          }
        )
      }
    })
  }

  tasaCambio(){
    if(this.exchangeRate !== 0 && this.exchangeRate !== null){
      this.totalesMD = parseFloat((this.totalesMN / this.exchangeRate).toFixed(2))
    }
  }

  selectFecha1(event: MatDatepickerInputEvent<Date>) {
    console.log(event.value);
    this.dateD = event.value;
    if (moment.isMoment(this.dateD)) {
      this.date = this.formatDate(this.dateD);
    }
  }
  selectFecha2(event: MatDatepickerInputEvent<Date>) {
    this.debtRecordedDateD = event.value;
    if (moment.isMoment(this.debtRecordedDateD)) {
      this.debtRecordedDate = this.formatDate(this.debtRecordedDateD);
    }
  }

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
  guardar(){
    if(this.id === 0){
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
          this.sbsService.addCompanySbs(this.modeloModificado[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){

                const tabSbs = document.getElementById('tab-sbs-riesgo') as HTMLElement | null;
                if (tabSbs) {
                  tabSbs.classList.add('tab-con-datos')
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
          this.sbsService.addCompanySbs(this.modeloModificado[0]).subscribe(
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
