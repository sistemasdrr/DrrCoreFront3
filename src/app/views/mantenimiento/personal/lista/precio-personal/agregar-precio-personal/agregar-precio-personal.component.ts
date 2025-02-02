import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BillingPersonal, PersonalService } from 'app/services/mantenimiento/personal.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-agregar-precio-personal',
    templateUrl: './agregar-precio-personal.component.html',
    styleUrls: ['./agregar-precio-personal.component.scss'],
    standalone: false
})
export class AgregarPrecioPersonalComponent  implements OnInit{

  id = 0
  idEmployee = 0
  code = ""
  commission = false
  directTranslate = false
  reportType = ""
  quality = ""
  isComplement = false
  amount = 0

  loading = false

  userCodes : string[] = []
  modelo : BillingPersonal[] = []


  constructor(public dialogRef: MatDialogRef<AgregarPrecioPersonalComponent>,
    private personalService : PersonalService,@Inject(MAT_DIALOG_DATA) public data: any){
      if(data != null){
        console.log(data)
        this.id = data.id
        this.idEmployee = data.idEmployee
        if(data.userCodes !== null){
          this.userCodes = data.userCodes
          if(data.code !== null){
            this.code = data.code
          }
        }
      }
  }
  ngOnInit(): void {
    if(this.id > 0){
      this.personalService.GetBillingPersonalById(this.id).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            console.log(response.data)
            this.idEmployee = response.data.idEmployee
            this.code = response.data.code
            this.commission = response.data.commission
            this.reportType = response.data.reportType
            this.quality = response.data.quality
            this.isComplement = response.data.isComplement
            this.amount = response.data.amount
            this.directTranslate = response.data.directTranslate
          }
        }
      )
    }
  }
  armarModelo(){
    this.modelo[0] = {
      id : this.id,
      idEmployee : this.idEmployee,
      code : this.code,
      commission : this.commission,
      reportType : this.reportType,
      quality : this.quality,
      isComplement : this.isComplement,
      amount : this.amount,
      directTranslate:this.directTranslate
 
    }
  }
  guardar(){
    this.armarModelo()
    console.log(this.modelo[0])
    let title = ""
    if(this.id === 0){
      title = '¿Está seguro de agregar el registro?'
    }else{
      title = '¿Está seguro de editar el registro?'
    }
    Swal.fire({
      title: title,
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
        this.loading = true
        this.personalService.AddOrUpdateBillingPersonal(this.modelo[0]).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.loading = false
              Swal.fire({
                title: 'Se guardo el registro correctamente',
                text: "",
                icon: 'success',
                width: '20rem',
                heightAuto: true
              }).then(
                () => {
                  this.dialogRef.close()
                }
              )
            }else{
              this.loading = false
              Swal.fire({
                title: 'Ocurrio un problema al guardar el registro. Contactarse con Sistemas.',
                text: "",
                icon: 'error',
                width: '20rem',
                heightAuto: true
              }).then(
                () => {
                  this.dialogRef.close()
                }
              )
            }
          }
        )

      }
    })
  }
  salir(){
    this.dialogRef.close()
  }
}
