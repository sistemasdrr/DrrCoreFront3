
import { Component, Inject, Output, EventEmitter,  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { TraduccionData } from 'app/models/dialog-data';

@Component({
  selector: 'app-traduccion-dialog',
  templateUrl: './traduccion-dialog.component.html',
  styleUrls: ['./traduccion-dialog.component.scss']
})
export class TraduccionDialogComponent{

  empresa : string = ''
  //ENVIO DE COMENTARIO
  @Output()
  eventEnviarComentario = new EventEmitter<string>();
  comentario_es : string = ""
  comentario_en : string = ""

  titulo : string
  subtitulo : string

  listaClinton1 = false
  text1 = '\n\nDebemos indicar que la presente Empresa investigada, SI APARECE EN LA LISTA CLINTON (Listado de empresas vinculadas al terrorismo y narcotráfico, publicado por la Oficina de Control de Activos Extranjeros del Departamento de Tesoro de Estados Unidos de N.A.'
  textEng1 = '\n\nPlease be advised  that the investigated company appears in the list of companies linked to terrorism and drug trafficking published by OFAC, Office of Foreign Assets Control of the United States Department of the Treasury (Clinton List).'
  listaClinton2 = false
  text2 = '\n\nDebemos indicar que la presente Empresa investigada, NO APARECE EN LA LISTA CLINTON (Listado de empresas vinculadas al terrorismo y narcotráfico, publicado por la Oficina de Control de Activos Extranjeros del Departamento de Tesoro de Estados Unidos de N.A.'
  textEng2 = '\n\nPlease be advised  that the investigated company DOES NOT appear in the list of companies linked to terrorism and drug trafficking published by OFAC, Office of Foreign Assets Control of the United States Department of the Treasury (Clinton List).'

  tipo : string = ""
  constructor(
    public dialogRef: MatDialogRef<TraduccionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TraduccionData) {
    this.titulo = this.data.titulo
    this.subtitulo = this.data.subtitulo
    this.tipo = this.data.tipo
    console.log(this.tipo)
    this.comentario_es = this.data.comentario_es ?? ''
    this.comentario_en = this.data.comentario_en ?? ''
    if(this.tipo !== 'ckeditor'){

      if(this.comentario_es.includes(this.text1)) this.listaClinton1 = true;
      if(this.comentario_es.includes(this.text2)) this.listaClinton2 = true;
    }

  }
  realizarEnvio() {
    this.dialogRef.close({
      comentario_es: this.comentario_es,
      comentario_en: this.comentario_en,
     });
  }
  //CKEDITOR
  public Editor: any = ClassicEditor;

  editorInstance1: any;
  editorInstance2: any;

  onKeydown1(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault(); 

      if (this.editorInstance1) {
        const selection = this.editorInstance1.model.document.selection;
        const tabCharacter = '    ';

        this.editorInstance1.model.change((writer: any) => {
          writer.insertText(tabCharacter, selection.getFirstPosition());
        });
      }
    }
  }
  onEditorReady1(editor: any): void {
    this.editorInstance1 = editor;
  }
  onKeydown2(event: KeyboardEvent): void {
    if (event.key === 'Tab') {
      event.preventDefault();

      if (this.editorInstance2) {
        const selection = this.editorInstance2.model.document.selection;
        const tabCharacter = '    ';

        this.editorInstance2.model.change((writer: any) => {
          writer.insertText(tabCharacter, selection.getFirstPosition());
        });
      }
    }
  }
  onEditorReady2(editor: any): void {
    this.editorInstance2 = editor;
  }
  ListaClinton1(lista : boolean){
    if(lista === true){
      if(this.comentario_es.includes(this.text2)){
        this.comentario_es = this.comentario_es.replace(this.text2, '')
        this.comentario_en = this.comentario_en.replace(this.textEng2, '')
      }
      this.comentario_es = this.comentario_es + this.text1
      this.comentario_en = this.comentario_en + this.textEng1
      this.listaClinton2 = false
    }else{
      if(this.comentario_es.includes(this.text1)){
        this.comentario_es = this.comentario_es.replace(this.text1, '')
        this.comentario_en = this.comentario_en.replace(this.textEng1, '')
      }
    }
  }
  ListaClinton2(lista : boolean){
    if(lista === true){
      if(this.comentario_es.includes(this.text1)){
        this.comentario_es = this.comentario_es.replace(this.text1, '')
        this.comentario_en = this.comentario_en.replace(this.textEng1, '')
      }
      this.comentario_es = this.comentario_es + this.text2
      this.comentario_en = this.comentario_en + this.textEng2
      this.listaClinton1 = false
    }else{
      if(this.comentario_es.includes(this.text2)){
        this.comentario_es = this.comentario_es.replace(this.text2, '')
        this.comentario_en = this.comentario_en.replace(this.textEng2, '')
      }
    }
  }

  cerrarDialog(){
    this.dialogRef.close()
  }
}
