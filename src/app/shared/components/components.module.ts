import { NgModule } from "@angular/core";
import { FileUploadComponent } from "./file-upload/file-upload.component";
import { BreadcrumbComponent } from "./breadcrumb/breadcrumb.component";
import { SharedModule } from "../shared.module";
import { MatRadioModule } from '@angular/material/radio';
import { AdjuntarArchivosComponent } from './adjuntar-archivos/adjuntar-archivos.component';
import { ComentarioComponent } from './comentario/comentario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { TraduccionDialogComponent } from './traduccion-dialog/traduccion-dialog.component';
import { MatSelectModule } from "@angular/material/select";
import { MatListModule } from "@angular/material/list";
import { CuadroImpoExpoComponent } from './cuadro-impo-expo/cuadro-impo-expo.component';
import { AgregarEditarComponent } from './cuadro-impo-expo/agregar-editar/agregar-editar.component';
import { NgScrollbarModule } from "ngx-scrollbar";
import { FeatherIconsModule } from "./feather-icons/feather-icons.module";
import { VerPdfComponent } from './ver-pdf/ver-pdf.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxMaskDirective, NgxMaskPipe } from "ngx-mask";

@NgModule({
  declarations: [
    FileUploadComponent,
    BreadcrumbComponent,
    AdjuntarArchivosComponent,
    ComentarioComponent,
    TraduccionDialogComponent,
    CuadroImpoExpoComponent,
    AgregarEditarComponent,
    VerPdfComponent,
  ],
  imports: [
    SharedModule,
    MatRadioModule,
    FormsModule,
    CKEditorModule,
    MatSelectModule,
    MatListModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    FeatherIconsModule,
    PdfViewerModule,
    NgxMaskPipe,
    NgxMaskDirective,
  ],
  exports: [
    FileUploadComponent,
    BreadcrumbComponent,
    ComentarioComponent,
    CuadroImpoExpoComponent,
    TraduccionDialogComponent,
    AgregarEditarComponent,
    VerPdfComponent
  ],
})
export class ComponentsModule {}
