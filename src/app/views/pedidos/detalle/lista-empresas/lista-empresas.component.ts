import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TCompany } from 'app/models/informes/empresa/datos-empresa';
import { Pais } from 'app/models/combo';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';
import { PaisService } from 'app/services/pais.service';
import { Observable, map, startWith } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-lista-empresas',
    templateUrl: './lista-empresas.component.html',
    styleUrls: ['./lista-empresas.component.scss'],
    standalone: false
})
export class ListaEmpresasComponent implements OnInit {

  idCompanyRelacion = 0

  loading : boolean = false
  controlPaises = new FormControl<string | Pais>('')
  paises: Pais[] = []
  filterPais: Observable<Pais[]>
  iconoSeleccionado = ""
  paisSeleccionado: Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',

  }
  filterBy='N'
  msgPais = ""
  colorMsgPais = ""
  //FILTROS
  razonSocial = ""
  filtroRB = "C"
  idPais = 0
  chkConInforme = false


  dataSource: MatTableDataSource<TCompany>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  columnsToDisplay = ['idioma', 'rucInit', 'razonSocial', 'telefono','pais','acciones' ];
  columnsToDisplaySimilar = ['idioma', 'razonSocial', 'telefono', 'descargado', 'pais','acciones' ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private datosEmpresaService : DatosEmpresaService,private router : Router, private paisService : PaisService,public dialogRef: MatDialogRef<ListaEmpresasComponent>,){
    this.dataSource = new MatTableDataSource()
    this.filterPais = new Observable<Pais[]>()
    this.loading = true
    if(data){
      this.idCompanyRelacion = data.idCompany
    }
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource()

    this.paisService.getPaises().subscribe((response) => {
      if (response.isSuccess == true) {
        this.paises = response.data;
      }
    }).add(() => {
      // if(localStorage.getItem('busquedaEmpresas')){
      //   const busqueda = JSON.parse(localStorage.getItem('busquedaEmpresas')+'')
      //   this.razonSocial = busqueda.razonSocial
      //   this.filtroRB = busqueda.filtro
      //   if(busqueda.idCountry > 0){
      //     this.idPais = busqueda.idCountry
      //     this.paisSeleccionado = this.paises.filter(x => x.id === busqueda.idCountry)[0]
      //     this.iconoSeleccionado = this.paisSeleccionado.bandera
      //   }else{
      //     this.limpiarSeleccionPais()
      //   }
      //   this.paisSeleccionado = this.paises.filter(x => x.id === busqueda.idPais)[0]
      //   this.chkConInforme = busqueda.conInforme
      //   this.filtrarEmpresas()
      // }
    })

    this.filterPais = this.controlPaises.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.valor
        return name ? this._filterPais(name as string) : this.paises.slice()
      }),
    )
    this.loading = false
  }
  private _filterPais(description: string): Pais[] {
    const filterValue = description.toLowerCase();
    return this.paises.filter(pais => pais.valor.toLowerCase().includes(filterValue));
  }
  displayPais(pais: Pais): string {
    return pais && pais.valor ? pais.valor : '';
  }
  limpiarSeleccionPais() {
    this.controlPaises.reset();
    this.idPais = 0
    this.iconoSeleccionado = ""
  }
  cambioPais(pais: Pais) {
    if (pais !== null && pais !== undefined) {
      this.iconoSeleccionado = pais.bandera
      this.idPais = pais.id
      console.log(this.idPais)
      if (typeof pais === 'string' || pais === null) {
        this.msgPais = "Seleccione una opción."
        this.idPais = 0
        this.colorMsgPais = "red"
      } else {
        this.msgPais = "Opción Seleccionada"
        this.colorMsgPais = "blue"
      }
    } else {
      if(this.idPais!==0){
        this.filtrarEmpresas()
       }
      this.msgPais = "Seleccione una opción."
      this.colorMsgPais = "red"
    }
  }
  filtrar(event : any){
    if(event.code == 'Enter'){
      this.filtrarEmpresas()
    }
  }
  limpiar(){
    this.razonSocial = ""
    this.filtroRB = "C"
    this.idPais = 0
    this.paisSeleccionado = {
      id: 0,
      valor: '',
      abreviation: '',
      bandera: '',
      regtrib: '',
      codCel: '',
    }
    this.chkConInforme = false

    this.filtrarEmpresas()
  }
  filtrarEmpresas(){
    const listaEmpresas = document.getElementById('loader-lista-empresas') as HTMLElement | null;
    if(listaEmpresas){
      listaEmpresas.classList.remove('hide-loader');
    }
    this.loading=true;
    this.datosEmpresaService.getDatosEmpresasQuery(encodeURI(this.razonSocial.trim()), this.filtroRB, this.idPais, this.chkConInforme,this.filterBy,'T',0).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){

          console.log(response.data)
          this.dataSource = new MatTableDataSource(response.data)
          this.dataSource.sort = this.sort
          this.dataSource.paginator = this.paginator
          this.loading=false;
        }
      },(error) => {
        this.loading=false;
        Swal.fire({
          title: 'Ocurrió un problema. Comunicarse con Sistemas.',
          text: error,
          icon: 'warning',
          confirmButtonColor: 'blue',
          confirmButtonText: 'Ok',
          width: '40rem',
          heightAuto : true
        }).then(() => {
        })
      }).add(() => {
        this.loading=false;
      })

  }
  agregarEmpresa(){
    this.router.navigate(['informes/empresa/detalle/nuevo']);
  }

  eliminarEmpresa(id : number){
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
        Swal.fire({
          title :'¡Eliminado!',
          text : 'El registro se elimino correctamente.',
          icon : 'success',
          width: '20rem',
          heightAuto : true
        });
        this.datosEmpresaService.deleteDatosEmpresa(id).subscribe(
          (response) => {
            console.log(response)
          }
        ).add(() => {
          this.filtrarEmpresas()
        })
      }
    });
  }

  seleccionarEmpresa(idCompany : number){
    this.dialogRef.close(
      {
        idCompany : idCompany
      }
    );
  }
}
