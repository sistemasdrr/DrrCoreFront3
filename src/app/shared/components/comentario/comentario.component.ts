import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TicketService } from 'app/services/pedidos/ticket.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comentario',
  templateUrl: './comentario.component.html',
  styleUrls: ['./comentario.component.scss']
})
export class ComentarioComponent {
  public Editor: any = ClassicEditor;

  id = 0
  cupon: string = "";
  comentario = ""
  loading = false

  constructor(
    public ticketService : TicketService,
    public dialogRef: MatDialogRef<ComentarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if(data){
      this.id = data.id
      this.cupon = data.cupon
      this.comentario = data.comentario
    }
  }

  cerrarDialog(){
    this.dialogRef.close()
  }
  guardar(){
    console.log(this.comentario)
    Swal.fire({
      title: '¿Está seguro de guardar el comentario del ticket?',
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
        this.ticketService.SaveTicketCommentary(this.id,this.comentario).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.loading = false
              Swal.fire({

                title : 'Se guardo el comentario correctamente.',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.dialogRef.close()
                }
              );
            }else{
              this.loading = false
              Swal.fire({
                title : 'Error al guardar el comentario.',
                icon : 'error',
                width: '20rem',
                heightAuto : true
              }).then(
                () => {
                  this.dialogRef.close()
                }
              );
            }
          },(error) => {
            this.loading = false
            Swal.fire({
              text : error,
              icon : 'error',
              width: '20rem',
              heightAuto : true
            }).then(
              () => {
                this.dialogRef.close()
              }
            );
          }
        )


      }
    });

  }
}
