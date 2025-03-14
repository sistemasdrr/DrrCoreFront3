import { Component, OnDestroy, OnInit } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TraduccionDialogComponent } from '@shared/components/traduccion-dialog/traduccion-dialog.component';
import { ComboData, ComboDataCode } from 'app/models/combo';
import { TrabajoA } from 'app/models/informes/persona/trabajo';
import { ComboService } from 'app/services/combo.service';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';
import { TrabajoPService } from 'app/services/informes/persona/trabajo-p.service';
import { ListaEmpresasComponent } from 'app/views/pedidos/detalle/lista-empresas/lista-empresas.component';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';

@Component({
    selector: 'app-p-trabajo',
    templateUrl: './p-trabajo.component.html',
    styleUrls: ['./p-trabajo.component.scss'],
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
export class PTrabajoComponent implements OnInit, OnDestroy{
  id = 0
  idPerson = 0
  idCompany = 0

  name = ""
  address = ""
  taxTypeName = ""
  taxTypeCode = ""
  subTelephone = ""
  telephone = ""

  currentJob = ""
  currentJobEng = ""
  startDate = ""
  startDateEng = ""
  startDateD : Date | null = null
  endDate = ""
  endDateEng = ""
  endDateD : Date | null = null
  monthlyIncome = ""
  annualIncome = ""
  annualIncomeEng = ""
  jobDetails = ""
  jobDetailsEng = ""

  modeloActual : TrabajoA[] = []
  modeloModificado : TrabajoA[] = []


  controlProfesion = new FormControl<string | ComboDataCode>('');
  filterProfesion: Observable<ComboDataCode[]>
  listaProfesion: ComboDataCode[] = []
  profesion: ComboDataCode = {
    id: 0,
    valor: '',
    valorEng : '',
    code : ''
  }
  msgProfesion = ""
  colorMsgProfesion = ""

  constructor(private router: Router,private comboService : ComboService, private dialog : MatDialog, private empresaService : DatosEmpresaService, private activatedRoute: ActivatedRoute, private trabajoService : TrabajoPService){
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id?.includes('nuevo')) {
      this.idPerson = 0
    } else {
      this.idPerson = parseInt(id + '')
    }
    this.filterProfesion = new Observable<ComboDataCode[]>()
    console.log(this.idPerson)
  }
  compararModelosF : any
  ngOnInit(): void {
    const loader = document.getElementById('pagina-detalle-persona') as HTMLElement | null;
    if(loader){
      loader.classList.remove('hide-loader');
    }
    this.comboService.getOccupations().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.listaProfesion = response.data
        }
      }
    )
    if(this.idPerson > 0){
      this.trabajoService.getTrabajo(this.idPerson).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            const trabajo = response.data
            if(trabajo){
              this.id = trabajo.id
              this.idCompany = trabajo.idCompany
              this.name = trabajo.name
              this.address = trabajo.address
              this.taxTypeCode = trabajo.taxTypeCode
              this.taxTypeName = trabajo.taxTypeName
              this.subTelephone = trabajo.subTelephone
              this.telephone = trabajo.telephone
              this.currentJob = trabajo.currentJob
              this.monthlyIncome = trabajo.monthlyIncome
              this.annualIncome = trabajo.annualIncome
              this.jobDetails = trabajo.jobDetails
              if(trabajo.traductions.length > 0){
                this.currentJobEng = trabajo.traductions[0].value
                this.startDateEng = trabajo.traductions[1].value
                this.endDateEng = trabajo.traductions[2].value
                this.annualIncomeEng = trabajo.traductions[3].value
                this.jobDetailsEng = trabajo.traductions[4].value
              }
              if(trabajo.startDate !== null && trabajo.startDate !== ""){
                const fecha = trabajo.startDate.split("/")
                if(fecha.length > 0){
                  this.startDate = trabajo.startDate
                  this.startDateD = new Date(parseInt(fecha[2]),parseInt(fecha[1])-1,parseInt(fecha[0]))
                }
              }
              if(trabajo.endDate !== null && trabajo.endDate !== ""){
                const fecha = trabajo.endDate.split("/")
                if(fecha.length > 0){
                  this.endDate = trabajo.endDate
                  this.endDateD = new Date(parseInt(fecha[2]),parseInt(fecha[1])-1,parseInt(fecha[0]))
                }
              }
            }

          }
        }
      ).add(
        () => {
          const loader = document.getElementById('pagina-detalle-persona') as HTMLElement | null;
          if(loader){
            loader.classList.add('hide-loader');
          }

          this.armarModeloActual()
          this.armarModeloModificado()
        }
      )
    }else{
      const loader = document.getElementById('pagina-detalle-persona') as HTMLElement | null;
      if(loader){
        loader.classList.add('hide-loader');
      }
    }
    this.armarModeloActual()
    this.armarModeloModificado()

    this.compararModelosF = setInterval(() => {
      this.compararModelos();
    }, 2000);

    this.filterProfesion = this.controlProfesion.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.valor
        return name ? this._filterProfesion(name as string) : this.listaProfesion.slice()
      }),
    )
  }

  ngOnDestroy(): void {
    if (this.compararModelosF) {
      clearInterval(this.compararModelosF);
    }
  }
  private _filterProfesion(description: string): ComboDataCode[] {
    const filterValue = description.toLowerCase();
    return this.listaProfesion.filter(profesion => profesion.valor.toLowerCase().includes(filterValue));
  }

  displayProfesion(profesion : ComboDataCode): string {
    return profesion && profesion.valor ? profesion.valor : '';
  }
  limpiarSeleccionProfesion() {
    this.controlProfesion.reset();
    this.currentJob = ""
    this.currentJobEng = ""
  }
  cambioProfesion(profesion: ComboDataCode) {
    console.log(profesion)
    if (typeof profesion === 'string' || profesion === null) {
      this.msgProfesion = "Seleccione una opción."
      this.currentJob = profesion
      this.colorMsgProfesion = "red"
    } else {
      this.msgProfesion = "Opción Seleccionada."
      this.currentJob = profesion.valor
      this.currentJobEng = profesion.valorEng
      this.colorMsgProfesion = "green"
    }
    console.log(this.currentJob)
  }
  compararModelos(){
    this.armarModeloModificado()
    if(JSON.stringify(this.modeloModificado) !== JSON.stringify(this.modeloModificado)){
      const tabTrabajo = document.getElementById('tab-trabajo') as HTMLElement | null;
      if (tabTrabajo) {
        tabTrabajo.classList.add('tab-cambios')
      }
    }else{
      const tabTrabajo = document.getElementById('tab-trabajo') as HTMLElement | null;
      if (tabTrabajo) {
        tabTrabajo.classList.remove('tab-cambios')
      }
    }
  }
  selectFechaIngreso(event: MatDatepickerInputEvent<Date>) {
    this.startDateD = event.value;
    if (moment.isMoment(this.startDateD)) {
      this.startDate = this.formatDate(this.startDateD);
    }
  }
  selectFechaCese(event: MatDatepickerInputEvent<Date>) {
    this.endDateD = event.value;
    if (moment.isMoment(this.endDateD)) {
      this.endDate = this.formatDate(this.endDateD);
    }
  }

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
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
        case 'detalles':
          this.jobDetails = data.comentario_es;
          this.jobDetailsEng = data.comentario_en;
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
          case 'trabajo':
            this.currentJob = data.comentario_es
            this.currentJobEng = data.comentario_en
          break
          case 'fechaIngreso':
            this.startDate = data.comentario_es
            this.startDateEng = data.comentario_en
          break
          case 'fechaCese':
            this.endDate = data.comentario_es
            this.endDateEng = data.comentario_en
          break
          case 'ingreso':
            this.annualIncome = data.comentario_es
            this.annualIncomeEng = data.comentario_en
          break
        }
      }
    });
  }
  armarModeloActual(){
   this.modeloActual[0] = {
    id : this.id,
    idPerson : this.idPerson,
    idCompany : this.idCompany,
    currentJob : this.currentJob,
    startDate : this.startDate,
    endDate : this.endDate,
    monthlyIncome : this.monthlyIncome,
    annualIncome : this.annualIncome,
    jobDetails : this.jobDetails,
    traductions : [
      {
        key : "S_C_CURJOB",
        value : this.currentJobEng
      },
      {
        key : "S_C_STARTDT",
        value : this.startDateEng
      },
      {
        key : "S_C_ENDDT",
        value : this.endDateEng
      },
      {
        key : "S_C_INCOME",
        value : this.annualIncomeEng
      },
      {
        key : "L_C_DETAILS",
        value : this.jobDetailsEng
      },
    ]
   }
  }
  armarModeloModificado(){
   this.modeloModificado[0] = {
    id : this.id,
    idPerson : this.idPerson,
    idCompany : this.idCompany,
    currentJob : this.currentJob,
    startDate : this.startDate,
    endDate : this.endDate,
    monthlyIncome : this.monthlyIncome,
    annualIncome : this.annualIncome,
    jobDetails : this.jobDetails,
    traductions : [
      {
        key : "S_C_CURJOB",
        value : this.currentJobEng
      },
      {
        key : "S_C_STARTDT",
        value : this.startDateEng
      },
      {
        key : "S_C_ENDDT",
        value : this.endDateEng
      },
      {
        key : "S_C_INCOME",
        value : this.annualIncomeEng
      },
      {
        key : "L_C_DETAILS",
        value : this.jobDetailsEng
      },
    ]
   }
  }
  quitarSeleccion(){
    this.idCompany = 0
    this.name = ""
    this.address = ""
    this.taxTypeCode = ""
    this.taxTypeName = ""
    this.subTelephone = ""
    this.telephone = ""
  }
  relacionarEmpresa(){
    const dialogRef = this.dialog.open(ListaEmpresasComponent, {
      data : {
        idCompany : this.idCompany
      }
    });
    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        console.log(data)
        this.idCompany = data.idCompany
        if(this.idCompany !== null && this.idCompany !== 0){
          this.empresaService.getDatosEmpresaPorId(this.idCompany).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                const empresa = response.data
                if(empresa){
                  this.name = empresa.name
                  this.address = empresa.address
                  this.taxTypeCode = empresa.taxTypeCode
                  this.taxTypeName = empresa.taxTypeName
                  this.subTelephone = empresa.subTelephone
                  this.telephone = empresa.telephone
                }
              }
            }
          )
        }
      }
    });
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
          const loader = document.getElementById('pagina-detalle-persona') as HTMLElement | null;
          if(loader){
            loader.classList.remove('hide-loader');
          }
          this.trabajoService.addTrabajo(this.modeloModificado[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                const tabTrabajo = document.getElementById('tab-trabajo') as HTMLElement | null;
                if (tabTrabajo) {
                  tabTrabajo.classList.add('tab-con-datos')
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
              if(loader){
                loader.classList.add('hide-loader');
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
          const loader = document.getElementById('pagina-detalle-persona') as HTMLElement | null;
          if(loader){
            loader.classList.remove('hide-loader');
          }
          this.trabajoService.addTrabajo(this.modeloModificado[0]).subscribe(
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
              if(loader){
                loader.classList.add('hide-loader');
              }
            }
          )
        }
      });
    }
  }


}
