import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ProveedorHistory, ProveedorT } from 'app/models/informes/empresa/sbs-riesgo';
import { ComboService } from 'app/services/combo.service';
import { SbsRiesgoService } from 'app/services/informes/empresa/sbs-riesgo.service';
import Swal from 'sweetalert2';
import { PersonSbsService } from 'app/services/informes/persona/person-sbs.service';
import { TicketService } from 'app/services/pedidos/ticket.service';
import { DetalleEComponent } from './detalle-e/detalle-e.component';
import { DetallePComponent } from './detalle-p/detalle-p.component';
import { ReferenciasComercialesRefComponent } from './referencias-comerciales-ref/referencias-comerciales-ref.component';

@Component({
  selector: 'app-referencista',
  templateUrl: './referencista.component.html',
  styleUrls: ['./referencista.component.scss']
})
export class ReferencistaComponent implements OnInit {

  id = 0
  idTicket = 0
  numCupon = ""
  type = ""
  user=""
  asignedTo = ""
  isComplement = false

  dataSourceProveedor: MatTableDataSource<ProveedorT>
  dataSourceHistorico: MatTableDataSource<ProveedorHistory>
  columnsToDisplayProveedor = ['name', 'telephone', 'country', 'maximumAmount', 'timeLimit', 'compliance', 'date','productsTheySell', 'attendedBy','accion'];
  columnsToDisplayHistorico = ['ticket', 'numReferences', 'referentName', 'date'];

  constructor(private dialog : MatDialog,private sbsService : SbsRiesgoService, private sbsPerson : PersonSbsService,
    private activatedRoute : ActivatedRoute, private comboService : ComboService, private ticketService : TicketService){
    this.dataSourceProveedor = new MatTableDataSource()
    this.dataSourceHistorico = new MatTableDataSource()
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    this.user = auth.idUser
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id?.includes('nuevo')) {
      this.id = 0
    } else {
      this.id = parseInt(id + '')
    }
    console.log(this.id)
    const idTicket = this.activatedRoute.snapshot.paramMap.get('idTicket');
    if(idTicket){
      this.idTicket = parseInt(idTicket)
      console.log(this.idTicket)
    }
    const type = this.activatedRoute.snapshot.paramMap.get('type');
    if(type){
      this.type = type + ""
      console.log(this.type)
    }
    const asignedTo = this.activatedRoute.snapshot.paramMap.get('asignedTo');
    if(asignedTo !== null){
      this.asignedTo = asignedTo.trim()
      console.log(this.asignedTo)
    }
    const complement = this.activatedRoute.snapshot.paramMap.get('complement');
    if(complement === 'C'){
      this.isComplement = true
    }
    console.log(this.isComplement)
  }

  ngOnInit(): void {
    this.ticketService.getNumTicketById(this.idTicket).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.numCupon = response.data
        }
      }
    )
    const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
    if(paginaDetalleEmpresa){
      paginaDetalleEmpresa.classList.remove('hide-loader');
    }
    if(this.type === "E"){
      this.sbsService.getProviderByIdCompany(this.id).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceProveedor.data = response.data
          }
        }
      ).add(
        () => {
          this.sbsService.getProviderHistory("E", this.id).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSourceHistorico.data = response.data
                console.log(response.data)
              }
            }
          ).add(
            () => {
              if(paginaDetalleEmpresa){
                paginaDetalleEmpresa.classList.add('hide-loader');
              }
            }
          )

        }
      )
    }else{
      this.sbsPerson.getProviderByIdPerson(this.id).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.dataSourceProveedor.data = response.data
          }
        }
      ).add(
        () => {
          this.sbsService.getProviderHistory("P", this.id).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.dataSourceHistorico.data = response.data
              }
            }
          ).add(
            () => {
              if(paginaDetalleEmpresa){
                paginaDetalleEmpresa.classList.add('hide-loader');
              }
            }
          )

        }
      )
    }

  }
