import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { ActivatedRoute } from '@angular/router';
import { dA } from '@fullcalendar/core/internal-common';
import { ComboData } from 'app/models/combo';
import { Pais } from 'app/models/combo';
import { PrecioAgente } from 'app/models/mantenimiento/agente';
import { ComboService } from 'app/services/combo.service';
import { AgenteService } from 'app/services/mantenimiento/agente.service';
import { Observable, map, startWith } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-agregar-editar',
    templateUrl: './agregar-editar.component.html',
    styleUrls: ['./agregar-editar.component.scss'],
    standalone: false
})
export class AgregarEditarAgenteComponent implements OnInit {
  titulo = ""
  accion = ""

  //FORM
  id = 0
  idAgent = 0
  date = ""
  dateD : Date | null = null
  idContinent = 0
  idCountry = 0
  countryPrecio : Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',
  }
  idCurrency = 0
  priceT1 = 0
  dayT1 = 0
  priceT2 = 0
  dayT2 = 0
  priceT3 = 0
  dayT3 = 0
  pricePN = 0
  dayPN = 0
  priceBD = 0
  dayBD = 0
  priceRP = 0
  dayRP = 0
  priceCR = 0
  dayCR = 0

  continentes : ComboData[] = []

  controlPaises = new FormControl<string | Pais>('')
  paises: Pais[] = []
  filterPais: Observable<Pais[]>
  msgPais = ""
  colorMsgPais = ""
  iconoSeleccionado = ""

  modelo : PrecioAgente[] = []

  constructor( private activatedRoute: ActivatedRoute, private agenteService : AgenteService,public dialogRef: MatDialogRef<AgregarEditarAgenteComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private comboService : ComboService){
    if(data){
      this.id = data.id
      this.idAgent = data.idAgent
    }
    this.filterPais = new Observable<Pais[]>
  }
  ngOnInit(): void {
    this.comboService.getContinentes().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.continentes = response.data
        }
      }
    )
    if(this.id !== 0){
      this.agenteService.getPrecioPorId(this.id).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            if(response.data.date !== null && response.data.date !== ""){
              const date = response.data.date.split("/")
              if(date.length > 0){
                this.dateD = new Date(parseInt(date[2]), parseInt(date[1]) - 1, parseInt(date[0]))
                this.date = response.data.date
              }
            }
            this.idAgent = response.data.idAgent
            this.idCurrency = response.data.idCurrency
            this.idContinent = response.data.idContinent
            if(response.data.idCountry !== null && response.data.idCountry !== 0){
              this.comboService.getPaisesPorContinente(this.idContinent).subscribe(
                (response) => {
                  if(response.isSuccess === true && response.isWarning === false){
                    this.paises = []
                    this.paises = response.data
                    console.log(response.data)
                    this.limpiarSeleccionPais()
                  }
                }
              ).add(
                () => {
                  console.log(response.data.idCountry)
                  this.countryPrecio = this.paises.filter(x => x.id === response.data.idCountry)[0]
                  console.log(this.countryPrecio)
                  this.idCountry = response.data.idCountry
                }
              )
            }
            this.idCountry =
            this.dayT1 = response.data.dayT1
            this.dayT2 = response.data.dayT2
            this.dayT3 = response.data.dayT3
            this.priceT1 = response.data.priceT1
            this.priceT2 = response.data.priceT2
            this.priceT3 = response.data.priceT3
            this.priceBD = response.data.priceBD
            this.priceCR = response.data.priceCR
            this.pricePN = response.data.pricePN
            this.priceRP = response.data.priceRP
            this.dayBD = response.data.dayBD
            this.dayCR = response.data.dayCR
            this.dayPN = response.data.dayPN
            this.dayRP = response.data.dayRP
          }
        }
      ).add(
        () => {

        }
      )
    }
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
  cambioPais(pais: Pais) {
    console.log(pais)
    if (typeof pais === 'string' || pais === null || this.countryPrecio.id === 0) {
      this.msgPais = "Seleccione una opción."
      this.colorMsgPais = "red"
      this.iconoSeleccionado = ""
      this.idCountry = 0
    } else {
      this.msgPais = "Opción Seleccionada"
      this.colorMsgPais = "blue"
      this.iconoSeleccionado = pais.bandera
      this.idCountry = pais.id
    }
    console.log(this.idCountry)
  }
  limpiarSeleccionPais() {
    this.controlPaises.reset();
    this.idCountry = 0
    this.iconoSeleccionado = ""
  }
  selectFecha(event: MatDatepickerInputEvent<Date>) {
    this.dateD = event.value!
    const selectedDate = event.value;
    if (selectedDate) {
      this.date = this.formatDate(selectedDate);
    }
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }
  selectContinente(idContinent : number){
    this.comboService.getPaisesPorContinente(this.idContinent).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.paises = []
          this.paises = response.data
          console.log(response.data)
          this.limpiarSeleccionPais()
        }
      }
    )
  }
  armarModelo(){
    this.modelo[0] = {
      id : this.id,
      idAgent : this.idAgent,
      date : this.date,
      idContinent : this.idContinent,
      idCountry : this.idCountry,
      idCurrency : this.idCurrency,
      priceT1 : this.priceT1,
      priceT2 : this.priceT2,
      priceT3 : this.priceT3,
      priceBD : this.priceBD,
      priceCR : this.priceCR,
      pricePN : this.pricePN,
      priceRP : this.priceRP,
      dayT1 : this.dayT1,
      dayT2 : this.dayT2,
      dayT3 : this.dayT3,
      dayBD : this.dayBD,
      dayCR : this.dayCR,
      dayPN : this.dayPN,
      dayRP : this.dayRP,
    }
  }
  guardar(){
    this.armarModelo()
    console.log(this.modelo[0])
    if(this.id === 0){
      Swal.fire({
        title: '¿Está seguro de agregar este registro?',
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

          this.agenteService.addOrUpdatePrice(this.modelo[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title :'',
                  text : 'El registro se agregó correctamente.',
                  icon : 'success',
                  width: '30rem',
                  heightAuto : true
                }).then(() => {
                  this.dialogRef.close()
                });
              }
            }
          )
        }
      })
    }else{
      Swal.fire({
        title: '¿Está seguro de modificar este registro?',
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
          this.agenteService.addOrUpdatePrice(this.modelo[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title :'',
                  text : 'El registro se modificó correctamente.',
                  icon : 'success',
                  width: '30rem',
                  heightAuto : true
                }).then(() => {
                  this.dialogRef.close()
                });
              }
            }
          )
        }
      })
    }
  }
  salir(){
    this.dialogRef.close()
  }
}
