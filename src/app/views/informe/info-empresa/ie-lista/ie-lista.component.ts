import { PaisService } from './../../../../services/pais.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TCompany } from 'app/models/informes/empresa/datos-empresa';
import { Pais } from 'app/models/combo';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';
import { Observable, map, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { SociosEmpresaComponent } from './socios-empresa/socios-empresa.component';
import { ExportF1Component } from './export-f1/export-f1.component';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS, DateAdapter } from '@angular/material/core';


@Component({
    selector: 'app-ie-lista',
    templateUrl: './ie-lista.component.html',
    styleUrls: ['./ie-lista.component.scss'],
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
export class IEListaComponent implements OnInit{
  private readonly CACHE_KEY = 'authCache';
  breadscrums = [
    {
      title: 'Lista de Empresas',
      subtitle: '',
      codigoInforme : '',
      usuario : 'Julio del Risco Lizarzaburu',
      items: ['Producción', 'Informes'],
      active: 'Empresa',
    },
  ];
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
  quality = "T"
  filtroRB = "C"
  filterBy = "N"
  idPais = 0
  chkConInforme = false

  dataSource: MatTableDataSource<TCompany>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  columnsToDisplay = ['indicator', 'language', 'name','address','tellphone', 'taxNumber', 'lastReportDate', 'isoCountry', 'quality','manager','acciones' ];

  constructor(private datosEmpresaService : DatosEmpresaService,private router : Router, private paisService : PaisService, private dialog : MatDialog){
    this.dataSource = new MatTableDataSource()
    this.filterPais = new Observable<Pais[]>()
    this.dataSource.sort = this.sort
  }

  ngOnInit(): void {

    this.paisService.getPaises().subscribe((response) => {
      if (response.isSuccess == true) {
        this.paises = response.data;
      }
    })//.add(() => {
    //   if(localStorage.getItem('busquedaEmpresas')){
    //     const busqueda = JSON.parse(localStorage.getItem('busquedaEmpresas')+'')
    //     this.razonSocial = busqueda.razonSocial
    //     this.filtroRB = busqueda.filtro
    //     if(busqueda.idCountry > 0){
    //       this.idPais = busqueda.idCountry
    //       this.paisSeleccionado = this.paises.filter(x => x.id === busqueda.idCountry)[0]
    //       this.iconoSeleccionado = this.paisSeleccionado.bandera
    //     }else{
    //       this.limpiarSeleccionPais()
    //     }
    //     this.paisSeleccionado = this.paises.filter(x => x.id === busqueda.idPais)[0]
    //     this.chkConInforme = busqueda.conInforme
    //     this.loading = false
    //     if(this.razonSocial!= null && this.razonSocial !== ''){
    //       this.filtrarEmpresas()
    //     }
    //   }
    // })

    this.filterPais = this.controlPaises.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.valor
        return name ? this._filterPais(name as string) : this.paises.slice()
      }),
    )
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
      this.idPais = 0
      console.log(this.idPais)
      this.msgPais = "Seleccione una opción."
      this.colorMsgPais = "red"
    }
  }
  filtrar(event : any){
    if(event.code == 'Enter'){
      this.filtrarEmpresas(0)
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

    this.filtrarEmpresas(0)
  }
  filtrarEmpresas(indicador:number){
    const listaEmpresas = document.getElementById('loader-lista-empresas') as HTMLElement | null;
    if(listaEmpresas){
      listaEmpresas.classList.remove('hide-loader');
    }
    // const busqueda = {
    //   razonSocial : this.razonSocial,
    //   filtro : this.filtroRB,
    //   idPais : this.idPais,
    //   conInforme : this.chkConInforme
    // }
    // localStorage.setItem('busquedaEmpresas', JSON.stringify(busqueda))
    this.datosEmpresaService.getDatosEmpresas(encodeURI(this.razonSocial.trim()).toUpperCase(), this.filtroRB, this.idPais, this.chkConInforme,this.filterBy,this.quality,indicador).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSource = new MatTableDataSource<TCompany>(response.data);

          this.dataSource.sort = this.sort
          this.dataSource.paginator = this.paginator
        }
      },(error) => {
        if(listaEmpresas){
          listaEmpresas.classList.add('hide-loader');
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
        if(listaEmpresas){
          listaEmpresas.classList.add('hide-loader');
        }
      })
  }
  agregarEmpresa(){
    this.router.navigate(['informes/empresa/detalle/nuevo']);
  }
  sociosEmpresa(idCompany : number){
    const dialogRef = this.dialog.open(SociosEmpresaComponent, {
      data: {
        idCompany : idCompany
      },
    });
  }
  generarDocumento(idCompany : number, oldCode : string){
    const dialogRef = this.dialog.open(ExportF1Component, {
      data: {
        idCompany : idCompany,
        oldCode : oldCode
      },
    });
  }
  descargarDocumento(idCompany : number, oldCode : string, idioma : string, formato:string){
    const listaEmpresas = document.getElementById('loader-lista-empresas') as HTMLElement | null;
    if(listaEmpresas){
      listaEmpresas.classList.remove('hide-loader');
    }
    this.datosEmpresaService.downloadReportF8(idCompany,"E","pdf").subscribe(response=>{
      let blob : Blob = response.body as Blob;
      let a =document.createElement('a');
      const language = idioma === "I" ? "ENG" : "SPA"
      const extension = formato === "pdf" ? '.pdf' : formato === "word" ? '.doc' : '.xls'
      a.download= oldCode+"_"+language+"_"+Date.now()+extension;
      a.href=window.URL.createObjectURL(blob);
      a.click();
    }).add(
      () => {
        if(listaEmpresas){
          listaEmpresas.classList.add('hide-loader');
        }
      }
    );
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
          this.filtrarEmpresas(0)
        })
      }
    });
  }
  activarWebEmpresa(id : number){
    Swal.fire({
      title: '¿Está seguro de mostrar este registro en la web?',
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
          text : 'El registro se actualizo correctamente.',
          icon : 'success',
          width: '20rem',
          heightAuto : true
        });
        this.datosEmpresaService.activarWebEmpresa(id).subscribe(
          (response) => {
            console.log(response)
          }
        ).add(() => {
          this.filtrarEmpresas(0)
        })
      }
    });
  }
  desactivarWebEmpresa(id : number){
    Swal.fire({
      title: '¿Está seguro de ocultar este registro en la web?',
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
          text : 'El registro se actualizo correctamente.',
          icon : 'success',
          width: '20rem',
          heightAuto : true
        });
        this.datosEmpresaService.desactivarWebEmpresa(id).subscribe(
          (response) => {
            console.log(response)
          }
        ).add(() => {
          this.filtrarEmpresas(0)
        })
      }
    });
  }
}
