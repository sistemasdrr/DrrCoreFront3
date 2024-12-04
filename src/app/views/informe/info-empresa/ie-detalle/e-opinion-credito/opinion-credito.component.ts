import { OpinionCreditoService } from './../../../../../services/informes/empresa/opinion-credito.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TraduccionDialogComponent } from '@shared/components/traduccion-dialog/traduccion-dialog.component';
import { VerPdfComponent } from '@shared/components/ver-pdf/ver-pdf.component';
import { OpinionCredito } from 'app/models/informes/empresa/opinion-credito';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-opinion-credito',
  templateUrl: './opinion-credito.component.html',
  styleUrls: ['./opinion-credito.component.scss'],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class OpinionCreditoComponent implements OnInit, OnDestroy {

  id = 0
  idCompany = 0
  creditRequest = false
  consultedCredit = ""
  consultedCreditEng = ""
  suggestedCredit = ""
  suggestedCreditEng = ""
  currentCommentary = ""
  currentCommentaryEng = ""
  previousCommentary = ""
  arrayOpinion: any[]
  modeloActual : OpinionCredito[] = []
  modeloModificado : OpinionCredito[] = []
opinion=''

  constructor(private opinionCreditoService : OpinionCreditoService ,private dialog : MatDialog, private activatedRoute : ActivatedRoute){
      const id = this.activatedRoute.snapshot.paramMap.get('id');
      if (id?.includes('nuevo')) {
        this.idCompany = 0
      } else {
        this.idCompany = parseInt(id + '')
      }
      this.arrayOpinion=[
        '',
        'Es Apto para el crédito solicitado, por su condición financiera y forma de pagos.',
        'Es Apto para el crédito solicitado, pero se sugiere alguna garantía colateral.',
        'Es Apto para el crédito indicado en razón de la condición Financiera y Politica de Pago referida.',
        'No es Apto para el monto solicitado, pero si es apto para un crédito menor.',
        'No es Apto para créditos al momento, Situación financiera precaria y/o pagos morosos.',
        'Ante la declinación de entregarnos Balances, no conocer sus referencias de pago y otras informaciones, lamentamos no poder dar una opinión de crédito.',
        'Organismo Estatal que carece de cifras y referencias comerciales como para dar una opinión de crédito.',
        'Son aptos para el crédito sugerido, en razón a aspectos de orden externo, ya que al carecer de estados financieros, sustentan nuestra opinión en base a la antiguedad de la empresa, al respaldo de sus accionistas, etc. pero para una mayor seguridad se podría solicitar alguna garantía colateral.',
        'Información comercial y financiera insuficiente. Empresa poco transparente. Se sugiere venderle al contadoadelantado.',
        'Es APTA para el crédito máximo indicado y en un solo pago.',
      ]
  }

  compararModelosF : any
  ngOnInit(): void {
    const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
    if(paginaDetalleEmpresa){
      paginaDetalleEmpresa.classList.remove('hide-loader');
    }
    if(this.idCompany !== 0){
      this.opinionCreditoService.getCreditOpinionByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            const opinionCredito = response.data
            if(opinionCredito){
              this.id = opinionCredito.id
              this.creditRequest = opinionCredito.creditRequest
              this.consultedCredit = opinionCredito.consultedCredit
              this.suggestedCredit = opinionCredito.suggestedCredit
              this.currentCommentary = opinionCredito.currentCommentary
              this.previousCommentary = opinionCredito.previousCommentary
              if(opinionCredito.traductions.length === 3){
                console.log(opinionCredito.traductions)
                this.consultedCreditEng = opinionCredito.traductions[0].value
                this.suggestedCreditEng = opinionCredito.traductions[1].value
                this.currentCommentaryEng = opinionCredito.traductions[2].value
              }
            }
            this.armarModeloActual()
            this.armarModeloModificado()
          }
        }
      ).add(
        () => {
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
        }
      )
    }else{
      if(paginaDetalleEmpresa){
        paginaDetalleEmpresa.classList.add('hide-loader');
      }
    }
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
      const tabOpinion = document.getElementById('tab-opinion-credito') as HTMLElement | null;
      if (tabOpinion) {
        tabOpinion.classList.add('tab-cambios')
      }
    }else{
      const tabOpinion = document.getElementById('tab-opinion-credito') as HTMLElement | null;
      if (tabOpinion) {
        tabOpinion.classList.remove('tab-cambios')
      }
    }
  }
  verPdf(){
    const dialogRef = this.dialog.open(VerPdfComponent,{
      data: {
        type : "E",
        idCompany : this.idCompany,
        section : "OPINION-CREDITO",
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
        section : "OPINION-CREDITO",
        language : "I",
        idTicket : 0
      },
    });
  }
  armarModeloActual(){
    this.modeloActual[0] = {
      id : this.id,
      idCompany : this.idCompany,
      creditRequest : this.creditRequest,
      consultedCredit : this.consultedCredit,
      suggestedCredit : this.suggestedCredit,
      currentCommentary : this.currentCommentary,
      previousCommentary : this.previousCommentary,
      traductions : [
        {
          key : 'S_O_QUERYCREDIT',
          value : this.consultedCreditEng
        },
        {
          key : 'S_O_SUGCREDIT',
          value : this.suggestedCreditEng
        },
        {
          key : 'L_O_COMENTARY',
          value : this.currentCommentaryEng
        },
      ]
    }
  }
  armarModeloModificado(){
    this.modeloModificado[0] = {
      id : this.id,
      idCompany : this.idCompany,
      creditRequest : this.creditRequest,
      consultedCredit : this.consultedCredit,
      suggestedCredit : this.suggestedCredit,
      currentCommentary : this.currentCommentary,
      previousCommentary : this.previousCommentary,
      traductions : [
        {
          key : 'S_O_QUERYCREDIT',
          value : this.consultedCreditEng
        },
        {
          key : 'S_O_SUGCREDIT',
          value : this.suggestedCreditEng
        },
        {
          key : 'L_O_COMENTARY',
          value : this.currentCommentaryEng
        },
      ]
    }
  }
  changeOpinion(){
    this.currentCommentary= this.opinion

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
          case 'creditoConsultado':
          this.consultedCredit = data.comentario_es;
          this.consultedCreditEng = data.comentario_en;
          break
          case 'creditoSugerido':
          this.suggestedCredit = data.comentario_es;
          this.suggestedCreditEng = data.comentario_en;
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
          case 'comentarioAnotado':
          this.currentCommentary = data.comentario_es;
          this.currentCommentaryEng = data.comentario_en;
          break

        }
      }
    });
  }
  titulo = 'Comentario - Traduccion'
  tituloCreditoConsultado = 'Crédito Consultado'
  tituloCreditoSugerido = 'Crédito Sugerido'
  tituloComentario = 'Comentario Acorde a lo Anotado '

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
          this.opinionCreditoService.addCreditOpinion(this.modeloModificado[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                const tabOpinion = document.getElementById('tab-opinion-credito') as HTMLElement | null;
                  if (tabOpinion) {
                    tabOpinion.classList.add('tab-con-datos')
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
          this.opinionCreditoService.addCreditOpinion(this.modeloModificado[0]).subscribe(
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
