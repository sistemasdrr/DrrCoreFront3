
import { Component, ViewChild, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { SearchSituation, TicketsByCompanyOrPerson } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import { MatDialog } from '@angular/material/dialog';
import { HistorialPedidoComponent } from './historial-pedido/historial-pedido.component';
import { ObservacionComponent } from './observacion/observacion.component';
import { ObservacionPedidoComponent } from './observacion-pedido/observacion-pedido.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ComplementoComponent } from 'app/views/consultas/informes/complemento/complemento.component';
import { Pais } from 'app/models/combo';
import { map, Observable, startWith } from 'rxjs';
import { PaisService } from 'app/services/pais.service';


const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();
const day = today.getDate()

@Component({
    selector: 'app-lista',
    templateUrl: './lista.component.html',
    styleUrls: ['./lista.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
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
export class ListaSituacionComponent implements  OnInit {
  breadscrums = [
    {
      title: 'Situación de Informe',
      items: ['Producción'],
      active: 'Situación',
    },
  ];
  enter(event : any){
    if(event.code == 'Enter'){
      this.applyFilter()
    }
  }
  dataSource: MatTableDataSource<SearchSituation>;
  columnsToDisplay = [ 'oldCode',  'name', 'taxCode', 'telephone', 'country', 'Acciones' ];

  dataSourceSelect: MatTableDataSource<TicketsByCompanyOrPerson>;
  columnsToDisplaySelect = [ 'ticket', 'requestedName', 'status', 'subscriberCode','procedureType'
  , 'reportType', 'language', 'orderDate', 'endDate', 'dispatchDate', 'Acciones' ];

  loading = false

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //FILTROS
  about = "E"
  typeSearch = "N";
  name = ""
  fechaInicio : Date = new Date(2023, 0, 1)
  fechaFin : Date = new Date(year, month, day)
  tipoInforme = ""
  tipoTramite = ""
  filtroRB = "C"
  haveReport = false;
  maxDate: Date = new Date();
  idPais = 0

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

  constructor(private paisService : PaisService,private router : Router, private fb: FormBuilder, private ticketService : TicketService,public dialog : MatDialog) {
    this.dataSource = new MatTableDataSource();
    this.dataSourceSelect = new MatTableDataSource();
    this.filterPais = new Observable<Pais[]>()

  }

  ngOnInit(): void {
    this.paisService.getPaises().subscribe((response) => {
      if (response.isSuccess == true) {
        this.paises = response.data;
      }
    })
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
        this.colorMsgPais = "green"
      }
    } else {
      this.idPais = 0
      console.log(this.idPais)
      this.msgPais = "Seleccione una opción."
      this.colorMsgPais = "red"
    }
  }
  enviarComplemento(idTicket : number) {
    console.log(idTicket)
    const dialogRef = this.dialog.open(ComplementoComponent, {
      data : {
          idTicket : idTicket
      },
    });
  }
  applyFilter() {
    this.loading = true
    this.ticketService.GetNewSearchSituation(this.about, this.name, this.filtroRB, this.idPais, this.haveReport, this.typeSearch).subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.dataSource.data = response.data
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        }
      }
    ).add(
      () => {
        this.loading = false

      }
    )
    // this.ticketService.getSearchSituation(this.about,this.typeSearch,this.name,0).subscribe(
    //   (response) =>{
    //     if(response.isSuccess === true && response.isWarning === false){
    //       this.dataSource.data = response.data
    //       this.dataSource.paginator = this.paginator
    //       this.dataSource.sort = this.sort
    //     }
    //   }
    // ).add(
    //   () => {
    //     this.loading = false

    //   }
    // )
  }


  seleccionar(id : number, oldCode : string){
    const loader = document.getElementById('loader-lista-situacion') as HTMLElement | null;
    this.loading = true

    this.ticketService.getTicketByCompanyOrPerson(this.about,id,oldCode).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dataSourceSelect.data = response.data
          this.dataSourceSelect.paginator = this.paginator
          this.dataSourceSelect.sort = this.sort
        }
      }
    ).add(
      () => {
        this.loading = false

      }
    )
  }
  verHistorial(idTicket : number) {
    const dialogRef = this.dialog.open(HistorialPedidoComponent, {
      data : {
          idTicket : idTicket
      },
    });
  }
  observacion(idTicket : number) {
    const dialogRef = this.dialog.open(ObservacionComponent, {
      data : {
          idTicket : idTicket
      },
    });
    dialogRef.beforeClosed().subscribe(
      (data) => {
        if(data.success === true){
          this.dataSourceSelect.data = []
          this.dataSourceSelect.paginator = this.paginator
          this.dataSourceSelect.sort = this.sort
        }
      }
    )
  }
  verObservacion(idTicket : number){
    const dialogRef = this.dialog.open(ObservacionPedidoComponent,{
      data : {
        idTicket : idTicket
    },
    });
  }


}
