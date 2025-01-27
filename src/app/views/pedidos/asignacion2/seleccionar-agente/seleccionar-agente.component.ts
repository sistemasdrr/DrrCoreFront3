import { Component, Inject, OnInit } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Asignacion, GetTicketUserResponseDto, ListTicket2, NewAsignacion, PersonalAssignation, TicketHistoryCount } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import * as moment from 'moment';
import Swal from 'sweetalert2';



@Component({
    selector: 'app-seleccionar-agente',
    templateUrl: './seleccionar-agente.component.html',
    styleUrls: ['./seleccionar-agente.component.scss'],
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
export class SeleccionarAgenteComponent implements OnInit {
  idTicketHistory = 0
  order : ListTicket2[] = []
  activeList = 0
  estado = "agregar"
  idEditarAsignacion = 0
   procedureType = ""
  idEditarTrabajador = 0
  fechaAsignacionDate : Date | null = null
  fechaVencimientoDate : Date | null = null
  fechaAsignacionString: string=new Date().toLocaleDateString('en-GB')
  fechaVencimientoString: string=new Date().toLocaleDateString('en-GB')

  dataSource : MatTableDataSource<Asignacion>
  columnas = ['assignedTo','assignationDate','endDate','balance','references','accion']

  asignacion : Asignacion[] = []
  interno = false;
  idUserLogin = 0;
  asignado = ""
  asignadoCodigo= ""
  asignadoNombre= ""
  precio = 0
  type = ""
  idTicket = 0
  balance = false
  referencias = false
  traduccion = false
  attachmentRefCom = false

  reportType = ''
  calidad = ""
  fechaAsignacion = ""
  fechaVencimiento = ""
  observaciones = ""
  userFrom = ''
  numberAssign:number = 0
  loading=false;
  forceSupervisor=false;
  assginFromCode: any;
  quality = ""
  qualityTypist = ""
  qualityTranslator = ""
  hasBalance : boolean | null = null
  sendZip = false
  step=1

  supervisorCode = ""



  seleccionarTrabajador(codigo : string, nombre : string, idUserLogin : number, internal : boolean){
    this.step=2
    this.asignadoCodigo = codigo
    this.asignadoNombre =  nombre
    this.idUserLogin = idUserLogin
    this.asignado = codigo + ' || ' + nombre
    this.interno = internal
  }
  datos : PersonalAssignation[] = []
  datos2 : PersonalAssignation[] = []
  ticketHistory : TicketHistoryCount[] = []
  ticketValidation : GetTicketUserResponseDto[] = []

  constructor(public dialogRef: MatDialogRef<SeleccionarAgenteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private ticketService : TicketService){
      this.dataSource = new MatTableDataSource()
      console.log(data)
      this.idTicket = parseInt(data.idTicket)
      this.reportType = data.reportType
      this.order[0] = data.order
      this.numberAssign=data.numberAssign
      this.quality=data.quality
      this.qualityTypist=data.qualityTypist
      this.qualityTranslator=data.qualityTranslator
      console.log(this.procedureType)
      this.procedureType=data.procedureType
      this.hasBalance=data.hasBalance
      this.assginFromCode=data.assginFromCode
      this.referencias = this.reportType.trim() === "RV" ? true : false
      this.fechaAsignacionDate=new Date()
      this.fechaVencimientoDate=new Date()
      const auth = JSON.parse(localStorage.getItem('authCache')+'')
      this.userFrom = auth.idUser

      console.log(this.order[0])
      this.idTicketHistory = this.order[0].id
      console.log(this.order[0].asignedTo)
      console.log(this.order[0].idTicket)
      console.log(this.order[0].otherUserCode)
  }

  ngOnInit(): void {
    this.ticketService.GetSupervisorCodeTicket(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.supervisorCode = response.data
          console.log(this.supervisorCode)
        }
      }
    )
    this.ticketService.GetTicketAssignedValidation(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.ticketValidation = response.data
         
        }
      }
    )
    this.step=1;
    this.ticketService.getPersonalAssignation().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.datos = response.data
        }
      }
    ).add(
      () => {
        this.ticketService.getAgentAssignation().subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              response.data.forEach(element => {
                this.datos.push(element)
              });
            }
          }).add(
            () => {
              this.ticketService.getTicketHistoryCount().subscribe(
                (response) => {
                  if(response.isSuccess === true && response.isWarning === false){
                    this.ticketHistory = response.data
                  }
                }
              ).add(
                () => {

                  console.log(this.datos.filter(x => x.type === 'AG'))
                  console.log(this.ticketHistory)
                }
              )
            }
          )
      }
    )
    console.log(this.idTicket)
  }
  numAsig = 0
  enviarDespachar(){
    console.log(this.quality)
    console.log(this.qualityTranslator)
    console.log(this.qualityTypist)
    console.log(this.supervisorCode)
    const supervisor = this.order[0].otherUserCode.filter(x => x.code.includes("S") && x.active === true)[0]
    console.log(supervisor)
    if(this.supervisorCode === "" && supervisor === null){
      Swal.fire({
        title: 'El Cupon no cuenta con un supervisor asignado.',
        text: "",
        icon: 'error',
        width: '20rem',
        heightAuto : true
      })
    }else if(this.quality.trim() === "" || this.qualityTranslator.trim() === "" || this.qualityTypist.trim() === ""){
      Swal.fire({
        title: 'El Cupón no cuenta con todas las calidades asignadas.',
        text: "",
        icon: 'error',
        width: '20rem',
        heightAuto : true
      })
    }else{
      Swal.fire({
        title: '¿Está seguro de enviar a despachar?',
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
          this.loading=true;
          this.ticketService.TicketToDispatch(this.idTicketHistory, this.idTicket,this.quality,this.qualityTranslator,this.qualityTypist, this.order[0].otherUserCode).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title: 'El ticket se envio a despacho',
                  text: "",
                  icon: 'success',
                  width: '20rem',
                  heightAuto : true
                }).then(() => {
                  this.dialogRef.close()
                  this.loading=false;
                })

              }else{
                Swal.fire({
                  title: 'Ocurrio un error, comunicarse con Sistemas',
                  text: "",
                  icon: 'error',
                  width: '20rem',
                  heightAuto : true
                }).then(() => {
                  this.dialogRef.close()
                  this.loading=false;
                })

              }
            }

          )
        }
      })
    }

  }
  filtrarDatos(tipo : string){
    if(tipo === "PA"){
      this.numAsig = this.ticketHistory.filter(x => x.asignedTo.includes('PA') === true).length;
    }else if(tipo === 'RP'){
      this.numAsig = this.ticketHistory.filter(x => x.asignedTo.includes('RC') === false && x.asignedTo.includes('CR') === false && x.asignedTo.includes('R') === true).length;
    }else if(tipo === 'AG'){
      this.numAsig = this.ticketHistory.filter(x => x.asignedTo.includes('P') === false && x.asignedTo.includes('A') === true).length;
    }else if(tipo === 'RF'){
      this.numAsig = this.ticketHistory.filter(x => x.asignedTo.includes('RC') === true).length;
    }else if(tipo === 'DI'){
      this.numAsig = this.ticketHistory.filter(x => x.asignedTo.includes('D') === true).length;
    }else if(tipo === 'TR'){
      this.numAsig = this.ticketHistory.filter(x => x.asignedTo.includes('T') === true).length;
    }else if(tipo === 'SU'){
      this.numAsig = this.ticketHistory.filter(x => x.asignedTo.includes('S') === true).length;
    }
    console.log(this.numAsig)
    if(this.numAsig === 0){
      this.datos.forEach(element => {
        element.porcentaje = 0;
      })
    }else{
      this.datos.forEach(element => {
        const num =  (this.ticketHistory.filter(x => x.asignedTo.trim() === element.code.trim()).length)
        element.porcentaje = num;
      })
    }

    if (tipo === "DI" || tipo === "TR") {
      this.datos2 = []
      // Encuentra el elemento especial crodriguez, si existe
      if(this.userFrom === '42'){
        const crodriguez = this.datos.find(x =>
          x.type === tipo && (x.code.includes("D15") || x.code.includes("T14"))
        );
        this.datos2 = this.datos.filter(x => x.type === tipo && x !== crodriguez);
      }else{
        const crodriguez = this.datos.find(x =>
          x.type === tipo && (x.code.includes("D15") || x.code.includes("T14"))
        );
        if (crodriguez) {
          this.datos2.unshift(crodriguez);
        }
      }


      // Ordena primero por porcentaje de forma descendente y luego por código de forma ascendente
      this.datos2.sort((a, b) => {
          // Orden descendente para porcentaje
          if (a.porcentaje > b.porcentaje) return -1;
          if (a.porcentaje < b.porcentaje) return 1;

          // Si los porcentajes son iguales, ordena por código ascendente
          if (a.code < b.code) return -1;
          if (a.code > b.code) return 1;
          return 0;
      });

      // Si crodriguez existe, agrega al inicio de la lista ordenada

  } else {
      // Caso para otros tipos que no son 'DI' o 'TR'
      this.datos2 = this.datos.filter(x => x.type === tipo);

      // Ordena por porcentaje descendente y luego por código ascendente si los porcentajes son iguales
      this.datos2.sort((a, b) => {
          if (a.porcentaje > b.porcentaje) return -1;
          if (a.porcentaje < b.porcentaje) return 1;

          // Orden por código si el porcentaje es igual
          if (a.code < b.code) return -1;
          if (a.code > b.code) return 1;
          return 0;
      });
    }
    this.asignado = ""
  }

  addAsignacion() {
    let code = '';
    let tipo = '';

    if (!this.ticketValidation || !Array.isArray(this.ticketValidation)) {
        console.error('ticketValidation no está definido o no es un array.');
        return;
    }
    console.log(this.type)

    let filtered = this.ticketValidation.filter(x => x.type.includes(this.type));
    if (filtered.length > 0) {
        code = filtered[0].code;

        switch (this.type) {
            case "RP": tipo = 'Reportero'; break;
            case "RF": tipo = 'Referencista'; break;
            case "DI": tipo = 'Digitador'; break;
            case "TR": tipo = 'Traductor'; break;
            case "AG": tipo = 'Agente'; break;
        }

        Swal.fire({
            text: "El Cupón ya se asignó al " + tipo + ' ' + code + ' anteriormente, ¿Desea derivarlo a un nuevo ' + tipo + '?',
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: 'No',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            width: '20rem',
            heightAuto: true
        }).then((result) => {
            if (result.value) {
                this.agregarAsignacion(code, tipo);
            }
        });
    } else {
        tipo = this.asignarTipoPorCodigo(this.type);
        this.agregarAsignacion(code, tipo);
    }
}

