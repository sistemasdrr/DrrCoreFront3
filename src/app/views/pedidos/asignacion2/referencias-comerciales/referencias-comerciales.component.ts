import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ProviderByTicket } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';

@Component({
  selector: 'app-referencias-comerciales',
  templateUrl: './referencias-comerciales.component.html',
  styleUrls: ['./referencias-comerciales.component.scss']
})
export class ReferenciasComercialesComponent  implements OnInit {

  idTicket = 0
  loading = false
  dataSource = new MatTableDataSource<ProviderByTicket>
  columnsToDisplay = ['name','telephone','country']

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialogRef: MatDialogRef<ReferenciasComercialesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private ticketService : TicketService){
    if(data){
      this.idTicket = parseInt(data.idTicket)
    }
  }

  ngOnInit(): void {
    this.loading = true
    this.ticketService.getProvidersByTicket(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.loading = false
          this.dataSource.data = response.data
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        }else{
          this.loading = false
        }
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }
  cerrarDialog(){
    this.dialogRef.close()
  }
}
