import { CalendarioService } from './../../../../services/calendario.service';
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddCalendar } from 'app/models/usuario';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-detalle-calendario',
  templateUrl: './detalle-calendario.component.html',
  styleUrls: ['./detalle-calendario.component.scss'],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es-PE'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},

  ]
})
export class DetalleCalendarioComponent implements OnInit {

  calendarForm: UntypedFormGroup;

  id = 0
  title = ""
  groupId = "FI"
  startDate : Date | null = null
  endDate : Date | null = null
  details = ""
  className = "fc-event-primary"
  action = ""
  blockChanges = false

  model : AddCalendar[] = []

  constructor(private fb: UntypedFormBuilder,public dialogRef: MatDialogRef<DetalleCalendarioComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private calendarioService : CalendarioService){
    if(data && data.action === "edit"){
      this.id = data.id
      this.title = data.title
      this.groupId = data.groupId
      this.startDate = data.startDate
      this.endDate = data.endDate
      this.details = data.details
      this.className = data.className
      this.action = data.action
      this.blockChanges = true
      console.log(this.id)
      console.log(data)
      console.log(this.title)
      console.log(this.groupId)
      console.log(this.startDate)
      console.log(this.endDate)
      console.log(this.details)
      console.log(this.className)
    }else{
      this.startDate = data.startDate
      this.endDate = data.endDate
    }

    this.calendarForm = this.createContactForm();
  }
  formControl = new UntypedFormControl('', [
    Validators.required,
    // Validators.email,
  ]);
  createContactForm(): UntypedFormGroup {
    return this.fb.group({
      id: [this.id],
      title: [this.title, [Validators.required]],
      groupId: [this.groupId],
      startDate: [this.startDate, ],
      endDate: [this.endDate, ],
      details: [this.details],
      className: [this.className],
    });
  }
  ngOnInit(): void {

  }
  salir(){
    this.dialogRef.close()
  }
  guardar(){

    let startDate = new Date(this.calendarForm.value.startDate);
      if(startDate.getHours() > 5){
        startDate.setHours(startDate.getHours() - 5);
      }else{
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours((startDate.getHours()+24) - 5);
      }
      let adjustedStartDate = startDate.toISOString();
    let endDate = new Date(this.calendarForm.value.endDate);
      if(endDate.getHours() > 5){
        endDate.setHours(endDate.getHours() - 5);
      }else{
        endDate.setDate(endDate.getDate() - 1);
        endDate.setHours((endDate.getHours()+24) - 5);
      }
      let adjustedEndDate = endDate.toISOString();

      this.model[0] = {
        id : this.id.toString(),
        title : this.calendarForm.value.title,
        groupId : this.groupId,
        className : this.calendarForm.value.className,
        startDate : adjustedStartDate,
        endDate : adjustedEndDate,
        details : this.calendarForm.value.details
      }
    console.log(this.model[0])
    if(this.id > 0){
      Swal.fire({
        title: '¿Está seguro de modificar esta fecha?',
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
          this.calendarioService.AddOrUpdateCalendar(this.model[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title :'Se modifico el registro correctamente.',
                  icon : 'success',
                  width: '20rem',
                  heightAuto : true
                }).then(
                  () => {
                    this.dialogRef.close()
                  }
                );
              }
            }
          )

        }
      })
    }else{
      Swal.fire({
        title: '¿Está seguro de agregar esta fecha?',
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
          this.calendarioService.AddOrUpdateCalendar(this.model[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title :'Se agrego el registro correctamente.',
                  icon : 'success',
                  width: '20rem',
                  heightAuto : true
                }).then(
                  () => {
                    this.dialogRef.close()
                  }
                );
              }
            }
          )

        }
      })
    }

    console.log(this.calendarForm.value.id)
    console.log(this.calendarForm.value.title)
    console.log(this.calendarForm.value.groupId)
    console.log(this.calendarForm.value.startDate)
    console.log(this.calendarForm.value.endDate)
    console.log(this.calendarForm.value.details)
    console.log(this.calendarForm.value.className)
  }
}
