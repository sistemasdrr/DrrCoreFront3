import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CompanyImages } from 'app/models/informes/empresa/imagenes';
import { ImagenesService } from 'app/services/informes/empresa/imagenes.service';
import { ImageEditorEComponent } from 'app/views/informe/info-persona/ip-detalle/p-imagenes/image-editor/image-editor.component';
import { catchError, map, of } from 'rxjs';
import Swal from 'sweetalert2';
import { ImageEditorComponent } from './image-editor/image-editor.component';
import { VerPdfComponent } from '@shared/components/ver-pdf/ver-pdf.component';

@Component({
  selector: 'app-imagenes',
  templateUrl: './imagenes.component.html',
  styleUrls: ['./imagenes.component.scss'],
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
export class ImagenesComponent implements OnInit{

  id = 0
  idCompany = 0
  imgDesc1 = ""
  imgDesc2 = ""
  imgDesc3 = ""
  imgDesc4 = ""
  imgDescEng1 = ""
  imgDescEng2 = ""
  imgDescEng3 = ""
  imgDescEng4 = ""
  img1 = ""
  imgPrint1 = true
  img2 = ""
  imgPrint2 = true
  img3 = ""
  imgPrint3 = true
  img4 = ""
  imgPrint4 = true



  base64 = ""
  desc : string = ""
  descIng : string = ""
  print = true

  imgSeleccionadaCheck : boolean = false
  imgSeleccionada : string = ""
  mostrarImg(){
    this.imgSeleccionadaCheck = true
  }
  cardSeleccionada : number = 0

  tituloSeleccion : string = ""

  constructor(private dialog : MatDialog, private activatedRoute: ActivatedRoute, private imagenesService : ImagenesService) {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id?.includes('nuevo')) {
      this.idCompany = 0
    } else {
      this.idCompany = parseInt(id + '')
    }
  }
  ngOnInit(): void {

    if(this.idCompany !== 0){
      const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
      if(paginaDetalleEmpresa){
        paginaDetalleEmpresa.classList.remove('hide-loader');
      }
      this.imagenesService.getCompanyImgByIdCompany(this.idCompany).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            const companyImg = response.data
            if(companyImg){
              this.id = companyImg.id
              this.img1 = companyImg.img1 !== null && companyImg.img1.includes('data:image/png;base64,') ? companyImg.img1 : 'data:image/png;base64,' + companyImg.img1
              this.imgPrint1 = companyImg.imgPrint1
              this.imgDesc1 = companyImg.imgDesc1
              this.imgDescEng1 = companyImg.imgDescEng1
              this.img2 = companyImg.img2 !== null && companyImg.img2.includes('data:image/png;base64,') ? companyImg.img2 : 'data:image/png;base64,' + companyImg.img2
              this.imgPrint2 = companyImg.imgPrint2
              this.imgDesc2 = companyImg.imgDesc2
              this.imgDescEng2 = companyImg.imgDescEng2
              this.img3 = companyImg.img3 !== null && companyImg.img3.includes('data:image/png;base64,') ? companyImg.img3 : 'data:image/png;base64,' + companyImg.img3
              this.imgPrint3 = companyImg.imgPrint3
              this.imgDesc3 = companyImg.imgDesc3
              this.imgDescEng3 = companyImg.imgDescEng3
              this.img4 = companyImg.img4 !== null && companyImg.img4.includes('data:image/png;base64,') ? companyImg.img4 : 'data:image/png;base64,' + companyImg.img4
              this.imgPrint4 = companyImg.imgPrint4
              this.imgDesc4 = companyImg.imgDesc4
              this.imgDescEng4 = companyImg.imgDescEng4
            }
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
  }
  seleccionarImagen() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const base64String: string = e.target.result;
          console.log('Base64 de la imagen:', base64String);
          this.base64 = base64String
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  }

  verPdf(){
    const dialogRef = this.dialog.open(VerPdfComponent,{
      data: {
        type : "E",
        idCompany : this.idCompany,
        section : "IMAGENES",
        language : "E",
        idTicket : 0
      },
    });
  }
  verPdfIngles(){
    const dialogRef = this.dialog.open(VerPdfComponent,{
      data: {
        type : "E",
        idCompany : this.idCompany,
        section : "IMAGENES",
        language : "I",
        idTicket : 0
      },
    });
  }
  pegarImagen() {
    const clipboardData = navigator.clipboard;
    if (!clipboardData) {
      console.log("El navegador no admite el acceso al portapapeles.");
      return;
    }

    clipboardData.read()
      .then(data => {
        for (const item of data) {
          for (const type of item.types) {
            if (type.startsWith('image/')) {
              const mimeType = type.split('/')[1];
              item.getType(type).then(blob => {
                const reader = new FileReader();
                reader.onload = () => {
                  const base64String = reader.result as string;
                  this.base64 = base64String;
                };
                reader.readAsDataURL(blob);
              }).catch(error => {
                console.error("Error al obtener la imagen del portapapeles:", error);
              });
              return;
            }
          }
        }
        Swal.fire({
          title: 'No se encontraron imágenes en el portapapeles',
          icon : 'warning',
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ok',
          width: '20rem',
          heightAuto: true
        })
      })
      .catch(err => {
        console.error("Error al leer el portapapeles:", err);
      });
  }
  fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  }

  editarImagen(){
    const dialogRef = this.dialog.open(ImageEditorComponent, {
      data: {
        image : this.base64.includes('data:image/') === true ? this.base64 : 'data:image/png;base64,'+this.base64
      },
    });
    dialogRef.afterClosed().subscribe(
      (data) => {
        if(data){
          this.base64 = data.base64
        }
      }
    )
  }
  onSelect(event : any) {
    this.imgSeleccionadaCheck = false

    console.log(...event.addedFiles)
    // for (const file of this.files) {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //   const base64String = event.target?.result as string;
    //     console.log('Base64 de la imagen:', base64String);
    //   };
    //   reader.readAsDataURL(file);
    // }
  }

  onPaste(event: any) {
    this.imgSeleccionadaCheck = false
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let blob = null;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
      }
    }
    // for (const file of this.files) {
    //   const reader = new FileReader();
    //   reader.onload = (event) => {
    //     const base64String = event.target?.result as string;
    //     console.log('Base64 de la imagen:', base64String);
    //   };
    //   reader.readAsDataURL(file);
    // }
  }

  agregarImagen(card : number){
    const reader = new FileReader();
    reader.onload = (event) => {
    const base64String = event.target?.result as string;
    this.imgSeleccionada = base64String
      console.log('Base64 de la imagen:', base64String);
      if(card === 1){
        this.img1 = base64String;
        this.imgDesc1 = this.desc
        this.imgDescEng1 = this.descIng
      }else if(card === 2){
        this.img2 = base64String;
        this.imgDesc2 = this.desc
        this.imgDescEng2 = this.descIng
      }else if(card === 3){
        this.img3 = base64String;
        this.imgDesc3 = this.desc
        this.imgDescEng3 = this.descIng
      }else if(card === 4){
        this.img4 = base64String;
        this.imgDesc4 = this.desc
        this.imgDescEng4 = this.descIng
      }
      this.cardSeleccionada = 0
      this.tituloSeleccion = ""
      this.desc = ""
      this.descIng = ""
    };
  }

  seleccionarCard(card : number){
    this.cardSeleccionada = card
    this.imgSeleccionadaCheck = true
    if(card == 1){
      this.tituloSeleccion = "Imagén 1"
      this.desc = this.imgDesc1
      this.descIng = this.imgDescEng1
      this.print = this.imgPrint1
      this.base64 = this.img1
    }else if(card == 2){
      this.tituloSeleccion = "Imagén 2"
      this.desc = this.imgDesc2
      this.descIng = this.imgDescEng2
      this.print = this.imgPrint2
      this.base64 = this.img2
    }else if(card == 3){
      this.tituloSeleccion = "Imagén 3"
      this.desc = this.imgDesc3
      this.descIng = this.imgDescEng3
      this.print = this.imgPrint3
      this.base64 = this.img3
    }else if(card == 4){
      this.tituloSeleccion = "Imagén 4"
      this.desc = this.imgDesc4
      this.descIng = this.imgDescEng4
      this.print = this.imgPrint4
      this.base64 = this.img4
    }
  }
  borrarImagen(card : number){
    if(card == 1){
      this.img1 = ""
      this.imgDesc1 = ""
      this.imgDescEng1 = ""
    }else if(card == 2){
      this.img2 = ""
      this.imgDesc2 = ""
      this.imgDescEng2 = ""
    }else if(card == 3){
      this.img3 = ""
      this.imgDesc3 = ""
      this.imgDescEng3 = ""
    }else if(card == 4){
      this.img4 = ""
      this.imgDesc4 = ""
      this.imgDescEng4 = ""
    }
  }
  // subirImagen(num: number) {
  //   // Crea un nuevo archivo a partir del Blob
  //   let imagen : any = null
  //   if(num === 1){
  //     imagen = new File([this.dataURItoBlob(this.img1)], this.idCompany + "_"+num+".png", { type: 'image/png' });
  //   }if(num === 2){
  //     imagen = new File([this.dataURItoBlob(this.img2)], this.idCompany + "_"+num+".png", { type: 'image/png' });
  //   }if(num === 3){
  //     imagen = new File([this.dataURItoBlob(this.img3)], this.idCompany + "_"+num+".png", { type: 'image/png' });
  //   }if(num === 4){
  //     imagen = new File([this.dataURItoBlob(this.img4)], this.idCompany + "_"+num+".png", { type: 'image/png' });
  //   }
  //   const formData = new FormData();
  //   formData.append('request', imagen);

  //   this.imagenesService.uploadImages(formData).subscribe(
  //     (response) => {
  //       if (response.isSuccess === true && response.isWarning === false) {
  //         Swal.fire({
  //           title: '¡Se guardaron los datos con éxito!',
  //           text: '',
  //           icon: 'success',
  //           width: '40rem',
  //           heightAuto: true
  //         }).then(() => {
  //         });
  //       }
  //     }
  //   ).add(
  //     () => {
  //       const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
  //         if(paginaDetalleEmpresa){
  //           paginaDetalleEmpresa.classList.add('hide-loader');
  //         }
  //     }
  //   );
  // }

  dataURItoBlob(dataURI: string): Blob {
    console.log(dataURI)
    if(dataURI !== "" && dataURI !== null){
      const byteString = atob(dataURI.split(',')[1]);
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);

      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], { type: 'image/png' });
    }else{
      return new Blob([])
    }
  }
  base64ToFile(base64: string, filename: string, mimeType: string): File {
    console.log(base64)
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    return new File([blob], filename, { type: mimeType });
  }
  guardar(card : number, desc : string, descIng : string){

      Swal.fire({
        title: '¿Está seguro de modificar este registro?',
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
          const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.remove('hide-loader');
          }

            const imageName = 'name.png';
            const imageBlob = this.dataURItoBlob(this.base64);
            const file = new File([imageBlob], imageName, { type: 'image/png' });
            this.imagenesService.updateImages(this.idCompany, card,desc, descIng,this.print,file).subscribe(
              (response) => {
                if(response.isSuccess === true && response.isWarning === false){
                  Swal.fire({
                    title: 'Se realizó la operación con exito',
                    text: "",
                    icon: 'success',
                    width: '20rem',
                    heightAuto : true
                  }).then(
                    () => {
                      if(paginaDetalleEmpresa){
                        paginaDetalleEmpresa.classList.add('hide-loader');
                      }
                      if(card === 1){
                        this.img1 = this.base64
                        this.imgPrint1 = this.print
                        this.imgDesc1 = this.desc
                        this.imgDescEng1 = this.descIng
                      }else if(card === 2){
                        this.img2 = this.base64
                        this.imgPrint2 = this.print
                        this.imgDesc2 = this.desc
                        this.imgDescEng2 = this.descIng
                      }else if(card === 3){
                        this.img3 = this.base64
                        this.imgPrint3 = this.print
                        this.imgDesc3 = this.desc
                        this.imgDescEng3 = this.descIng
                      }else if(card === 4){
                        this.img4 = this.base64
                        this.imgPrint4 = this.print
                        this.imgDesc4 = this.desc
                        this.imgDescEng4 = this.descIng
                      }
                      this.base64 = ""
                      this.print = false
                      this.cardSeleccionada = 0
                      this.tituloSeleccion = ""
                      this.desc = ""
                      this.descIng = ""
                    }
                  )
                }
              }
            )
          }
        })

  }
}
