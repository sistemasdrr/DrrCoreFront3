import { BillingPersonal } from './../../../../../services/mantenimiento/personal.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PersonalService } from 'app/services/mantenimiento/personal.service';
import { UsuarioService } from 'app/services/usuario.service';
import { AgregarPrecioPersonalComponent } from './agregar-precio-personal/agregar-precio-personal.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-precio-personal',
  templateUrl: './precio-personal.component.html',
  styleUrls: ['./precio-personal.component.scss']
})
export class PrecioPersonalComponent implements OnInit{

  idEmployee = 0
  codeSelected = ""
  userCodes : string[] = []
  billingPersonal : BillingPersonal[] = []

  loading = false;

  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource<BillingPersonal>()
  columns : string[] = ['code','commission','reportType','quality','isComplement','amount','accion']

  constructor(public dialogRef: MatDialogRef<PrecioPersonalComponent>,private dialog : MatDialog,
    private personalService : PersonalService,@Inject(MAT_DIALOG_DATA) public data: any){
      if(data){
        this.idEmployee = data.id
        console.log(this.idEmployee)
      }
  }
  ngOnInit(): void {
    this.personalService.GetOtherUserCode(this.idEmployee).subscribe(
      (response) => {
        this.loading = true
        if(response.isSuccess === true && response.isWarning === false){
          this.userCodes = response.data
        }
        this.loading = false
      },
      (error) => {
        this.loading = false
      }
    )
    this.personalService.GetBillingPersonalsByIdEmployee(this.idEmployee).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.billingPersonal = response.data
        }
      }
    )
  }
  updateData(code : string){
    console.log(code)
    console.log(this.billingPersonal)
    this.dataSource.data = this.billingPersonal.filter(x => x.code.includes(code.trim()))
    this.dataSource.sort = this.sort
  }
  addBillingPersonal(code : string){
    const dialogRef = this.dialog.open(AgregarPrecioPersonalComponent, {
      data : {
        id : 0,
        idEmployee : this.idEmployee,
        code : code,
        userCodes : this.userCodes,
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.personalService.GetBillingPersonalsByIdEmployee(this.idEmployee).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.billingPersonal = response.data
            }
          }
        ).add(
          () => {
            this.updateData(this.codeSelected)
          }
        )
      }
    );
  }
  editBillingPersonal(id : number){
    const dialogRef = this.dialog.open(AgregarPrecioPersonalComponent, {
      data : {
        id : id,
        idEmployee : this.idEmployee,
        code : this.codeSelected,
        userCodes : this.userCodes
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.personalService.GetBillingPersonalsByIdEmployee(this.idEmployee).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.billingPersonal = response.data
            }
          }
        ).add(
          () => {
            this.updateData(this.codeSelected)
          }
        )
      }
    );
  }
  deleteBillingPersonal(id : number){
    Swal.fire({
      title: '¿Esta seguro de eliminar este registro?',
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
        this.personalService.DeleteBillingPersonal(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title: 'Se elimino el registro correctamente',
                text: "",
                icon: 'success',
                width: '30rem',
                heightAuto: true
              }).then(
                () => {
                  this.personalService.GetBillingPersonalsByIdEmployee(this.idEmployee).subscribe(
                    (response) => {
                      if(response.isSuccess === true && response.isWarning === false){
                        this.billingPersonal = response.data
                      }
                    }
                  ).add(
                    () => {

                      this.loading = false
                      this.updateData(this.codeSelected)
                    }
                  )
                }
              )
            }
          },(error) => {
            this.loading = false
          }
        )
      }
    })

  }
  salir(){
    this.dialogRef.close()
  }
}
