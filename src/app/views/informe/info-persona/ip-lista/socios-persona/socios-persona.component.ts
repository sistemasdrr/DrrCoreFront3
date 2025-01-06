import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SociosPersonaT } from 'app/models/informes/empresa/socios-empresa';
import { SocioPersonaService } from 'app/services/informes/persona/socio-persona.service';
import { AgregarSocioComponent } from 'app/views/informe/info-empresa/ie-lista/socios-empresa/agregar-socio/agregar-socio.component';
import { AgregarSocioPersonaComponent } from './agregar-socio/agregar-socio.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-socios-persona',
    templateUrl: './socios-persona.component.html',
    styleUrls: ['./socios-persona.component.scss'],
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
export class SociosPersonaComponent implements OnInit{
  idPerson = 0

  dataSourcePartners : MatTableDataSource<SociosPersonaT>
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  columnasPartners : string[] = ['numeration','name','country','taxTypeName','situation','mainExecutive','print','profession','constitutionDate','acciones']
  constructor(private dialog : MatDialog,private sociosPersonaService : SocioPersonaService,@Inject(MAT_DIALOG_DATA) public data: any){
    this.dataSourcePartners = new MatTableDataSource()
    if(data){
      this.idPerson = data.idPerson
    }
    console.log(this.idPerson)
  }
  ngOnInit(): void {
    this.sociosPersonaService.getListPersonPartner(this.idPerson).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSourcePartners.data = response.data
          this.dataSourcePartners.sort = this.sort
        }
      }
    )
  }

  agregarSociosPersona(){
    const dialogRef = this.dialog.open(AgregarSocioPersonaComponent, {
      data: {
        id : 0,
        idPerson : this.idPerson
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.sociosPersonaService.getListPersonPartner(this.idPerson).subscribe(
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
  editarSociosPersona(id : number){
    const dialogRef = this.dialog.open(AgregarSocioPersonaComponent, {
      data: {
        id : id,
        idPerson : this.idPerson
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.sociosPersonaService.getListPersonPartner(this.idPerson).subscribe(
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
  eliminarSociosPersona(id : number){
    Swal.fire({
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
        this.sociosPersonaService.deletePersonPartner(id).subscribe(
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
                }
              )
            }
          }
        )
      }
    })
  }
}
