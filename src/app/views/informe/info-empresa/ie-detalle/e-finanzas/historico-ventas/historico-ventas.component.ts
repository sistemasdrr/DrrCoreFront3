import { Component, Inject, OnInit } from '@angular/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ComboData } from 'app/models/combo';
import { HistoricoVentas } from 'app/models/informes/empresa/situacion-financiera';
import { ComboService } from 'app/services/combo.service';
import { FinanzasService } from 'app/services/informes/empresa/finanzas.service';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { er } from '@fullcalendar/core/internal-common';

@Component({
    selector: 'app-historico-ventas',
    templateUrl: './historico-ventas.component.html',
    styleUrls: ['./historico-ventas.component.scss'],
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
export class HistoricoVentasComponent implements OnInit {

  accion = ""
  titulo = ""
  separator = ','
  id = 0
  idCompany = 0
  idMoneda = 0
  fecha : string = ""
  fechaD : Date = new Date()
  ventas = 0
  tc = 0
  equivaleDolar = 0
  modelo : HistoricoVentas[] = []

  ctrlMoneda = new FormControl<string | ComboData>('');

  listaMonedas : ComboData[] = []
  filteredMoneda: Observable<ComboData[]>;

  monedaInforme : ComboData =  {
    id : 0,
    valor  : '',
  }

  constructor(private finanzasService : FinanzasService, private comboService : ComboService,private toastr: ToastrService, public dialogRef: MatDialogRef<HistoricoVentasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ){
    this.filteredMoneda = new Observable<ComboData[]>()

  }

  ngOnInit(): void {
    this.comboService.getTipoMoneda().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.listaMonedas = response.data
        }
      }
    ).add(
      () => {
        this.id = this.data.id
        this.idCompany = this.data.idCompany
        if(this.id === 0){
          this.titulo = "Agregar Historico de Venta"

        }else{
          this.titulo = "Editar Historico de Venta"
          this.finanzasService.getHistoricoVenta(this.id).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning ===false){
                const historicoVenta = response.data
                if(historicoVenta !== null){
                  this.idMoneda = historicoVenta.idCurrency
                  this.monedaInforme = this.listaMonedas.filter(x => x.id === this.idMoneda)[0]
                  this.ventas = historicoVenta.amount
                  this.tc = historicoVenta.exchangeRate
                  this.equivaleDolar = historicoVenta.equivalentToDollars
                  this.fechaD = new Date(historicoVenta.date)

                }
              }
            }
          )
        }
      }
    )
    this.filteredMoneda = this.ctrlMoneda.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.valor;
        return name ? this._filter(name as string) : this.listaMonedas.slice();
      }),
    );
  }
  private _filter(name: string): ComboData[] {
    return this.listaMonedas.filter(x => x.valor.toLowerCase().includes(name.toLowerCase()));
  }
  selectMoneda(data : ComboData){
    console.log(data)
    if (data !== null) {
      if (typeof data === 'string' || data === null) {
        this.idMoneda = 0
      } else {
        this.idMoneda = data.id
      }
    } else {
      this.idMoneda = 0
    }
    console.log(this.idMoneda)
  }
  displayFn(data: ComboData): string {
    return data && data.valor ? data.valor : '';
  }
  limpiarSeleccion(){
    this.ctrlMoneda.reset();
    this.idMoneda = 0
  }
  selectFecha(event: MatDatepickerInputEvent<Date>) {
    this.fechaD = event.value!;
    if (moment.isMoment(this.fechaD)) {
      this.fecha = this.formatDate(this.fechaD);
    }
  }

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
  armarModelo(){
    this.modelo[0] = {
      id : this.id,
      idCompany : this.idCompany,
      idCurrency : this.idMoneda,
      date : new Date(this.fechaD),
      amount : this.ventas,
      exchangeRate : this.tc,
      equivalentToDollars : this.equivaleDolar
    }
  }
  actualizarCampo(){
    if(this.ventas !== 0 && this.tc !== 0){
      this.equivaleDolar = this.ventas / this.tc
      this.equivaleDolar = parseFloat(this.equivaleDolar.toFixed(2));
    }
  }
  guardar(){
    this.armarModelo()
    console.log(this.modelo[0])
    if(this.id > 0){
    
          const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.remove('hide-loader');
          }
          this.finanzasService.addOrUpdateHistoricoVentas(this.modelo[0]).subscribe((response) => {
          if(response.isSuccess === true && response.isWarning === false){
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
              this.showSuccess('Se guardó con éxito')
              this.dialogRef.close()
           
          }else{
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
              this.showError('Comunicarse con sistemas')
              this.dialogRef.close()
           
          }
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.add('hide-loader');
          }
       
      },(error)=>{
        if(paginaDetalleEmpresa){
          paginaDetalleEmpresa.classList.add('hide-loader');
        }
          this.showError('Comunicarse con sistemas')
      });
    }else{    

          const paginaDetalleEmpresa = document.getElementById('pagina-detalle-empresa') as HTMLElement | null;
          if(paginaDetalleEmpresa){
            paginaDetalleEmpresa.classList.remove('hide-loader');
          }
          this.finanzasService.addOrUpdateHistoricoVentas(this.modelo[0]).subscribe((response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.showSuccess('Se guardó con éxito')
                this.dialogRef.close()
              
            }else{
              if(paginaDetalleEmpresa){
                paginaDetalleEmpresa.classList.add('hide-loader');
              }
                this.showError('Comunicarse con sistemas')
                this.dialogRef.close()
             
            }
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            console.log(response)
          }, (error) => {
            if(paginaDetalleEmpresa){
              paginaDetalleEmpresa.classList.add('hide-loader');
            }
            this.showError('Comunicarse con sistemas')
              this.dialogRef.close()
            
         
      });
    }
  }
  salir(){
    this.dialogRef.close()
  }
  showSuccess(message: string) {
    this.toastr.success(message,'Operación Exitosa!!');
  }
  showError(message: string) {
    this.toastr.error(message,'Ocurrió un error!!');
  }
}
