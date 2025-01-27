import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Pais } from 'app/models/combo';
import { TicketHistorySubscriber } from 'app/models/pedidos/ticket';
import { ComboService } from 'app/services/combo.service';
import { TicketService } from 'app/services/pedidos/ticket.service';
import { Observable, map, startWith } from 'rxjs';

@Component({
    selector: 'app-historial-pedidos',
    templateUrl: './historial-pedidos.component.html',
    styleUrls: ['./historial-pedidos.component.scss'],
    standalone: false
})
export class HistorialPedidosComponent implements OnInit{

  breadscrums = [
    {
      title: 'Historial de Pedidos Online',
      items: ['Historial'],
      active: 'Pedidos Online',
    },
  ];

  dataSource: MatTableDataSource<TicketHistorySubscriber>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;
  columnsToDisplay = ['ticket', 'name', 'country', 'dispatchDate', 'act'];


  //FORMULARIO DE BUSQUEDA
  idSubscriber = 0
  name = ""
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  dateFrom = new Date()
  dateUntil = new Date()
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
  constructor(private comboService : ComboService, private ticketService : TicketService){

    this.filterPais = new Observable<Pais[]>()
    this.dataSource = new MatTableDataSource()
    const subscriberUser = JSON.parse(localStorage.getItem('subscriberUser') || '{}')
    if(subscriberUser.id > 0){
      this.idSubscriber = parseInt(subscriberUser.id)
    }
  }
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
  buscar(){
    const loader = document.getElementById('loader-lista') as HTMLElement | null;
    if(loader){
      loader.classList.remove('hide-loader');
    }
    this.ticketService.getTicketHistorySubscriber(this.idSubscriber,this.name,this.range.controls['start'].value,this.range.controls['end'].value,this.idCountry).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSource.data = response.data
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        }
      }
    ).add(
      () => {
        if(loader){
          loader.classList.add('hide-loader');
        }
      }
    )
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
  limpiar(){
    this.range = new FormGroup({
      start: new FormControl<Date | null>(null),
      end: new FormControl<Date | null>(null),
    });
    this.name = ""
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
}
