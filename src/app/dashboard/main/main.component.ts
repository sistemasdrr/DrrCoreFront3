import { PendingTask, ObservedTickets, PendingTaskByUser, PendingTaskByUserDetails, PendingTaskSupervisor } from './../../models/pedidos/ticket';
import { TicketService } from 'app/services/pedidos/ticket.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTooltip,
  ApexPlotOptions,
  ApexDataLabels,
  ApexYAxis,
  ApexXAxis,
  ApexLegend,
  ApexResponsive,
  ApexFill,
  ApexStroke,
  ApexGrid,
  ApexTitleSubtitle,
  ApexStates,
  ApexNonAxisChartSeries
  
} from 'ng-apexcharts';
import { Router } from '@angular/router';
import { DashboardService } from 'app/services/Dashboard/dashboard.service';
import { SeriesDashboard } from 'app/models/dashboard';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { ConsultaService } from 'app/services/Consultas/consulta.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Pais } from 'app/models/combo';
import { map, Observable, startWith } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ComboService } from 'app/services/combo.service';
//import { EChartOption } from 'echarts';
//import { EChartsOption } from 'echarts';


export interface DistinctSupervisor{
  code : string
  name : string
  details : string
}
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  colors: string[];
  legend: ApexLegend;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  states: ApexStates;
  fill: ApexFill;
};
export type ChartOptionsCircle = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend:ApexLegend;
  dataLabels:ApexDataLabels;
};

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    standalone: false
})
export class MainComponent implements OnInit {

  loading = false

  numPendingTask = 0
  pendingTask : PendingTask[] = []
  pendingTaskStr = ""
  dailyProduction = 0
  monthlyProduction = 0
  observedTickets : ObservedTickets[] = []
  observedTicketsStr = ""
  iconoSeleccionado: string = ""
  idUser = ''
  idEmployee = 0

  supervisorSeleccionado = ""
  empresasConInformes=0
  empresasSinInformes=0
  empresasEliminadas=0
  empresasCalidadA=0
  empresasCalidadB=0
  empresasCalidadC=0
  empresasCalidadD=0
  empresasSinCalidad=0
  totalOR=0
  totalRV=0
  totalEF=0
  totalGeneral=0

 // pie_chart: EChartOption={}
  pendingTaskSupervisor : PendingTaskSupervisor[] = []
  pendingTaskPersonalSelected : PendingTaskByUser[] = []
  pendingTaskAgent : PendingTaskByUser[] = []
  pendingTaskReporter : PendingTaskByUser[] = []
  pendingTaskReferences : PendingTaskByUser[] = []
  pendingTaskTypist : PendingTaskByUser[] = []
  pendingTaskTranslator : PendingTaskByUser[] = []

  public areaChartOptions!: Partial<ChartOptions>;
  public barChartOptions!: Partial<ChartOptions>;
  public smallBarChart!: Partial<ChartOptions>;
  public smallAreaChart!: Partial<ChartOptions>;
  public smallColumnChart!: Partial<ChartOptions>;
  public smallLineChart!: Partial<ChartOptions>;
  public chartOptions: Partial<ChartOptionsCircle>;

  public sampleData = [
    31, 40, 28, 44, 60, 55, 68, 51, 42, 85, 77, 31, 40, 28, 44, 60, 55,
  ];

  breadscrums = [
    {
      title: 'Dashboard',
      items: ['Home'],
      active: 'Dashboard',
    },
  ];
  paises: Pais[] = []
  controlPaises = new FormControl<string | Pais>('')
  idCountry: number=0;
  filterPais: Observable<Pais[]>
  paisSeleccionado: Pais = {
    id: 0,
    valor: '',
    abreviation: '',
    bandera: '',
    regtrib: '',
    codCel: '',
  }
  msgPais = ""
  colorMsgPais = ""

  constructor(private comboService : ComboService,private consultaService : ConsultaService, private router: Router, private dashboardService : DashboardService) {
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    this.filterPais = new Observable<Pais[]>()
    if(auth){
      this.idUser = auth.idUser
      this.idEmployee = parseInt(auth.idEmployee)
    }
    this.chartOptions={}
  }

  tipo = "RP"

