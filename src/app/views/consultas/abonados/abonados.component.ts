import { Component, OnInit, ViewChild } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Query1_1, Query1_10, Query1_11BySubscriber, Query1_11Subscriber, Query1_1ByMonth, Query1_2ByYear, Query1_3BySubscriber, Query1_4, Query1_4Country, Query1_4Procedure, Query1_4ReportType, Query1_4Subscriber, Query1_5, Query1_6, Query1_6ByIdSubscriber, Query1_7Tickets, Query1_8, Query1_9 } from 'app/models/consulta';
import { Abonado, AbonadoT } from 'app/models/mantenimiento/abonado';
import { ConsultaService } from 'app/services/Consultas/consulta.service';
import { AbonadoService } from 'app/services/mantenimiento/abonado.service';
import * as moment from 'moment';

@Component({
    selector: 'app-abonados',
    templateUrl: './abonados.component.html',
    styleUrls: ['./abonados.component.scss'],
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
export class AbonadosComponent implements OnInit{

  years : number[] = []

  breadscrums = [
    {
      title: 'Consultas de Abonados',
      items: ['Consultas'],
      active: 'Abonados',
    },
  ];

  loading = false

  idQuery = 1
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private consultaService : ConsultaService, private abonadoService : AbonadoService){

  }
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 15;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
    this.abonadoService.getAbonados('','','').subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.DTQuery1_3.data = response.data
          this.DTQuery1_3.sort = this.sort
          this.DTQuery1_3.paginator = this.paginator

        }
      },(error) => {

      }
    )
    this.consultaService.GetQuery1_4Subscribers().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.DTQuery1_4.data = response.data
          this.DTQuery1_4.sort = this.sort
          this.DTQuery1_4.paginator = this.paginator
        }
      }
    )
    this.consultaService.GetQuery1_6BySubscriber().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.DTQuery1_6_base = response.data
          this.DTQuery1_6.data = this.filterByDistinct(response.data)
          this.DTQuery1_6.sort = this.sort
          this.DTQuery1_6.paginator = this.paginator
        }
      }
    )
    this.abonadoService.getAbonados('','','A').subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.DTQuery1_7.data = response.data.filter(x => x.facturationType === 'CC')
          this.DTQuery1_7.sort = this.sort
          this.DTQuery1_7.paginator = this.paginator

          this.DTQuery1_10.data = response.data
          this.DTQuery1_10.sort = this.sort
          this.DTQuery1_10.paginator = this.paginator
        }
      }
    )
  }

  clear(){

  }

  //1
  query1_1_idSubscriber = 0
  query1_1_year = new Date().getFullYear();
  query1_1_month = 1
  query1_1_monthStr = ""

  query1_1TotalInformesAtendidos = 0

  query1_1OR = 0
  query1_1RV = 0
  query1_1EF = 0

  query1_1CostoTotal = 0

  query1_1totals : any = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
    total: 0
  };
  query1_1CalculateTotals(): void {
    this.query1_1totals = this.DTQuery1_1ByYear.data.reduce((acc, item) => {
      acc.january += item.january;
      acc.february += item.february;
      acc.march += item.march;
      acc.april += item.april;
      acc.may += item.may;
      acc.june += item.june;
      acc.july += item.july;
      acc.august += item.august;
      acc.september += item.september;
      acc.october += item.october;
      acc.november += item.november;
      acc.december += item.december;
      acc.total += item.total;
      return acc;
    }, {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      total: 0
    });
  }
  DTQuery1_1ByYear = new MatTableDataSource<Query1_1>()
  columnsQuery1_1ByYear : string[] = ['subscriberName','january','february','march','april','may','june','july','august','september','october','november','december','total','%']
  DTQuery1_1ByMonth = new MatTableDataSource<Query1_1ByMonth>()
  columnsQuery1_1ByMonth : string[] = ['requestedName','country','orderDate','dispatchDate','procedureType','reportType','price']


  searchQuery1_1ByYear(){
    this.loading = true
    this.consultaService.GetQuery1_1ByYear(this.query1_1_year).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){

          response.data.sort((a, b) => b.total - a.total);
          this.query1_1TotalInformesAtendidos = 0
          this.DTQuery1_1ByYear.data = response.data
          this.DTQuery1_1ByYear.paginator = this.paginator
          this.DTQuery1_1ByYear.sort = this.sort
          this.DTQuery1_1ByYear.data.forEach(element => {
            this.query1_1TotalInformesAtendidos+=element.total
          });
          this.query1_1CalculateTotals()
        }
      },(error) => {
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }
  monthToNumber(month : string) : number{
    if(month === 'january'){
      return 1
    }else if(month === 'february'){
      return 2
    }else if(month === 'march'){
      return 3
    }else if(month === 'april'){
      return 4
    }else if(month === 'may'){
      return 5
    }else if(month === 'june'){
      return 6
    }else if(month === 'july'){
      return 7
    }else if(month === 'august'){
      return 8
    }else if(month === 'september'){
      return 9
    }else if(month === 'october'){
      return 10
    }else if(month === 'november'){
      return 11
    }else if(month === 'december'){
      return 12
    }else{
      return 0
    }
  }
  searchQuery1_1ByMonth(year : number, month : string, idSubscriber : number){

    this.loading = true
    this.consultaService.GetQuery1_1ByMonth(year,this.monthToNumber(month),idSubscriber).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query1_1OR = 0
          this.query1_1RV = 0
          this.query1_1EF = 0
          this.query1_1CostoTotal = 0

          this.DTQuery1_1ByMonth.data = response.data
          this.DTQuery1_1ByMonth.sort = this.sort

          this.DTQuery1_1ByMonth.data.forEach(element => {
            if(element.reportType === 'OR'){
              this.query1_1OR++
            }else if(element.reportType === 'RV'){
              this.query1_1RV++
            }else if(element.reportType === 'EF'){
              this.query1_1EF++
            }
            this.query1_1CostoTotal += element.price
          });
        }
      },(error) => {
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }

  //2
  query1_2_year = new Date().getFullYear();

  query1_2TotalCountries = 0
  query1_2totalReports = 0
  query1_2totals : any = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
    total: 0
  };
  query1_2CalculateTotals(): void {
    this.query1_2totals = this.DTQuery1_2ByYear.data.reduce((acc, item) => {
      acc.january += item.january;
      acc.february += item.february;
      acc.march += item.march;
      acc.april += item.april;
      acc.may += item.may;
      acc.june += item.june;
      acc.july += item.july;
      acc.august += item.august;
      acc.september += item.september;
      acc.october += item.october;
      acc.november += item.november;
      acc.december += item.december;
      acc.total += item.total;
      return acc;
    }, {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      total: 0
    });
  }
  DTQuery1_2ByYear = new MatTableDataSource<Query1_2ByYear>()
  columnsQuery1_2ByYear : string[] = ['country','january','february','march','april','may','june','july','august','september','october','november','december','total','%']

  searchQuery1_2ByYear(){
    this.loading = true
    this.consultaService.GetQuery1_2ByYear(this.query1_2_year).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          response.data.sort((a, b) => b.total - a.total);
          this.query1_2TotalCountries = 0
          this.query1_2totalReports = 0

          this.DTQuery1_2ByYear.data = response.data
          this.DTQuery1_2ByYear.sort = this.sort

          this.DTQuery1_2ByYear.data.forEach(element => {
            this.query1_2TotalCountries++;
            this.query1_2totalReports += element.total
          })

          this.query1_2CalculateTotals()
        }
      },(error) => {
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }

  //3
  query1_3_year = new Date().getFullYear();

  query1_3_idSubscriber = 0

  query1_3TotalCountries = 0
  query1_3totalReports = 0

  query1_3totals : any = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
    total: 0
  };
  query1_3CalculateTotals(): void {
    this.query1_3totals = this.DTQuery1_3ByYear.data.reduce((acc, item) => {
      acc.january += item.january;
      acc.february += item.february;
      acc.march += item.march;
      acc.april += item.april;
      acc.may += item.may;
      acc.june += item.june;
      acc.july += item.july;
      acc.august += item.august;
      acc.september += item.september;
      acc.october += item.october;
      acc.november += item.november;
      acc.december += item.december;
      acc.total += item.total;
      return acc;
    }, {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      total: 0
    });
  }

  DTQuery1_3 = new MatTableDataSource<AbonadoT>()
  columnsQuery1_3 : string[] = ['name','options']

  DTQuery1_3ByYear = new MatTableDataSource<Query1_3BySubscriber>()
  columnsQuery1_3ByYear : string[] = ['country','january','february','march','april','may','june','july','august','september','october','november','december','total','%']

  searchQuery1_3ByYear(){
    this.loading = true
    this.consultaService.GetQuery1_3BySubscriber(this.query1_3_idSubscriber, this.query1_3_year).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query1_3TotalCountries = 0
          this.query1_3totalReports = 0

          this.DTQuery1_3ByYear.data = response.data
          this.DTQuery1_3ByYear.sort = this.sort

          this.DTQuery1_3ByYear.data.forEach(element => {
            this.query1_3TotalCountries++;
            this.query1_3totalReports += element.total
          })
          this.query1_3CalculateTotals()
        }
      },(error) => {
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }

  //4
  query1_4_year = new Date().getFullYear();

  query1_4_idSubscriber = 0

  query1_4TotalCountries = 0
  query1_4totalReports = 0

  DTQuery1_4 = new MatTableDataSource<Query1_4Subscriber>()
  columnsQuery1_4 : string[] = ['name','options']

  query1_4totalsCountry : any = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
    total: 0
  };
  query1_4CalculateTotalsCountry(): void {
    this.query1_4totalsCountry = this.DTQuery1_4Country.data.reduce((acc, item) => {
      acc.january += item.january;
      acc.february += item.february;
      acc.march += item.march;
      acc.april += item.april;
      acc.may += item.may;
      acc.june += item.june;
      acc.july += item.july;
      acc.august += item.august;
      acc.september += item.september;
      acc.october += item.october;
      acc.november += item.november;
      acc.december += item.december;
      acc.total += item.total;
      return acc;
    }, {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      total: 0
    });
  }
  query1_4totalsProcedure : any = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
    total: 0
  };
  query1_4CalculateTotalsProcedure(): void {
    this.query1_4totalsProcedure = this.DTQuery1_4Procedure.data.reduce((acc, item) => {
      acc.january += item.january;
      acc.february += item.february;
      acc.march += item.march;
      acc.april += item.april;
      acc.may += item.may;
      acc.june += item.june;
      acc.july += item.july;
      acc.august += item.august;
      acc.september += item.september;
      acc.october += item.october;
      acc.november += item.november;
      acc.december += item.december;
      acc.total += item.total;
      return acc;
    }, {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      total: 0
    });
  }
  query1_4totalsReport : any = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
    total: 0
  };
  query1_4CalculateTotalsReport(): void {
    this.query1_4totalsReport = this.DTQuery1_4Report.data.reduce((acc, item) => {
      acc.january += item.january;
      acc.february += item.february;
      acc.march += item.march;
      acc.april += item.april;
      acc.may += item.may;
      acc.june += item.june;
      acc.july += item.july;
      acc.august += item.august;
      acc.september += item.september;
      acc.october += item.october;
      acc.november += item.november;
      acc.december += item.december;
      acc.total += item.total;
      return acc;
    }, {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      total: 0
    });
  }
  DTQuery1_4Country = new MatTableDataSource<Query1_4Country>()
  columnsQuery1_4Country : string[] = ['country','january','february','march','april','may','june','july','august','september','october','november','december','total','%']
  DTQuery1_4Procedure = new MatTableDataSource<Query1_4Procedure>()
  columnsQuery1_4Procedure : string[] = ['procedureType','january','february','march','april','may','june','july','august','september','october','november','december','total','%']
  DTQuery1_4Report = new MatTableDataSource<Query1_4ReportType>()
  columnsQuery1_4Report : string[] = ['reportType','january','february','march','april','may','june','july','august','september','october','november','december','total','%']


  searchQuery1_4(){
    this.loading = true
    this.consultaService.GetQuery1_4(this.query1_4_idSubscriber, this.query1_4_year).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query1_4TotalCountries = 0
          this.query1_4totalReports = 0

          this.DTQuery1_4Country.data = response.data.query1_4ByCountries
          this.DTQuery1_4Country.sort = this.sort
          this.DTQuery1_4Procedure.data = response.data.query1_4ByProcedureType
          this.DTQuery1_4Procedure.sort = this.sort
          this.DTQuery1_4Report.data = response.data.query1_4ByReportType
          this.DTQuery1_4Report.sort = this.sort

          this.DTQuery1_4Country.data.forEach(element => {
            this.query1_4TotalCountries++;
            this.query1_4totalReports += element.total
          })
          this.query1_4CalculateTotalsCountry()
          this.query1_4CalculateTotalsProcedure()
          this.query1_4CalculateTotalsReport()
        }
      },(error) => {
        this.loading = false
      }
    ).add(
      () => {
        this.loading = false
      }
    )
  }

  //5
  date = new Date()
  day = this.date.getDate();
  month = this.date.getMonth() + 1;
  year = this.date.getFullYear();

  startDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;
  startDateD = new Date()
  endDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;
  endDateD = new Date()

  query1_5TotalReports = 0
  query1_5TotalPrice = 0

  query1_5TotalT1 = 0
  query1_5TotalT2 = 0
  query1_5TotalT3 = 0

  DTQuery1_5 = new MatTableDataSource<Query1_5>()
  columnsQuery1_5 : string[] = ['orderDate','expireDate','requestedName','country','procedureType','reportType','subscriberCode','price']

  selectStartDate_1_5(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.startDate = this.formatDate(selectedDate);
    }
  }
  selectEndDate_1_5(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.endDate = this.formatDate(selectedDate);
    }
  }
  searchQuery1_5(){
    this.loading = true
    this.consultaService.GetQuery1_5(this.startDate, this.endDate).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.DTQuery1_5.data = response.data
          this.query1_5TotalReports = 0
          this.query1_5TotalPrice = 0
          this.DTQuery1_5.data.forEach(element => {
            this.query1_5TotalReports++;
            this.query1_5TotalPrice += element.price;
            if(element.procedureType === "T1"){
              this.query1_5TotalT1++;
            }else if(element.procedureType === "T2"){
              this.query1_5TotalT2++;
            }else if(element.procedureType === "T3"){
              this.query1_5TotalT3++;
            }
          });
        }
      },(error) => {
        this.loading = false
      }).add(
        () => {
          this.loading = false
        }
      )
  }

  //6
  query1_6_idSubscriber = 0

  query1_6TotalT1 = 0
  query1_6TotalT2 = 0
  query1_6TotalT3 = 0

  query1_6TotalOR = 0
  query1_6TotalRV = 0
  query1_6TotalEF = 0

  query1_6totalPrice = 0
  query1_6totalReports = 0
  DTQuery1_6_base : Query1_6ByIdSubscriber[] = []
  DTQuery1_6 = new MatTableDataSource<Query1_6ByIdSubscriber>()
  columnsQuery1_6 : string[] = ['name', 'options']

  DTQuery1_6ByIdSubscriber = new MatTableDataSource<Query1_6ByIdSubscriber>()
  columnsQuery1_6ByIdSubscriber : string[] = ['orderDate','expireDate','requestedName','country','procedureType','reportType','subscriberCode','price']

  private filterByDistinct(querys: Query1_6ByIdSubscriber[]): Query1_6ByIdSubscriber[] {
    const uniqueSubscribers = new Set();
    const distinctQuery = [];

    for (const query of querys) {
      if (!uniqueSubscribers.has(query.idSubscriber)) {
        uniqueSubscribers.add(query.idSubscriber);
        distinctQuery.push(query);
      }
    }
    return distinctQuery;
  }
  searchQuery1_6(idSubscriber : number){
    this.loading = true
    this.consultaService.GetQuery1_6BySubscriber().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query1_6TotalT1 = 0
          this.query1_6TotalT2 = 0
          this.query1_6TotalT3 = 0

          this.query1_6TotalOR = 0
          this.query1_6TotalRV = 0
          this.query1_6TotalEF = 0

          this.query1_6totalPrice = 0
          this.query1_6totalReports = 0

          this.DTQuery1_6ByIdSubscriber.data = this.DTQuery1_6_base.filter(x => x.idSubscriber === idSubscriber)
          this.DTQuery1_6ByIdSubscriber.data.forEach(element => {
            this.query1_6totalPrice += element.price;
            this.query1_6totalReports++;
            if(element.procedureType === "T1"){
              this.query1_6TotalT1++;
            }else if(element.procedureType === "T2"){
              this.query1_6TotalT2++;
            }else if(element.procedureType === "T3"){
              this.query1_6TotalT3++;
            }
            if(element.reportType === "OR"){
              this.query1_6TotalOR++;
            }else if(element.reportType === "RV"){
              this.query1_6TotalRV++;
            }else if(element.reportType === "EF"){
              this.query1_6TotalEF++;
            }
          });
        }
      },(error) => {
        this.loading = false
      }).add(
        () => {
          this.loading = false
        }
      )
  }

  //7
  query1_7ByYear = new Date().getFullYear();
  query1_7ByMonth = 1
  query1_7_idSubscriber = 0

  query1_7totalReports = 0


  DTQuery1_7 = new MatTableDataSource<AbonadoT>()
  columnsQuery1_7 : string[] = ['name', 'options']

  DTQuery1_7Tickets = new MatTableDataSource<Query1_7Tickets>()
  columnsQuery1_7Tickets : string[] = ['orderDate', 'requestedName','referenceCode','country','procedureType','reportType']

  searchQuery1_7(){
    this.loading = true
    this.consultaService.GetQuery1_7Tickets(this.query1_7ByYear, this.query1_7ByMonth,this.query1_7_idSubscriber).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query1_7totalReports = 0
          this.DTQuery1_7Tickets.data = response.data
          this.DTQuery1_7Tickets.data.forEach(element => {
            this.query1_7totalReports++;
          });
        }
      },(error) => {
        this.loading = false
      }).add(
        () => {
          this.loading = false
        }
      )
  }

  //8
  query1_8ByYear = new Date().getFullYear();
  query1_8ByMonth = 1

  query1_8TotalCountry = 0
  query1_8TotalReports = 0

  DTQuery1_8 = new MatTableDataSource<Query1_8>();
  columnsQuery1_8 : string[] = ['country','quantity'];

  searchQuery1_8(){
    this.loading = true
    this.consultaService.GetQuery1_8(this.query1_8ByYear, this.query1_8ByMonth).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query1_8TotalCountry = 0
          this.query1_8TotalReports = 0
          this.DTQuery1_8.data = response.data
          this.DTQuery1_8.data.forEach(element => {
            this.query1_8TotalCountry++;
            this.query1_8TotalReports += element.quantity;
          });
        }
      },(error) => {
        this.loading = false
      }).add(
        () => {
          this.loading = false
        }
      )
  }


  //9
  query1_9ByYear = new Date().getFullYear();
  query1_9ByMonth = 1

  query1_9TotalReports = 0

  DTQuery1_9 = new MatTableDataSource<Query1_9>();
  columnsQuery1_9 : string[] = ['subscriber','quantity'];

  searchQuery1_9(){
    this.loading = true
    this.consultaService.GetQuery1_9(this.query1_9ByYear, this.query1_9ByMonth).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query1_9TotalReports = 0
          this.DTQuery1_9.data = response.data
          this.DTQuery1_9.data.forEach(element => {
            this.query1_9TotalReports += element.quantity;
          });
        }
      },(error) => {
        this.loading = false
      }).add(
        () => {
          this.loading = false
        }
      )
  }


  //10
  query1_10startDate = this.day + "/" + this.month + "/" + this.year;
  query1_10startDateD = new Date()
  query1_10endDate = this.day + "/" + this.month + "/" + this.year;
  query1_10endDateD = new Date()

  query1_10_idSubscriber = 0

  query1_10totalReports = 0


  DTQuery1_10 = new MatTableDataSource<AbonadoT>()
  columnsQuery1_10 : string[] = ['name', 'options']

  DTQuery1_10Tickets = new MatTableDataSource<Query1_10>()
  columnsQuery1_10Tickets : string[] = ['orderDate','expireDate', 'dispatchDate','requestedName','country','procedureType','reportType','price']

  selectStartDate_1_10(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query1_10startDate = this.formatDate(selectedDate);
    }
  }
  selectEndDate_1_10(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query1_10endDate = this.formatDate(selectedDate);
    }
  }

  searchQuery1_10(){
    this.loading = true
    this.consultaService.GetQuery1_10(this.query1_10_idSubscriber,this.query1_10startDate, this.query1_10endDate).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query1_10totalReports = 0
          this.DTQuery1_10Tickets.data = response.data
          this.DTQuery1_10Tickets.data.forEach(element => {
            this.query1_10totalReports++;
          });
        }
      },(error) => {
        this.loading = false
      }).add(
        () => {
          this.loading = false
        }
      )
  }

  //11
  query1_11ByYear = new Date().getFullYear();
  query1_11ByMonth = 1
  query1_11ByMonthStr = ""

  query1_11_idSubscriber = 0

  query1_11totalReports = 0
  query1_11totalSubscriber = 0

  query1_11TotalOR = 0
  query1_11TotalRV = 0
  query1_11TotalEF = 0

  query1_11TotalPrice = 0

  query1_11totals : any = {
    january: 0,
    february: 0,
    march: 0,
    april: 0,
    may: 0,
    june: 0,
    july: 0,
    august: 0,
    september: 0,
    october: 0,
    november: 0,
    december: 0,
    total: 0
  };
  query1_11CalculateTotals(): void {
    this.query1_11totals = this.DTQuery1_11.data.reduce((acc, item) => {
      acc.january += item.january;
      acc.february += item.february;
      acc.march += item.march;
      acc.april += item.april;
      acc.may += item.may;
      acc.june += item.june;
      acc.july += item.july;
      acc.august += item.august;
      acc.september += item.september;
      acc.october += item.october;
      acc.november += item.november;
      acc.december += item.december;
      acc.total += item.total;
      return acc;
    }, {
      january: 0,
      february: 0,
      march: 0,
      april: 0,
      may: 0,
      june: 0,
      july: 0,
      august: 0,
      september: 0,
      october: 0,
      november: 0,
      december: 0,
      total: 0
    });
  }

  DTQuery1_11 = new MatTableDataSource<Query1_11Subscriber>()
  columnsQuery1_11 : string[] = ['subscriber','january','february','march','april','may','june','july','august','september','october','november','december','total','%']


  DTQuery1_11BySubscriber = new MatTableDataSource<Query1_11BySubscriber>()
  columnsQuery1_11BySubscriber : string[] = ['requestedName','country','orderDate','dispatchDate','procedureType','reportType','price']

  searchQuery1_11(){
    this.loading = true
    this.consultaService.GetQuery1_11Subscriber(this.query1_11ByYear).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query1_11totalReports = 0
          this.query1_11totalSubscriber = 0
          this.query1_11_idSubscriber = 0
          response.data.sort((a, b) => b.total - a.total);
          this.DTQuery1_11.data = response.data
          this.DTQuery1_11BySubscriber.data = []
          this.DTQuery1_11.data.forEach(element => {
            this.query1_11totalSubscriber++;
            this.query1_11totalReports += element.total
          });
          this.query1_11CalculateTotals()
        }
      },(error) => {
        this.loading = false
      }).add(
        () => {
          this.loading = false
        }
      )
  }

  searchQuery1_11ByIdSubscriber(idSubscriber : number, year : number, month : string){
    this.loading = true
    this.consultaService.GetQuery1_11BySubscriber(idSubscriber, year, this.monthToNumber(month)).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){

          this.DTQuery1_11BySubscriber.data = response.data
        }
      },(error) => {
        this.loading = false
      }).add(
        () => {
          this.loading = false
        }
      )
  }

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
}
