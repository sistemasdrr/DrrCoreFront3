import { SociosEmpresaService } from './../../../../../services/informes/empresa/socios-empresa.service';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ComboData } from 'app/models/combo';
import { AccionistasEmpresaT, SociosEmpresaT } from 'app/models/informes/empresa/socios-empresa';
import { AgregarSocioComponent } from './agregar-socio/agregar-socio.component';
import { AgregarAccionistaComponent } from './agregar-accionista/agregar-accionista.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-socios-empresa',
    templateUrl: './socios-empresa.component.html',
    styleUrls: ['./socios-empresa.component.scss'],
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
export class SociosEmpresaComponent implements OnInit{

  loading = false;
  idCompany = 0

  dataSourcePartners : MatTableDataSource<SociosEmpresaT>
  dataSourceShareHolder : MatTableDataSource<AccionistasEmpresaT>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnasPartners : string[] = ['numeration','name','nationality','birthDate','identificationDocument','mainExecutive','print','profession','participation','startDate','acciones']
  columnasShareHolder : string[] = ['name','country','taxTypeCode','relation','participation','startDate','acciones']

  constructor(private dialog : MatDialog,private sociosEmpresaService : SociosEmpresaService,@Inject(MAT_DIALOG_DATA) public data: any){
    this.dataSourcePartners = new MatTableDataSource()
    this.dataSourceShareHolder = new MatTableDataSource()
    if(data){
      this.idCompany = data.idCompany
    }
  }
  ngOnInit(): void {
    this.loading = true
    this.sociosEmpresaService.getListCompanyPartner(this.idCompany).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSourcePartners.data = response.data
          this.dataSourcePartners.sort = this.sort
        }
      },(error) => {
        console.log(error)
      }
    ).add(
      () => {
        this.loading = false
      }
    )
    this.sociosEmpresaService.getListCompanyShareHolder(this.idCompany).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSourceShareHolder.data = response.data
          this.dataSourceShareHolder.sort = this.sort
        }
      },(error) => {
        console.log(error)
      }
    )
  }
  agregarSociosEmpresa(){
    const dialogRef = this.dialog.open(AgregarSocioComponent, {
      data: {
        id : 0,
        idCompany : this.idCompany
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.sociosEmpresaService.getListCompanyPartner(this.idCompany).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.dataSourcePartners.data = response.data
              this.dataSourcePartners.sort = this.sort
            }
          },(error) => {
            console.log(error)
          }
        )
      }
    )
  }
  editarSociosEmpresa(id : number){
    const dialogRef = this.dialog.open(AgregarSocioComponent, {
      data: {
        id : id,
        idCompany : this.idCompany
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.sociosEmpresaService.getListCompanyPartner(this.idCompany).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.dataSourcePartners.data = response.data
              this.dataSourcePartners.sort = this.sort
            }
          },(error) => {
            console.log(error)
          }
        )
      }
    )
  }
  eliminarSociosEmpresa(id : number){
    Swal .fire({
      title: '¿Está seguro de eliminar a este socio?',
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
        this.sociosEmpresaService.deleteCompanyPartner(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal .fire({
                title: 'Se elimino correctamente el socio',
                text: "",
                icon: 'success',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.dataSourcePartners.data = this.dataSourcePartners.data.filter(x => x.id !== id)
                  this.dataSourcePartners.sort = this.sort
                }
              )
            }
          }
        )
      }
    })
  }
  agregarAccionistasEmpresa(){
    console.log(this.idCompany)
    const dialogRef = this.dialog.open(AgregarAccionistaComponent, {
      data: {
        id : 0,
        idCompany : this.idCompany
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.sociosEmpresaService.getListCompanyShareHolder(this.idCompany).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.dataSourceShareHolder.data = response.data
              this.dataSourceShareHolder.sort = this.sort
            }
          },(error) => {
            console.log(error)
          }
        )
      }
    )
  }
  editarAccionistasEmpresa(id : number){
    const dialogRef = this.dialog.open(AgregarAccionistaComponent, {
      data: {
        id : id,
        idCompany : this.idCompany
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.sociosEmpresaService.getListCompanyShareHolder(this.idCompany).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.dataSourceShareHolder.data = response.data
              this.dataSourceShareHolder.sort = this.sort
            }
          },(error) => {
            console.log(error)
          }
        )
      }
    )
  }
  eliminarAccionistasEmpresa(id : number){
    Swal .fire({
      title: '¿Está seguro de eliminar a este accionista?',
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
        this.sociosEmpresaService.deleteCompanyShareHolder(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal .fire({
                title: 'Se elimino correctamente al accionista',
                text: "",
                icon: 'success',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.dataSourceShareHolder.data = this.dataSourceShareHolder.data.filter(x => x.id !== id)
                  this.dataSourceShareHolder.sort = this.sort
                }
              )
            }
          }
        )
      }
    })
  }
  salir(){
    this.dialog.closeAll()
  }
}
