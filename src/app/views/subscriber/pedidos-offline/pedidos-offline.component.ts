import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { Pais } from 'app/models/combo';
import { Precio } from 'app/models/mantenimiento/abonado';
import { Ticket } from 'app/models/pedidos/ticket';
import { ComboService } from 'app/services/combo.service';
import { DatosEmpresaService } from 'app/services/informes/empresa/datos-empresa.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import { TicketService } from 'app/services/pedidos/ticket.service';
import { Observable, map, startWith } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-pedidos-offline',
    templateUrl: './pedidos-offline.component.html',
    styleUrls: ['./pedidos-offline.component.scss'],
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
export class PedidosOfflineComponent implements OnInit {

  breadscrums = [
    {
      title: 'Solicitud de Pedido Offline',
      subtitle: '',
      codigoInforme : '',
      usuario : '',
      items: ['Pedidos'],
      active: 'Offline',
    },
  ];

  listaPrecio : Precio[] = [
    {
      name : "T1",
      price : 0,
      days : 0
    },
    {
      name : "T2",
      price : 0,
      days : 0
    },
    {
      name : "T3",
      price : 0,
      days : 0
    },
  ]

  modeloNuevo : Ticket[] = []
  modeloModificado : Ticket[] = []

  subscriberName = ""
  subscriberCode = ""
  idCountrySubscriber = 0
  subscriberFlag = ""

  //TICKET
  id = 0
  number = 0
  idSubscriber = 0
  revealName = false
  nameRevealed = ""
  referenceNumber = ""
  language = ""
  queryCredit = ""
  timeLimit = ""
  aditionalData = ""
  about = ""
  orderDate = ""
  indicacionesAbonado = ""
  orderDateD : Date = new Date()
  expireDate = ""
  expireDateD : Date = new Date()
  realExpireDate = ""
  realExpireDateD : Date = new Date()
  idContinent = 0
  idCountry = 0
  reportType = ""
  procedureType = ""
  idCompany = 0
  idPerson = 0
  busineesName = ""
  comercialName = ""
  taxType = ""
  taxCode = ""
  email = ""
  address = ""
  city = ""
  telephone = ""
  creditrisk = ""
  enable = true
  requestedName = ""
  precio = 0

  iconoSeleccionado = ""

