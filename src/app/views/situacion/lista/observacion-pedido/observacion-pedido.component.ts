import { add } from '@ckeditor/ckeditor5-utils/src/translation-service';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { MatTableDataSource } from '@angular/material/table';
import { ComboData, ComboDataName } from 'app/models/combo';
import { AddTicketObservations, EmployeesAssignated, GetTicketObservations } from 'app/models/pedidos/ticket';
import { ComboService } from 'app/services/combo.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { TicketService } from 'app/services/pedidos/ticket.service';
import Swal from 'sweetalert2';
import { ConcluirObservacionComponent } from './concluir-observacion/concluir-observacion.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable, map, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface data {
  name: string;
}

@Component({
    selector: 'app-observacion-pedido',
    templateUrl: './observacion-pedido.component.html',
    styleUrls: ['./observacion-pedido.component.scss'],
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

export class ObservacionPedidoComponent implements OnInit{

  idTicket = 0
  cupon = ""
  informe = ""
  abonado = ""
  list : EmployeesAssignated[] = []

  id = 0
  about = ""
  idCompany = 0
  idPerson = 0
  idSubscriber = 0
  idReason = 0
  message = ""
  conclusion = ""
  idStatusTicketObservation = 0
  cc = ""
  observationDate = new Date()
  asignedDate = new Date()
  endDate = this.addDays(2,new Date())
  solutionDate : Date | null = null

  listReason : ComboData[] = []

  add = false;
  edit = false;
  editable = false

  emails : ComboDataName[] = []
  emailsSeleccionados : ComboDataName[] = []
  separatorKeysCodes: number[] = [ENTER, COMMA];

  controlEmails = new FormControl<string | ComboDataName>('')

  remove(name: string): void {
    const deleteData = this.emailsSeleccionados.filter(x => x.name === name)
    if (deleteData.length > 0) {
      this.emailsSeleccionados = this.emailsSeleccionados.filter(x => x.name !== name)
    }
  }
  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    event.chipInput!.clear();
    this.controlEmails.setValue(null);
  }
  private _filterCombo(name: string): ComboDataName[] {
    const filterValue = name.toLowerCase();
    return this.emails.filter(x => x.name.toLowerCase().includes(filterValue));
  }
  displayCombo(data : ComboDataName): string {
    return data && data.valor ? data.valor : '';
  }
  selectedEmail(event: MatAutocompleteSelectedEvent): void {
    console.log(event.option.value)
    console.log(this.emailsSeleccionados)
    const email = this.emailsSeleccionados.filter(x => x.valor === event.option.value.valor)[0]
    if(email){
      Swal.fire({
        title: 'No se puede repetir el mismo correo',
        text: "",
        icon: 'info',
        width: '20rem',
        heightAuto : true
      })
    }else{
      this.emailsSeleccionados.push(event.option.value)

    }
    this.controlEmails.setValue(null);
  }
  dataSource = new MatTableDataSource<GetTicketObservations>()
  columnsToDisplay = ['id','asignedDate','endDate','solutionDate','acciones']

  modelo : AddTicketObservations[] = []

  @ViewChild('personalList') personalList!: MatSelectionList;

  filteredCombo : Observable<ComboDataName[]>
  constructor(public dialog : MatDialog,public dialogRef: MatDialogRef<ObservacionPedidoComponent>, private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,private ticketService : TicketService,
    private comboService : ComboService, private abonadoService : AbonadoService){
      if(data){
        this.idTicket = parseInt(data.idTicket)
        console.log(this.idTicket)
      }
      this.filteredCombo = new Observable<ComboDataName[]>()

  }
  ngOnInit(): void {
    this.ticketService.GetEmployeesAssignated(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.list = response.data
        }
      }
    )
    this.comboService.getUserEmail().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.emails = response.data
        }
      }
    )
    this.ticketService.GetTicketObservations(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSource.data = response.data
        }
      }
    )
    this.ticketService.getById(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.cupon = response.data.number.toString().padStart(6, '0')
          this.informe = response.data.busineesName
          this.about = response.data.about
          this.idSubscriber = response.data.idSubscriber
          this.idCompany = response.data.idCompany
          this.idPerson = response.data.idPerson
        }
      }
    ).add(
      () => {
        this.abonadoService.getAbonadoPorId(this.idSubscriber).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.abonado = response.data.code
            }
          }
        )
      }
    )
    this.comboService.getReason().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.listReason = response.data
        }
      }
    )
    this.filteredCombo = this.controlEmails.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name
        return name ? this._filterCombo(name as string) : this.emails.slice()
      }),
    )
  }
  formatearFecha(date : Date | null) {
    if(date !== null && date !== undefined){
      return this.datePipe.transform(date, 'dd/MM/yyyy')!;
    }else{
      return ''
    }
  }
  seleccionarObservacion(obj : GetTicketObservations, finished : number){
    if(finished === 2 || finished === 3){
      this.editable = false
    }else{
      this.editable = true
    }
    this.emailsSeleccionados = []
    this.personalList.deselectAll()
    this.id = obj.id
    this.message = obj.message
    this.conclusion = obj.conclusion
    this.idStatusTicketObservation = obj.idStatusTicketObservation
    this.idReason = obj.idReason
    this.cc = obj.cc
    console.log(this.cc)
    if(this.cc !== null && this.cc !== ''){
      const list = this.cc.split(";")
      if(list.length > 0){
        list.forEach(email => {
          const em = this.emails.filter(x => x.valor === email)[0]
          if(em !== null && em !== undefined){
            this.emailsSeleccionados.push(em)
          }
        });
      }
    }

    this.observationDate = obj.observationDate
    this.asignedDate = obj.asignedDate
    this.endDate = obj.endDate
    this.solutionDate = obj.solutionDate
    obj.employeesObservated.forEach(element => {
      const optionToSelect = this.personalList.options.find(option => option.value.code === element.code);
      if (optionToSelect) {
        optionToSelect.selected = true;
      }
     });
     this.edit = true
     this.add = false
  }
  eliminarObservacion(id : number){

  }
  agregar(){
    this.emailsSeleccionados = []
    this.id = 0
    this.idReason = 0
    this.message = ""
    this.conclusion = ""
    this.cc = ""
    this.add = true
    this.edit = false
    this.personalList.deselectAll()
    console.log(this.personalList.selectedOptions.selected.map(option => option.value))
  }
  armarModelo(){
    let cc = ""
    for(let x = 0; x < this.emailsSeleccionados.length; x++){
      if(x === this.emailsSeleccionados.length-1){
        cc += this.emailsSeleccionados[x].valor
      }else{
        cc += this.emailsSeleccionados[x].valor + ";"
      }
    }
    console.log(cc)
    this.modelo[0] = {
      id : this.id,
      idTicket : this.idTicket,
      about : this.about,
      idCompany : this.idCompany,
      idPerson : this.idPerson,
      idSubscriber : this.idSubscriber,
      idReason : this.idReason,
      message : this.message,
      conclusion : this.conclusion,
      idStatusTicketObservation : this.idStatusTicketObservation,
      cc : cc,
      observationDate : this.observationDate,
      asignedDate : this.asignedDate,
      endDate : this.endDate,
      solutionDate : this.solutionDate,
      employeesObservated : this.personalList.selectedOptions.selected.map(option => option.value)
    }
    console.log(this.modelo)
  }
  agregarObservacion(){
    this.armarModelo();
    console.log(this.personalList.selectedOptions.selected.length)
    if(this.personalList.selectedOptions.selected.length === 0){
      Swal.fire({
        title: 'Seleccione 1 Personal como minimo',
        text: "",
        icon: 'info',
        width: '30rem',
        heightAuto : true
      })
    }else{
      if(this.id === 0){
        Swal.fire({
          title: '¿Está seguro de agregar este registro?',
          text: "",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText : 'No',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí',
          width: '30rem',
          heightAuto : true
        }).then((result) => {
          if (result.value) {
            this.ticketService.AddTicketObservations(this.modelo[0]).subscribe(
              (response) => {
                if(response.isSuccess === true && response.isWarning === false){
                  Swal.fire({
                    title: 'Se agregó el registro correctamente',
                    text: "",
                    icon: 'success',

                    width: '30rem',
                    heightAuto : true
                  }).then(
                    () => {
                      this.ticketService.GetTicketObservations(this.idTicket).subscribe(
                        (response) => {
                          if(response.isSuccess === true && response.isWarning === false){
                            this.dataSource.data = response.data
                          }
                        }
                      )
                    }
                  )
                }
              }
            )
          }
        })
      }else{
        Swal.fire({
          title: '¿Está seguro de editar este registro?',
          text: "",
          icon: 'warning',
          showCancelButton: true,
          cancelButtonText : 'No',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí',
          width: '30rem',
          heightAuto : true
        }).then((result) => {
          if (result.value) {
            this.ticketService.AddTicketObservations(this.modelo[0]).subscribe(
              (response) => {
                if(response.isSuccess === true && response.isWarning === false){
                  Swal.fire({
                    title: 'Se editó el registro correctamente',
                    text: "",
                    icon: 'success',

                    width: '30rem',
                    heightAuto : true
                  }).then(
                    () => {
                      this.ticketService.GetTicketObservations(this.idTicket).subscribe(
                        (response) => {
                          if(response.isSuccess === true && response.isWarning === false){
                            this.dataSource.data = response.data
                          }
                        }
                      )
                    }
                  )
                }
              }
            )
          }
        })
      }
    }


  }
  concluirObservacion(id : number){
    const dialogRef = this.dialog.open(ConcluirObservacionComponent, {
      data : {
          idTicketObservation : id
      },
    });
    dialogRef.beforeClosed().subscribe(() => {
      this.ticketService.GetTicketObservations(this.idTicket).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSource.data = response.data
          }
        }
      )
    })
  }
  enviarObservacion(){

  }
  salir(){
    this.dialogRef.close()
  }
  addDays(noOfDaysToAdd:number,orderDate:Date){
    let endDate : Date=new Date, count = 0;
    while(count < noOfDaysToAdd){
        endDate = new Date(orderDate.setDate(orderDate.getDate() + 1));
        if(endDate.getDay() != 0 && endDate.getDay() != 6){
           count++;
        }
    }
    return endDate;
  }
}