  ngOnInit() {
    this.areaChartOptions={};
   
    this.comboService.getPaises().subscribe(
      (response) => {
        if(response.isSuccess === true){
          this.paises = response.data
        }
      }
    )
    this.dashboardService.PendingTask(this.idUser).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.pendingTask = response.data
          this.pendingTask.forEach(element => {
            this.numPendingTask += element.count
            if(element == this.pendingTask[this.pendingTask.length-1]){
              this.pendingTaskStr += element.asignedTo + '→' + element.count
            }else{
              this.pendingTaskStr += element.asignedTo + '→' + element.count + ' || '
            }
          })
        }
      }
    )
    this.dashboardService.DailyProduction(this.idUser).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.dailyProduction = response.data
        }
      }
    )
    this.dashboardService.MonthlyProduction(this.idUser).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.monthlyProduction = response.data
        }
      }
    )
    this.dashboardService.GetPendingTaskByUser(this.idUser).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.pendingTaskSupervisor = response.data


        }
      }
    ).add(
      () => {
        this.supervisorSeleccionado = this.pendingTaskSupervisor[0].code

        if(this.pendingTaskSupervisor.length === 1){
          this.pendingTaskReporter = this.pendingTaskSupervisor[0].details.filter(x => x.type === "RP")
          this.pendingTaskReferences = this.pendingTaskSupervisor[0].details.filter(x => x.type === "RF")
          this.pendingTaskAgent = this.pendingTaskSupervisor[0].details.filter(x => x.type === "AG")
          this.pendingTaskTypist = this.pendingTaskSupervisor[0].details.filter(x => x.type === "DI")
          this.pendingTaskTranslator = this.pendingTaskSupervisor[0].details.filter(x => x.type === "TR")
        }else if(this.pendingTaskSupervisor.length > 1){
          this.supervisorSeleccionado = this.pendingTaskSupervisor[0].code
          this.pendingTaskPersonalSelected = this.pendingTaskSupervisor[0].details
          this.pendingTaskReporter = this.pendingTaskPersonalSelected.filter(x => x.type === "RP")
          this.pendingTaskReferences = this.pendingTaskPersonalSelected.filter(x => x.type === "RF")
          this.pendingTaskAgent = this.pendingTaskPersonalSelected.filter(x => x.type === "AG")
          this.pendingTaskTypist = this.pendingTaskPersonalSelected.filter(x => x.type === "DI")
          this.pendingTaskTranslator = this.pendingTaskPersonalSelected.filter(x => x.type === "TR")
        }

        if(this.pendingTaskReporter.length > 0){
          this.tipo = "RP"
        }else if(this.pendingTaskReferences.length > 0){
          this.tipo = "RF"
        }else if(this.pendingTaskAgent.length > 0){
          this.tipo = "AG"
        }else if(this.pendingTaskTypist.length > 0){
          this.tipo = "DI"
        }else if(this.pendingTaskTranslator.length > 0){
          this.tipo = "TR"
        }
      }
    )

    this.dashboardService.ObservedTickets(this.idEmployee).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.observedTickets = response.data
          this.observedTickets.forEach(element => {
            if(element == this.observedTickets[this.observedTickets.length-1]){
              this.observedTicketsStr += element.asignedTo + '→' + element.ticket
            }else{
              this.observedTicketsStr += element.asignedTo + '→' + element.ticket + ' || '
            }
          })
        }
      }
    ).add(
      () => {

    this.chart2Rel()
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
  private _filterPais(description: string): Pais[] {
    const filterValue = description.toLowerCase();
    return this.paises.filter(pais => pais.valor.toLowerCase().includes(filterValue));
  }
  sumPedidos(pendingTask : PendingTaskByUser[]) : number {
    let value = 0
    pendingTask.forEach(element => {
      value += element.details.length
    });
    return value
  }
  selectSupervisor(code : string,type:string){

    this.dataSource1.data = []
    this.dataSource2.data = []
    this.dataSource3.data = []
    this.dataSource4.data = []
    this.dataSource5.data = []
    const personal = this.pendingTaskSupervisor.filter(x => x.code === code)[0]
    console.log(personal)
      this.pendingTaskPersonalSelected = personal.details
      this.pendingTaskReporter = this.pendingTaskPersonalSelected.filter(x => x.type === "RP")
      this.pendingTaskReferences = this.pendingTaskPersonalSelected.filter(x => x.type === "RF")
      this.pendingTaskAgent = this.pendingTaskPersonalSelected.filter(x => x.type === "AG")
      this.pendingTaskTypist = this.pendingTaskPersonalSelected.filter(x => x.type === "DI")
      this.pendingTaskTranslator = this.pendingTaskPersonalSelected.filter(x => x.type === "TR")
  }
  redirigir(){
    this.router.navigate(['/pedidos/asignacion-empleados']);
  }
  produccionDiaria(){
    this.router.navigate(['/dashboard/produccion/diaria']);
  }
  produccionMensual(){
    this.router.navigate(['/dashboard/produccion/mensual']);
  }
  cuponesObservados(){
    this.router.navigate(['/dashboard/cupones-observados']);
  }
  
  
  async cambioPais(pais: Pais) {
    if (pais !== null) {
      if (typeof pais === 'string' || pais === null || this.paisSeleccionado.id === 0) {
        this.msgPais = "Seleccione una opción."
        this.colorMsgPais = "red"
        this.iconoSeleccionado = ""
        this.idCountry = 0

      } else {
        this.msgPais = "Opción Seleccionada"
        this.colorMsgPais = "blue"
        this.iconoSeleccionado = pais.bandera
        this.idCountry = pais.id
        this.dashboardService.GetStaticsByCountryDto(this.idCountry).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.empresasConInformes=response.data.conInforme
              this.empresasCalidadA=response.data.a
              this.empresasCalidadB=response.data.b
              this.empresasCalidadC=response.data.c
              this.empresasCalidadD=response.data.d
              this.empresasSinCalidad=response.data.sinQ
              this.empresasSinInformes=response.data.sinInforme
              this.empresasEliminadas=response.data.eliminado
              this.armarPie();

            }
          }
        ).add(
          () => {
          }
        )


      }
    } else {
      this.idCountry = 0

      this.msgPais = "Seleccione una opción."
      this.colorMsgPais = "red"
    }
  }
  limpiarSeleccionPais() {
    this.controlPaises.reset();
    this.idCountry = 0
    this.iconoSeleccionado = ""

  }
  seriesDashboard : SeriesDashboard[] = []
  private chart2Rel() {
   
    this.dashboardService.SeriesDashboard().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.seriesDashboard[0] = response.data
          this.totalOR=response.data.totalOR
          this.totalRV=response.data.totalRV
          this.totalEF=response.data.totalEF
          this.totalGeneral=response.data.totalGeneral
          console.log(response.data)
          console.log(this.seriesDashboard[0])
        }
      }
    ).add(
      () => {
        this.barChartOptions = {
          series: this.seriesDashboard[0].series,
          chart: {
            type: 'bar',
            height: 450,
            stacked: true,
            foreColor: '#000000'
           
          },
          colors: ['#3A9413','#229cf7', '#f43f5e','#F5C42B'],
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },
          stroke: {
            width: 0,

            colors: ['#fff'],
          },
          xaxis: {
            categories: this.seriesDashboard[0].categories,

            labels: {
             
            },
          },
          yaxis: {
            title: {
              text: undefined,
            },
          },
          grid: {
            show: true,
            borderColor: '#9aa0ac',
            strokeDashArray: 1,
          },
          tooltip: {
            theme: 'dark',
            marker: {
              show: true,
            },
            y: {
             
            },
          },
          fill: {
            opacity: 1,
          },
          legend: {
            position: 'top',
            horizontalAlign: 'center',
            offsetX: 40,
            fontSize:'18px',
            fontWeight:'bold'
          },
          dataLabels: {
            style: {
              fontSize: '20px',
              fontWeight: 'bold',
              colors:['#fff'],
            },
            background: {
              enabled: false,
              foreColor: '#fff',
              borderRadius: 2,
              padding: 4,
              opacity: 0.9,
              borderWidth: 1,
              borderColor: '#fff'
            },
          },
        };
      }
    )

  }

  columnsToDisplay1 : string[] = ['number','requestedName','country','orderDate','expireDate','acciones']
  dataSource1 = new MatTableDataSource<PendingTaskByUserDetails>;
  dataSource2 = new MatTableDataSource<PendingTaskByUserDetails>;
  dataSource3 = new MatTableDataSource<PendingTaskByUserDetails>;
  dataSource4 = new MatTableDataSource<PendingTaskByUserDetails>;
  dataSource5 = new MatTableDataSource<PendingTaskByUserDetails>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  closeSlider(nav: MatSidenav) {
    nav.close();
  }
  taskClick(task: PendingTaskByUser, nav: MatSidenav): void {
    if(task.type == "RP"){
      this.dataSource1.data = task.details
      this.dataSource1.sort = this.sort
    }else if(task.type == "AG"){
      this.dataSource2.data = task.details
      this.dataSource2.sort = this.sort
    }else if(task.type == "RF"){
      this.dataSource5.data = task.details
      this.dataSource5.sort = this.sort
    }else if(task.type == "DI"){
      this.dataSource3.data = task.details
      this.dataSource3.sort = this.sort
    }else if(task.type == "TR"){
      this.dataSource4.data = task.details
      this.dataSource4.sort = this.sort
    }
    nav.open();
  }
    displayPais(pais: Pais): string {
    return pais && pais.valor ? pais.valor : '';
  }

  enviarAlerta(idTicket : number){
    Swal.fire({
      title: '¿Está seguro de enviar una alerta?',
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
        this.consultaService.SendTicketAlert(idTicket,parseInt(this.idUser)).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.loading = false
              Swal.fire({

                title : 'Se realizo correctamente el envio.',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              });
            }else{
              this.loading = false
              Swal.fire({
                title : 'Error al realizar la solicitud',
                icon : 'success',
                width: '20rem',
                heightAuto : true
              });
            }
          },(error) => {
            this.loading = false
            Swal.fire({
              text : error,
              icon : 'success',
              width: '20rem',
              heightAuto : true
            });
          }
        )


      }
    });
  }
  armarPie(){
    this.chartOptions = {
      series: [ this.empresasCalidadA,
       this.empresasCalidadB,
       this.empresasCalidadC,
       this.empresasCalidadD,
       this.empresasSinCalidad],
      chart: {
        width: 300,
        type: "pie"
      },
      labels: ["A", "B", "C", "D", "Sin Calidad"],
      legend: {
        show: true,
        position: "bottom"
      },
      dataLabels: {
        style: {
          fontSize: '20px',
          fontWeight: 'bold',
          colors:['#000000'],
        },
        background: {
          enabled: false,
          foreColor: '#fff',
          borderRadius: 2,
          padding: 4,
          opacity: 0.9,
          borderWidth: 1,
          borderColor: '#fff'
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              show: true,
              position: "bottom"
            }
          }
        }
      ]
    };


}
}