  countryAbonado : Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',
  }

  msgPais = ""
  colorMsgPais = ""
  paisSeleccionado: Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',
  }

  controlPaises = new FormControl<string | Pais>('')
  paises: Pais[] = []
  filterPais: Observable<Pais[]>
  userFrom = ""

  constructor(private abonadoService : AbonadoService, private comboService : ComboService, private datosEmpresaService : DatosEmpresaService,
    private activatedRoute: ActivatedRoute, private router : Router,private ticketService : TicketService){
    this.filterPais = new Observable<Pais[]>()
    const subscriberUser = JSON.parse(localStorage.getItem('subscriberUser') || '{}')
    if(subscriberUser.id > 0){
      this.idSubscriber = parseInt(subscriberUser.id)
      console.log(this.idSubscriber)
    }
    const idCompany = this.activatedRoute.snapshot.paramMap.get('idCompany');
    if(idCompany !== null){
      this.idCompany = parseInt(idCompany)
    }else{
      this.idCompany = 0
    }
  }
  ngOnInit(): void {

    this.orderDateD = new Date()
    this.expireDateD = this.addDays(5,new Date(this.orderDateD));
    this.realExpireDateD = this.addDays(6,new Date(this.orderDateD));
    this.abonadoService.getAbonadoPorId(this.idSubscriber).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.subscriberName = response.data.name
          this.subscriberCode = response.data.code
          this.idCountrySubscriber = response.data.idCountry !== null || response.data.idCountry !== 0 ? response.data.idCountry : 0
          this.indicacionesAbonado = response.data.indications
        }
      }
    ).add(
      () => {
        if(this.idCountrySubscriber !== 0){
          this.comboService.getPaisById(this.idCountrySubscriber).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                this.subscriberFlag = response.data.bandera
              }
            }
          )
        }
        this.comboService.getPaises().subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.paises = response.data
            }
          }
        ).add(
          () => {
            if(this.idCompany > 0){
              this.datosEmpresaService.getDatosEmpresaPorId(this.idCompany).subscribe(
                (response) => {
                  if(response.isSuccess === true && response.isWarning === false){
                    this.busineesName = response.data.name
                    this.comercialName = response.data.socialName
                    this.taxType = response.data.taxTypeName
                    this.taxCode = response.data.taxTypeCode
                    this.email = response.data.email
                    this.address = response.data.address
                    this.city = response.data.place
                    this.telephone = response.data.telephone
                    this.requestedName = response.data.name

                    this.idCountry = response.data.idCountry
                  }
                }
              ).add(
                () => {
                  this.paisSeleccionado = this.paises.filter(x => x.id === this.idCountry)[0]
                }
              )
            }
          }
        )
      }
    )
    this.filterPais = this.controlPaises.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.valor
        return name ? this._filterPais(name as string) : this.paises.slice()
      }),
    )
  }
  cambioPais(pais: Pais) {
    if (pais !== null) {
      if (typeof pais === 'string' || pais === null || this.paisSeleccionado.id === 0) {
        this.msgPais = "Seleccione una opción."
        this.colorMsgPais = "red"
        this.iconoSeleccionado = ""
        this.idCountry = 0
      } else {
        this.msgPais = "Opción Seleccionada"
        this.colorMsgPais = "blue"
        this.iconoSeleccionado =pais.bandera
        this.idCountry = pais.id
      }
    } else {
      this.idCountry = 0
      console.log(this.idCountry)
      this.msgPais = "Seleccione una opción."
      this.colorMsgPais = "red"
    }
  }
  displayPais(pais: Pais): string {
    return pais && pais.valor ? pais.valor : '';
  }
  private _filterPais(description: string): Pais[] {
    const filterValue = description.toLowerCase();
    return this.paises.filter(pais => pais.valor.toLowerCase().includes(filterValue));
  }
  armarModeloNuevo(){
    this.modeloNuevo[0] = {
      id : this.id,
      number : this.number,
      idSubscriber : this.idSubscriber,
      revealName : this.revealName,
      nameRevealed : this.revealName === true ? this.nameRevealed : "",
      referenceNumber : this.referenceNumber,
      language : this.language,
      queryCredit : this.queryCredit,
      timeLimit : this.timeLimit,
      aditionalData : this.aditionalData,
      subscriberIndications : this.indicacionesAbonado,
      about : this.about,
      orderDate : this.orderDateD,
      expireDate :this.expireDateD,
      realExpireDate : this.realExpireDateD,
      idContinent : this.idContinent,
      idCountry : this.idCountry,
      reportType : this.reportType,
      procedureType : this.procedureType,
      idCompany : this.idCompany,
      idPerson : this.idPerson,
      busineesName : this.busineesName === null ? "" : this.busineesName,
      comercialName : this.comercialName === null ? "" : this.comercialName,
      taxType : this.taxType === null ? "" : this.taxType,
      taxCode : this.taxCode === null ? "" : this.taxCode,
      email : this.email === null ? "" : this.email,
      address :  this.address === null ? "" : this.address,
      city : this.city === null ? "" : this.city,
      telephone : this.telephone === null ? "" : this.telephone,
      creditrisk : 0,
      enable : true,
      requestedName : this.requestedName,
      price : this.precio,
      userFrom : this.subscriberCode,
      commentary : '',
      webPage : ''
    }
  }
  armarModeloModificado(){
    this.modeloModificado[0] = {
      id : this.id,
      number : this.number,
      idSubscriber : this.idSubscriber,
      revealName : this.revealName,
      nameRevealed : this.revealName === true ? this.nameRevealed : "",
      referenceNumber : this.referenceNumber,
      language : this.language,
      queryCredit : this.queryCredit,
      timeLimit : this.timeLimit,
      aditionalData : this.aditionalData,
      subscriberIndications : this.indicacionesAbonado,
      about : this.about,
      orderDate : new Date(this.orderDate),
      expireDate : new Date(this.expireDate),
      realExpireDate : new Date(this.realExpireDate),
      idContinent : this.idContinent,
      idCountry : this.idCountry,
      reportType : this.reportType,
      procedureType : this.procedureType,
      idCompany : this.idCompany,
      idPerson : this.idPerson,
      busineesName : this.busineesName === null ? "" : this.busineesName,
      comercialName : this.comercialName === null ? "" : this.comercialName,
      taxType : this.taxType === null ? "" : this.taxType,
      taxCode : this.taxCode === null ? "" : this.taxCode,
      email : this.email === null ? "" : this.email,
      address :  this.address === null ? "" : this.address,
      city : this.city === null ? "" : this.city,
      telephone : this.telephone === null ? "" : this.telephone,
      creditrisk : 0,
      enable : true,
      requestedName : this.requestedName,
      price : this.precio,
      userFrom : this.subscriberCode,
      commentary : '',
      webPage : ''
    }
  }
  limpiarSeleccionPais() {
    this.idCountry = 0
    this.iconoSeleccionado = ""
  }
  selectFecha1(event: MatDatepickerInputEvent<Date>) {

    this.orderDateD = event.value!
    const selectedDate = event.value;
    if (selectedDate) {
      this.expireDateD = this.addDays(5,new Date(this.orderDateD));
      this.realExpireDateD = this.addDays(6,new Date(this.orderDateD));
      this.orderDate = this.formatDate(new Date(selectedDate));
    }
  }
  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  }
  addDays(noOfDaysToAdd:number,orderDate:Date){
    let endDate : Date=new Date, count = 0;
    while(count < noOfDaysToAdd){
        endDate = new Date(orderDate.setDate(orderDate.getDate() + 1));
        if(endDate.getDay() != 0 && endDate.getDay() != 6){
           count++;
        }
    }
    return endDate;
  }
  mostrarBandera(){
    this.iconoSeleccionado = this.paises.filter(x => x.id === this.idCountry)[0].bandera
    this.abonadoService.getPreciosPorPais(this.idSubscriber,this.idContinent,this.idCountry).subscribe(
        (response) => {
          if(response.isSuccess === true && response.isWarning === false){
            this.listaPrecio = response.data
          }
        }
      )
  }
  volver(){
    this.router.navigate(['pedidos/lista']);
  }
  guardar(){
    if(this.id === 0){
      this.armarModeloNuevo()
      console.log(this.modeloNuevo[0])
      Swal.fire({
        title: '¿Está seguro de realizar este pedido?',
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
          const loader = document.getElementById('loader-detalle-cupon') as HTMLElement | null;
          if(loader){
            loader.classList.remove('hide-loader');
          }
          this.ticketService.addTicketByWeb(this.modeloNuevo[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title: 'El registro se guardo correctamente.',
                  text: '',
                  icon: 'success',
                  width: '30rem',
                  heightAuto: true
                }).then(() => {
                  this.router.navigate(['abonado/i/pedidos/offline']);
                })
                //this.id = response.data
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
      });
    }else{
      this.armarModeloModificado()
      console.log(this.modeloModificado[0])
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
          const loader = document.getElementById('loader-detalle-cupon') as HTMLElement | null;
          if(loader){
            loader.classList.remove('hide-loader');
          }
          this.ticketService.addTicket(this.modeloModificado[0]).subscribe(
            (response) => {
              if(response.isSuccess === true && response.isWarning === false){
                Swal.fire({
                  title: 'El registro se guardo correctamente.',
                  text: '',
                  icon: 'success',
                  width: '30rem',
                  heightAuto: true
                }).then(() => {
                  this.router.navigate(['abonado/i/pedidos/offline']);
                })
                //this.id = response.data
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
      });
    }

  }
}
