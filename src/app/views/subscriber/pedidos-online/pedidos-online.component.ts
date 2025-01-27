import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pais } from 'app/models/combo';
import { TCompany, WCompany } from 'app/models/informes/empresa/datos-empresa';
import { ComboService } from 'app/services/combo.service';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';
import { Observable, map, startWith } from 'rxjs';
import { ConfirmarPedidoComponent } from './confirmar-pedido/confirmar-pedido.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
    selector: 'app-pedidos-online',
    templateUrl: './pedidos-online.component.html',
    styleUrls: ['./pedidos-online.component.scss'],
    standalone: false
})
export class PedidosOnlineComponent implements OnInit{
  breadscrums = [
    {
      title: 'Solicitud de Informe Online',
      items: ['Pedidos'],
      active: 'Pedidos Online',
    },
  ];
  name = ""
  taxCode = ""
  idCountry = 0
  controlPaises = new FormControl<string | Pais>('')
  paises: Pais[] = []
  filterPais: Observable<Pais[]>
  msgPais = ""
  colorMsgPais = ""
  paisSeleccionado: Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',
  }

  dataSource: MatTableDataSource<WCompany>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  columnsToDisplay = ['name', 'country', 'place', 'lastSearched', 'acciones' ];



   constructor(private dialog : MatDialog,private comboService : ComboService, private datosEmpresaService : DatosEmpresaService){
    this.dataSource = new MatTableDataSource()
    this.filterPais = new Observable<Pais[]>()
    this.dataSource.sort = this.sort   }
   ngOnInit(): void {
    this.comboService.getPaises().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.paises = response.data
        }
      }
    )

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
    this.idCountry = 0
    this.iconoSeleccionado = ""
  }
  iconoSeleccionado: string = ""
  cambioPais(pais: Pais) {
    if (pais !== null) {
      if (typeof pais === 'string' || pais === null || this.paisSeleccionado.id === 0) {
        this.msgPais = "Seleccione una opción."
        this.colorMsgPais = "red"
        this.iconoSeleccionado = ""
        this.idCountry = 0
      } else {
        this.msgPais = "Opción Seleccionada"
        this.colorMsgPais = "blue"
        this.iconoSeleccionado =pais.bandera
        this.idCountry = pais.id
      }
    } else {
      this.idCountry = 0
      console.log(this.idCountry)
      this.msgPais = "Seleccione una opción."
      this.colorMsgPais = "red"
    }
  }

  buscar(){
    this.datosEmpresaService.getCompanySearch(this.name, this.taxCode, this.idCountry).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSource.data = response.data
          this.dataSource.sort = this.sort
          this.dataSource.paginator = this.paginator

        }
      }
    )
  }
  limpiar(){
    this.name = ""
    this.taxCode = ""
    this.idCountry = 0
    this.paisSeleccionado = {
      id: 0,
      valor: '',
      abreviation: '',
      bandera: '',
      regtrib: '',
      codCel: '',
    }
    this.iconoSeleccionado = ""
  }
  confirmarPedido(idCompany : number){
    const dialogRef = this.dialog.open(ConfirmarPedidoComponent, {
      data: {
        idCompany : idCompany
      },
    });
  }
}
