
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { MatTableDataSource} from '@angular/material/table';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { ComentarioComponent } from '@shared/components/comentario/comentario.component';
import { MatDialog } from '@angular/material/dialog';
import { AdjuntarArchivosComponent } from '@shared/components/adjuntar-archivos/adjuntar-archivos.component';
import {  SeleccionarAgenteComponent } from './seleccionar-agente/seleccionar-agente.component';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Asignacion, ListTicket, ListTicket2, OtherUserCode } from 'app/models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import Swal from 'sweetalert2';
import { ReferenciasComercialesComponent } from './referencias-comerciales/referencias-comerciales.component';
import { UsuarioService } from 'app/services/usuario.service';
import { HistorialPedidoComponent } from 'app/views/situacion/lista/historial-pedido/historial-pedido.component';
import { HistoricoPedidosComponent } from 'app/views/informe/info-empresa/ie-detalle/e-datos-empresa/historico-pedidos/historico-pedidos.component';


@Component({
    selector: 'app-asignacion2',
    templateUrl: './asignacion2.component.html',
    styleUrls: ['./asignacion2.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
    standalone: false
})
export class Asignacion2Component implements OnInit {
  userTo = ""
  loading:boolean=false;
  state="P";
  //BREADCRUMB
  breadscrums = [
    {
      title: 'Bandeja de Asignación',
      items: ['Producción','Pedidos'],
      active: 'Asignación',
    },
  ];

  //TABLA
  dataSource: MatTableDataSource<ListTicket2>;
  columnsToDisplay = ['number','subscriber','country', 'busineesName','status','subscriberCode', 'reportType', 'procedureType', 'quality', 'orderDate','Acciones' ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedOrder: ListTicket2 | null = null;
    selection = new SelectionModel<ListTicket2>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('filter') filter!: ElementRef;

  userCodes : string[] = []

  constructor(private  ticketService : TicketService, private router : Router,
    private usuarioService : UsuarioService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();

    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    this.userTo = auth.idUser
  }
  actualizar(){
    this.ngOnInit()
  }
  ngOnInit() {
    this.loading=true;
    this.ticketService.getTicketPreassigned(this.userTo).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          console.log(response.data)
          this.dataSource.data = response.data
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

        }
      }
    ).add(
      () => {
        this.loading=false;
      }
    )

    this.usuarioService.getOtherUserCode(parseInt(this.userTo)).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.userCodes = response.data
        }
      }
    )
  }

  volver(){
    this.router.navigate(['pedidos/lista']);
  }
  activeQuality(obj : OtherUserCode[]){
    let active = false;
    obj.forEach(element => {
      if(element.code.includes('S') && element.active === true){
        active = true
      }
    });
    return active
  }
  verHistorial(idTicket : number) {
    const dialogRef = this.dialog.open(HistorialPedidoComponent, {
      data : {
          idTicket : idTicket
      },
    });
  }
  asignarTrabajador(order : ListTicket2){

    let quality : boolean = false
    order.otherUserCode.forEach(element => {

      if(element.code.includes('S') && element.active === true){
        quality = true
      }
    });
    console.log(quality)
    if(quality){

      if(order.quality === null || order.quality.trim() === ''){
        Swal.fire({
          title :'¡Calidad no seleccionada!',
          icon : 'error',
          width: '20rem',
          heightAuto : true
        });
      }else{
        this.ticketService.ValidateQuality(order.idTicket).subscribe(
          (response) => {
            if(response.isSuccess){
              if(response.data === 1){
                Swal.fire({
                  title: 'El informe no tiene CALIDAD FINAL!! ¿Desea continuar?',
                  showDenyButton: true,
                  confirmButtonText: 'Si',
                  denyButtonText: 'No',
                  customClass: {
                    actions: 'my-actions',
                    cancelButton: 'order-1 right-gap',
                    confirmButton: 'order-2',
                    denyButton: 'order-3',
                  },
                }).then((result) => {
                  if (result.isConfirmed) {
                    if(order.quality !== null && order.quality.trim() !== ''){

                      const dialogRef = this.dialog.open(SeleccionarAgenteComponent, {
                        data: {
                          id : order.id,
                          idTicket: order.idTicket,
                          reportType: order.reportType,
                          numberAssign : order.numberAssign,
                          assginFromCode : order.asignedTo,
                          procedureType:order.procedureType,
                          quality : order.quality,
                          qualityTypist : order.qualityTypist,
                          qualityTranslator :  order.qualityTranslator,
                          hasBalance :  order.hasBalance,
                          otherUserCode : order.otherUserCode,
                          specialPriceBalance: order.specialPriceBalance,
                          order : order
                        },
                      }).afterClosed().subscribe(() => {
                           this.ngOnInit();
                         });
                        }
                      }else if (result.isDenied) {

                    }
                    });


              }else{
                const dialogRef = this.dialog.open(SeleccionarAgenteComponent, {
                  data: {
                    id : order.id,
                    idTicket: order.idTicket,
                    reportType: order.reportType,
                    procedureType:order.procedureType,
                    numberAssign : order.numberAssign,
                    assginFromCode : order.asignedTo,
                    quality : order.quality,
                        qualityTypist : order.qualityTypist,
                        qualityTranslator :  order.qualityTranslator,
                    hasBalance : quality  ? order.hasBalance : false,
                    otherUserCode : order.otherUserCode,
                    specialPriceBalance: order.specialPriceBalance,
                    order : order
                  },
                }).afterClosed().subscribe(() => {
                     this.ngOnInit();
                   });
              }
            }
          }
        )

      }}
      else{
        const dialogRef = this.dialog.open(SeleccionarAgenteComponent, {
          data: {
            id : order.id,
            idTicket: order.idTicket,
            reportType: order.reportType,
            numberAssign : order.numberAssign,
            assginFromCode : order.asignedTo,
            quality : order.quality,
            procedureType:order.procedureType,
                qualityTypist : order.qualityTypist,
                qualityTranslator :  order.qualityTranslator,
            hasBalance : quality  ? order.hasBalance : false,
            otherUserCode : order.otherUserCode,
            specialPriceBalance: order.specialPriceBalance,
            order : order
          },
        }).afterClosed().subscribe(() => {
             this.ngOnInit();
           });
          }

  }
  listarProveedores(idTicket : number){
    const dialogRef = this.dialog.open(ReferenciasComercialesComponent, {
      data: {
        idTicket: idTicket
      },
    });
  }
  //ACCIONES
  agregarComentario(id : string,cupon : string,comentario : string) {
    const dialogRef = this.dialog.open(ComentarioComponent, {
    data: {
      id: id,
      cupon : cupon,
      comentario : comentario

      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.ngOnInit
      }
    )

  console.log(dialogRef)
    // dialogRef.afterClosed().subscribe((codAbonado) => {
    //   if (codAbonado) {
    //     this.codAbonado = codAbonado.codigoAbonado
    //     this.asignarDatosAbonado()
    //   }
    // });
  }
  agregarAdjuntos(cod : string,cupon:string) {
    console.log(cod);
    const dialogRef = this.dialog.open(AdjuntarArchivosComponent, {
      data: {
        id: cod,
        cupon: cupon,
      },
  });
  console.log(dialogRef)
    // dialogRef.afterClosed().subscribe((codAbonado) => {
    //   if (codAbonado) {
    //     this.codAbonado = codAbonado.codigoAbonado
    //     this.asignarDatosAbonado()
    //   }
    // });
  }
  eliminarPorId(id : number,specialPrice:any[]){
    var model: object[] = [];

    specialPrice.forEach(element => {
      model[element.id] = element.description;
   });

   var idSpecialPrice=0;
    console.log(specialPrice.length)
    Swal.fire({
      title: '¿El agente a entregado la información complementaria?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText : 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí',
      width: '30rem',
      heightAuto : true,
    }).then((result) => {
      if(result.value){
        if(specialPrice.length>0){
          Swal.fire({
            title: 'El agente tiene precios especiales, por favor seleccionar uno',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            input:'select',
            inputOptions: model,
            cancelButtonText : 'Cancelar',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Ok',
            width: '30rem',
            heightAuto : true,
          }).then((result) => {
             idSpecialPrice=result.value;
            this.ticketService.ConfirmAgentHistory(id,idSpecialPrice).subscribe(
              (response) => {
                if(response.isSuccess === true && response.isWarning === false){
                  Swal.fire({
                    title: 'Por favor, avisar al analista que la documentación ha sido actualizada.',
                    text: "",
                    icon: 'success',
                    width: '20rem',
                    
                    heightAuto : true
                  }).then(
                    () => {
                      this.ngOnInit();
                    }
                  )
                }
              }
            )

          });
        }else{

          this.ticketService.ConfirmAgentHistory(id,0).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title: 'Por favor, avisar al analista que la documentación ha sido actualizada.',
                  text: "",
                  icon: 'success',
                  width: '20rem',
                  
                  heightAuto : true
                }).then(
                  () => {
                    this.ngOnInit();
                  }
                )
              }
            }
          )
        }



      }
    })
  }
  eliminar(idTicket : number, asignedTo : string, numberAssign : number, number : string){
    console.log(idTicket)
    console.log(asignedTo)
    console.log(numberAssign)
    if(number.includes('(C')){
      Swal.fire({
        title: '¿Está seguro de eliminar esta asignación de tipo complemento?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText : 'No',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        width: '30rem',
      }).then((result) => {
        if(result.value){
          this.ticketService.deleteTicketComplement(idTicket).subscribe(
            (response) => {
              if(response.isSuccess){
                Swal.fire({
                  title: 'Se eliminó la asignación con exito',
                  text: "",
                  icon: 'success',
                  width: '20rem',
                  heightAuto : true
                }).then(
                  () => {
                    this.ngOnInit();
                  }
                )
              }
            }
          )
        }
      })
    }else{
      Swal.fire({
        title: '¿Está seguro de eliminar esta asignación?',
        text: "",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText : 'No',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí',
        width: '30rem',
        heightAuto : true,
        html: `
        <hr>
        <div class='w-100 d-flex justify-content-center'>
        <div class='w-100'>
        <label for="devolucion"><h4><b>Motivo de devolución</b></h4></label>
        <textarea class='w-100 form-control shadow-lg' style='min-height:12rem;' id="devolucion"  placeholder="">--------------------------MENSAJE DE DEVOLUCIÓN DE ${asignedTo}--------------------------\n</textarea>
        </div>
        </div>

        `,
        preConfirm: () => {
          const motivo = (document.getElementById('devolucion') as HTMLTextAreaElement).value;
          console.log(motivo)
          return { motivo: motivo };
        }
      }).then((result) => {
        if(result.value){
          const motivoDevolucion = result.value.motivo;
          this.ticketService.deleteTicketHistory(idTicket,asignedTo,numberAssign,motivoDevolucion).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title: 'Se eliminó la asignación con exito',
                  text: "",
                  icon: 'success',
                  width: '20rem',
                  heightAuto : true
                }).then(
                  () => {
                    this.ngOnInit();
                  }
                )
              }
            }
          )
        }
      })
    }


  }
 historicoPedidos(idCompany:number) {
    const dialog = this.dialog.open(HistoricoPedidosComponent, {
      data: {
        titulo: "Histórico de Pedidos",
        id : idCompany
      }
    });
  }
  entregarTrabajo(id : number){
    console.log(id)
    Swal.fire({
      title: '¿Está seguro de entregar su trabajo?',
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
      if(result.value){
        this.ticketService.FinishWorkById(id).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              Swal.fire({
                title: 'Se entrego el trabajo correctamente',
                text: "",
                icon: 'success',
                width: '20rem',
                heightAuto : true
              })
            }
          }
        ).add(
          () => {
            this.ngOnInit()
          }
        )

      }
    })
  }
}