private asignarTipoPorCodigo(type: string): string {
    switch (type) {
        case "RP": return 'Reportero';
        case "RF": return 'Referencista';
        case "DI": return 'Digitador';
        case "TR": return 'Traductor';
        case "AG": return 'Agente';
        default: return 'Desconocido';
    }
}

private agregarAsignacion(code: string, tipo: string) {
    const asign: Asignacion = {
        userFrom: this.userFrom,
        userTo: this.idUserLogin + "",
        assignedToCode: this.asignadoCodigo,
        assignedToName: this.asignadoNombre,
        startDateD: this.fechaAsignacionDate,
        endDateD: this.fechaVencimientoDate,
        references: this.referencias,
        observations: this.observaciones,
        type: this.type,
        internal: this.interno,
        balance: this.balance,
        startDate: this.fechaAsignacionString,
        endDate: this.fechaVencimientoString,
        idTicket: this.idTicket,
        numberAssign: this.numberAssign,
        assignedFromCode: this.assginFromCode,
        quality: this.quality !== '' ? this.quality : null,
        qualityTypist: this.qualityTypist !== '' ? this.qualityTypist : null,
        qualityTranslator: this.qualityTranslator !== '' ? this.qualityTranslator : null,
        hasBalance: this.hasBalance,
        sendZip: this.sendZip,
        forceSupervisor: this.forceSupervisor,
        attachmentRefCom : this.attachmentRefCom,
        procedureTypeAgent:this.procedureType,
    };

    this.asignacion.push(asign);
    this.dataSource.data = this.asignacion;

    this.idUserLogin = 0;
    this.asignado = "";
    this.fechaAsignacion = "";
    this.fechaVencimiento = "";
    this.fechaAsignacionDate = new Date();
    this.fechaVencimientoDate = new Date();
    this.balance = false;
    this.referencias = false;
    this.observaciones = "";
    this.activeList = 0;
    this.interno = false;
    this.step = 3;
    this.estado = 'agregar';
}



  editarAsignacion(){

  }

  eliminarAsignacion(obj : Asignacion){
    const index = this.dataSource.data.findIndex(item => item === obj);
    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource.data = [...this.dataSource.data];
    }
    this.step=1
    console.log(this.dataSource.data)
  }

  cerrarDialog(){
    this.dialogRef.close()
  }

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }

  selectFechaAsignacion(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value!;
    if (moment.isMoment(selectedDate)) {
      this.fechaAsignacionString = this.formatDate(selectedDate);
    }
  }
  selectFechaVencimiento(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value!;
    if (moment.isMoment(selectedDate)) {
      this.fechaVencimientoString = this.formatDate(selectedDate);
    }
  }
  limpiar(){
    this.estado = 'agregar'
    this.asignado = ''
    this.precio = 0
    this.calidad = ''
    this.fechaAsignacion = ''
    this.fechaAsignacionDate = new Date()
    this.fechaVencimiento = ''
    this.fechaVencimientoDate = new Date()
    this.observaciones = ''
    this.datos = []
    this.activeList = 0
  }
  guardarCambios(){
    let assignSelf = false
    this.order[0].otherUserCode.forEach(element => {
      if(this.order[0].asignedTo.trim() !== element.code.trim() && element.active === true){
        console.log('asignar a: ' + element.code)
        assignSelf = true
      }
    });
    if(assignSelf){

    }
    const newAsignacion : NewAsignacion = {
      idTicketHistory : this.order[0].id,
      asignedTo : this.order[0].asignedTo,
      asignacion : this.asignacion,
      otherUserCode : this.order[0].otherUserCode
    }
    console.log(newAsignacion)
    Swal.fire({
      title: '¿Está seguro agregar las asignaciones?',
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
        this.loading=true;
        this.ticketService.sendAssignation(newAsignacion).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.dialogRef.close()
              this.loading=false;
            }
          }
        )
      }
    })

  }
}
