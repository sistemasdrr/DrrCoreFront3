import { AddListCompanyRelation, CompanyRelationT } from './../../../../../../models/informes/empresa/antecendentes-legales';
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
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { SelectionModel } from '@angular/cdk/collections';
import { AntecedentesLegalesService } from 'app/services/informes/empresa/antecedentes-legales.service';

@Component({
  selector: 'app-lista-empresas',
  templateUrl: './lista-empresas.component.html',
  styleUrls: ['./lista-empresas.component.scss'],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'es'},
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS}
  ]
})
export class ListaEmpresas1Component implements OnInit {

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
  msgPais = ""
  colorMsgPais = ""
  //FILTROS
  razonSocial = ""
  filtroRB = "C"
  idPais = 0
  chkConInforme = false

  isAllSelected1() {
    const numSelected = this.selection1.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  toggleAllRows1() {
    if (this.isAllSelected1()) {
      this.selection1.clear();
      return;
    }
    this.selection1.select(...this.dataSource.data);
  }
  checkboxLabel1(row?: TCompany): string {
    if (!row) {
      return `${this.isAllSelected1() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection1.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }
  onCheckboxChange1(row: TCompany) {
    this.selection1.toggle(row);
  }


  dataSource: MatTableDataSource<TCompany>;
  selection1 = new SelectionModel<TCompany>(true, []);

  listIdCompany : number[] = []
  listRelatedCompanies : CompanyRelationT[] = []

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  columnsToDisplay = ['select','rc', 'idioma', 'rucInit', 'razonSocial', 'datosAl', 'pais', 'traduccion', 'calificacion','ejecPrincipal','acciones' ];

  constructor(private antecedentesService : AntecedentesLegalesService,@Inject(MAT_DIALOG_DATA) public data: any,private datosEmpresaService : DatosEmpresaService,private router : Router, private paisService : PaisService,public dialogRef: MatDialogRef<ListaEmpresas1Component>,){
    this.dataSource = new MatTableDataSource()
    this.filterPais = new Observable<Pais[]>()
    if(data){
      this.idCompanyRelacion = data.idCompany
      this.listRelatedCompanies = data.listRelatedCompanies
    }
    console.log(this.idCompanyRelacion)
    console.log(this.listRelatedCompanies)
  }

  ngOnInit(): void {
    this.loading = true
    this.dataSource = new MatTableDataSource()

    this.paisService.getPaises().subscribe((response) => {
      if (response.isSuccess == true) {
        this.paises = response.data;
      }
    },(error) => {
      console.log(error)
      this.loading = false
    }).add(() => {
      if(localStorage.getItem('busquedaEmpresas')){
        // const busqueda = JSON.parse(localStorage.getItem('busquedaEmpresas')+'')
        // this.razonSocial = busqueda.razonSocial
        // this.filtroRB = busqueda.filtro
        // if(busqueda.idCountry > 0){
        //   this.idPais = busqueda.idCountry
        //   this.paisSeleccionado = this.paises.filter(x => x.id === busqueda.idCountry)[0]
        //   this.iconoSeleccionado = this.paisSeleccionado.bandera
        // }else{
        //   this.limpiarSeleccionPais()
        // }
        // this.paisSeleccionado = this.paises.filter(x => x.id === busqueda.idPais)[0]
        // this.chkConInforme = busqueda.conInforme
        this.filtrarEmpresas()
        this.loading = false
      }
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
  verificarId(id: number): boolean {
    const index = this.listRelatedCompanies.findIndex(x => x.idCompanyRelation === id);
    return index === -1;
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
        this.colorMsgPais = "green"
      }
    } else {
      this.idPais = 0
      console.log(this.idPais)
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
    this.chkConInforme = true

    this.filtrarEmpresas()
  }
  filtrarEmpresas(){
    this.loading = true

    // const busqueda = {
    //   razonSocial : this.razonSocial,
    //   filtro : this.filtroRB,
    //   idPais : this.idPais,
    //   conInforme : this.chkConInforme
    // }
    // localStorage.setItem('busquedaEmpresas', JSON.stringify(busqueda))
    this.datosEmpresaService.getDatosEmpresas(this.razonSocial.trim(), this.filtroRB, this.idPais, this.chkConInforme,"N",'T',0).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSource = new MatTableDataSource(response.data)
          this.dataSource.sort = this.sort
          this.dataSource.paginator = this.paginator
        }
      },(error) => {
        this.loading = false

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
        this.loading = false

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
    console.log(idCompany)
    Swal.fire({
      title: '¿Está seguro de relacionar esta empresa?',
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
        this.dialogRef.close(
          {
            idCompany : idCompany
          }
        )
      }
    });
  }
  seleccionarVariasEmpresas(){

    this.listIdCompany = []
    this.selection1.selected.forEach(element => {
      this.listIdCompany.push(element.id)
    });
    console.log(this.idCompanyRelacion)
    console.log(this.listIdCompany)
    let request : AddListCompanyRelation[] = []
    request[0] = {
      idCompany : this.idCompanyRelacion,
      idsCompanyRelation : this.listIdCompany
    }
    Swal.fire({
      title: '¿Está seguro de relacionar esta empresa?',
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
        this.loading = true
        this.antecedentesService.addListCompanyRelation(request[0]).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title :'¡La operación se realizo con exito!',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.loading = false
                  this.dialogRef.close({
                    success : true
                  })
                }
              )
            }
          },(error) => {
            this.loading = false
          }
        ).add(
          () => {
            this.loading = false
          }
        )
      }
    })
  }
}
