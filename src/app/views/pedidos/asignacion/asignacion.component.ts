
import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';

import { MatDialog } from '@angular/material/dialog';
import { AdjuntarArchivosComponent } from '@shared/components/adjuntar-archivos/adjuntar-archivos.component';
import { ComboData } from 'app/models/combo';
import { SaveTicketAssignation, TicketListPending } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import { Pedido } from 'app/models/pedidos/pedido';
import { animate, state, style, transition, trigger } from '@angular/animations';
import Swal from 'sweetalert2';
import { ComentarioComponent } from './comentario/comentario.component';



@Component({
    selector: 'app-asignacion',
    templateUrl: './asignacion.component.html',
    styleUrls: ['./asignacion.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class AsignacionComponent implements OnInit {
  idUser = 0;
  //BREADCRUMB
  breadscrums = [
    {
      title: 'Asignación',
      items: ['Producción','Pedidos'],
      active: 'Asignación',
    },
  ];

  lista : ComboData[] = [
    {
      id : 21,
      valor : "KATIA BUSTAMANTE"
    },
    {
      id : 33,
      valor : "MARIELA ACOSTA"
    },
    {
      id : 37,
      valor : "MONICA YEPEZ"
    },
    {
      id : 38,
      valor : "RAFAEL DEL RISCO"
    },
    {
      id : 42,
      valor : "CECILIA RODRIGUEZ"
    },
    {
      id : 50,
      valor : "JESSICA LIAU"
    },
    {
      id : 23,
      valor : "CECILIA SAYAS"
    },
  ]
  //TABLA
  dataSource: MatTableDataSource<TicketListPending>;
  columnsToDisplay = ['position','number', 'busineesName','investigatedIsoCountry','subscriberCode', 'reportType', 'procedureType', 'orderDate', 'expireDate', 'Acciones' ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedOrder: Pedido | null = null;
  selection = new SelectionModel<TicketListPending>(true, []);
  loading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private ticketService : TicketService, private router : Router, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
    console.log(this.dataSource)
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    this.idUser = parseInt(auth.idUser)
    console.log(parseInt(auth.idUser))
  }

  ngOnInit(): void {
    const loader = document.getElementById('loader-lista-cupon') as HTMLElement | null;
    if(loader){
      loader.classList.remove('hide-loader');
    }
    this.ticketService.getListPending().subscribe(
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

  //CHECKBOX

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }
  checkboxLabel(row?: TicketListPending): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id + 1}`;
  }


  volver(){
    this.router.navigate(['pedidos/lista']);
  }
  guardar(){
    this.loading = true;
    let lista : SaveTicketAssignation[] = []
    this.selection.selected.forEach(element => {
      const ticket : SaveTicketAssignation ={
        id : element.id,
        idEmisor : this.idUser,
        idReceptor : element.receptor2,
        commentary : element.commentary
      }
      lista.push(ticket)
    });
    const loader = document.getElementById('loader-lista-cupon') as HTMLElement | null;
    if(loader){
      loader.classList.remove('hide-loader');
    }
    this.ticketService.savePreassign(lista).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.loading = false;
          Swal.fire({
            title: 'Se ha guardado la pre-asignación correctamnete',
            text: '',
            icon: 'success',
            width: '30rem',
            heightAuto: true
          }).then(() => {
            this.ngOnInit();
          })
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

  guardarEnviar(){
    let lista : SaveTicketAssignation[] = []
    this.selection.selected.forEach(element => {
      const ticket : SaveTicketAssignation ={
        id : element.id,
        idEmisor : this.idUser,
        idReceptor : element.receptor2,
        commentary : element.commentary
      }
      lista.push(ticket)
    });

    Swal.fire({
      title: '¿Está seguro que desea realizar las asignaciones seleccionadas?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText : 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      width: '30rem',
      heightAuto : true
    }).then((result) => {
      if (result.value) {

      this.loading=true;
      this.ticketService.saveAndSendPreassign(lista).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
           this.loading=false;
           Swal.fire({
            title: 'Se ha realizado la pre-asignación correctamente',
            text: '',
            icon: 'success',
            width: '30rem',
            heightAuto: true
          }).then(() => {
            this.ngOnInit();
            this.selection.clear()
          })

          }
        }
      )
  }
})

  }

  //ACCIONES
  agregarComentario(id : number, cupon : string, comentario : string) {
    const dialogRef = this.dialog.open(ComentarioComponent, {
    data: {
      id: id,
      cupon: cupon,
      comentario : comentario
    },
  });
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data)
      if (data) {
        this.dataSource.data.filter(x => x.id === id)[0].commentary = data.comentario
      }
    });
  }
  agregarAdjuntos(idTicket : number, cupon : string) {
    const dialogRef = this.dialog.open(AdjuntarArchivosComponent, {
    data: {
      id: idTicket,
      cupon: cupon
    },
  });
  dialogRef.afterClosed().subscribe(
    () => {
      this.ngOnInit()
    }
  )
    // dialogRef.afterClosed().subscribe((codAbonado) => {
    //   if (codAbonado) {
    //     this.codAbonado = codAbonado.codigoAbonado
    //     this.asignarDatosAbonado()
    //   }
    // });
  }

}