//TABLA PROVEEDOR
agregarProveedor() {
  if(this.type === "E"){
    const dialogR1 = this.dialog.open(DetalleEComponent, {
      data: {
        accion : 'AGREGAR',
        id : 0,
        idCompany : this.id,
        idTicket : this.idTicket,
        numCupon : this.numCupon,
        model : null
        },
      });
      dialogR1.afterClosed().subscribe((d) => {
        console.log(d)
        if(d.success === true){
          this.dataSourceProveedor.data.push(d.data)
          this.dataSourceProveedor._updateChangeSubscription();
        }
      });
    }else{
      const dialogR1 = this.dialog.open(DetallePComponent, {
        data: {
          accion : 'AGREGAR',
          id : 0,
          idPerson : this.id,
          idTicket : this.idTicket,
          numCupon : this.numCupon,
          model : null
          },
        });
        dialogR1.afterClosed().subscribe((d) => {
          console.log(d)
          if(d.success === true){
            this.dataSourceProveedor.data.push(d.data)
            this.dataSourceProveedor._updateChangeSubscription();
          }
        });
    }

  }
  editarProveedor(id : number) {
    if(this.type === "E"){
      const dialogR2 = this.dialog.open(DetalleEComponent, {
        data: {
          accion : 'EDITAR',
          id : id,
          idCompany : this.id,
          idTicket : this.idTicket,
          numCupon : this.numCupon,
          model : this.dataSourceProveedor.data.filter(x => x.id === id)[0]
        },
      });
      dialogR2.afterClosed().subscribe((d) => {
        console.log(d)
        if(d.success === true){
          const updatedData = d.data;
          const indexToUpdate = this.dataSourceProveedor.data.findIndex(item => item.id === id);

          if (indexToUpdate !== -1) {
            this.dataSourceProveedor.data[indexToUpdate] = updatedData;
            this.dataSourceProveedor._updateChangeSubscription();
          }
        }
      });
    }else{
      const dialogR2 = this.dialog.open(DetallePComponent, {
        data: {
          accion : 'EDITAR',
          id : id,
          idPerson : this.id,
          idTicket : this.idTicket,
          numCupon : this.numCupon,
          model : this.dataSourceProveedor.data.filter(x => x.id === id)[0]
        },
      });
      dialogR2.afterClosed().subscribe((d) => {
        if(d.success === true){
          const updatedData = d.data;
          const indexToUpdate = this.dataSourceProveedor.data.findIndex(item => item.id === id);

          if (indexToUpdate !== -1) {
            this.dataSourceProveedor.data[indexToUpdate] = updatedData;
            this.dataSourceProveedor._updateChangeSubscription();
          }
        }
      });
    }

  }
  editarProveedorPorNombre(nombre : string){
    if(this.type === "E"){
      const dialogR2 = this.dialog.open(DetalleEComponent, {
        data: {
          accion : 'EDITAR',
          id : 0,
          idCompany : this.id,
          idTicket : this.idTicket,
          numCupon : this.numCupon,
          model : this.dataSourceProveedor.data.filter(x => x.name === nombre)[0]
        },
      });
      dialogR2.afterClosed().subscribe((d) => {
        console.log(d)
        if(d.success === true){
          const updatedData = d.data;
          const indexToUpdate = this.dataSourceProveedor.data.findIndex(item => item.name === nombre);

          if (indexToUpdate !== -1) {
            this.dataSourceProveedor.data[indexToUpdate] = updatedData;
            this.dataSourceProveedor._updateChangeSubscription();
          }
        }
      });
    }else{
      const dialogR2 = this.dialog.open(DetallePComponent, {
        data: {
          accion : 'EDITAR',
          id : 0,
          idPerson : this.id,
          idTicket : this.idTicket,
          numCupon : this.numCupon,
          model : this.dataSourceProveedor.data.filter(x => x.name === nombre)[0]
        },
      });
      dialogR2.afterClosed().subscribe((d) => {
        if(d.success === true){
          const updatedData = d.data;
          const indexToUpdate = this.dataSourceProveedor.data.findIndex(item => item.name === nombre);

          if (indexToUpdate !== -1) {
            this.dataSourceProveedor.data[indexToUpdate] = updatedData;
            this.dataSourceProveedor._updateChangeSubscription();
          }
        }
      });
    }

  }
  eliminarProveedor(id : number){
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
        this.dataSourceProveedor.data = this.dataSourceProveedor.data.filter(x => x.id !== id)
        this.dataSourceProveedor._updateChangeSubscription();
      }
    })
  }
  eliminarProveedorPorNombre(nombre : string){
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
        this.dataSourceProveedor.data = this.dataSourceProveedor.data.filter(x => x.name !== nombre)
          this.dataSourceProveedor._updateChangeSubscription();
      }
    })
  }
  listarProveedores(idTicket : number){
    const dialogRef = this.dialog.open(ReferenciasComercialesRefComponent, {
      data: {
        idTicket: idTicket
      },
    });
  }
  guardar(){
    this.dataSourceProveedor.data.forEach(element => {
      element.idTicket = this.idTicket
      element.ticket = this.numCupon
    });
    console.log(this.dataSourceProveedor.data)
    Swal.fire({
      title: '¿Está seguro de guardar los registros?',
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
        this.sbsService.addListProvider(this.dataSourceProveedor.data, this.id,this.user,this.asignedTo,this.idTicket,this.isComplement).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title: 'Se guardaron los registros correctamente.',
                text: "",
                icon: 'success',
                width: '20rem',
              }).then(
                () => {
                  this.ngOnInit()
                }
              )
            }
          }
        )
      }
    })
  }
}
