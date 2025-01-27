import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Pais } from 'app/models/combo';
import { PaisService } from 'app/services/pais.service';
import { Observable, map, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { DatosGeneralesService } from 'app/services/informes/persona/datos-generales.service';
import { TPersona } from 'app/models/informes/persona/datos-generales';

@Component({
    selector: 'app-lista-personas',
    templateUrl: './lista-personas.component.html',
    styleUrls: ['./lista-personas.component.scss'],
    standalone: false
})
export class ListaPersonasComponent implements OnInit {

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


  dataSource: MatTableDataSource<TPersona>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  columnsToDisplay = ['language', 'codeDocumentType', 'fullname', 'cellphone', 'country','acciones' ];
  columnsToDisplaySimilar = ['language', 'fullname', 'descargado', 'cellphone', 'country','acciones' ];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,private datosPersonaService : DatosGeneralesService,private router : Router, private paisService : PaisService,public dialogRef: MatDialogRef<ListaPersonasComponent>,){
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
        this.filtrarPersonas()
       }
      this.msgPais = "Seleccione una opción."
      this.colorMsgPais = "red"
    }
  }
  filtrar(event : any){
    if(event.code == 'Enter'){
      this.filtrarPersonas()
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

    this.filtrarPersonas()
  }
  filtrarPersonas(){
    const listaPersonas = document.getElementById('loader-lista-personas') as HTMLElement | null;
    if(listaPersonas){
      listaPersonas.classList.remove('hide-loader');
    }
    // const busqueda = {
    //   razonSocial : this.razonSocial,
    //   filtro : this.filtroRB,
    //   idPais : this.idPais,
    //   conInforme : this.chkConInforme,
    //   similar:this.filterBy==='S'
    // }
    // localStorage.setItem('busquedaPersonas', JSON.stringify(busqueda))

    this.loading=true;
    this.datosPersonaService.getDatosPersonas(encodeURI(this.razonSocial.trim()), this.filtroRB, this.idPais, this.chkConInforme,this.filterBy,'T').subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSource = new MatTableDataSource(response.data)
          this.dataSource.sort = this.sort
          this.dataSource.paginator = this.paginator
          this.loading=false;
        }
      },(error) => {
        if(listaPersonas){
          listaPersonas.classList.add('hide-loader');
        }
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
        if(listaPersonas){
          listaPersonas.classList.add('hide-loader');
          this.loading=false;
        }
      })

  }
  agregarPersona(){
    this.router.navigate(['informes/persona/detalle/nuevo']);
  }


  seleccionarPersona(idPerson : number){
    this.dialogRef.close(
      {
        idPerson : idPerson
      }
    );
  }
}
