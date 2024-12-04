import { Component, OnInit, ViewChild } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { GetReporters, Query2_1ByMonth, Query2_1ByYear, Query2_2ByYear, Query2_2Months } from 'app/models/consulta';
import { ConsultaService } from 'app/services/Consultas/consulta.service';

@Component({
  selector: 'app-reporteros',
  templateUrl: './reporteros.component.html',
  styleUrls: ['./reporteros.component.scss'],
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
export class ReporterosComponent implements OnInit{
  breadscrums = [
    {
      title: 'Consultas de Reporteros',
      items: ['Consultas'],
      active: 'Reporteros',
    },
  ];

  loading = false

  idQuery = 1
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  years : number[] = []
  reporters : GetReporters[] = []

  constructor(private consultaService : ConsultaService){

  }
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 15;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }

    this.consultaService.GetReporters().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.reporters = response.data
        }
      }
    )
  }

  //1
  query2_1ByYear = new Date().getFullYear();
  query2_1ByMonthStr = ""
  query2_1Reporter = ""

  query2_1OR = 0
  query2_1RV = 0
  query2_1EF = 0
  query2_1TotalInformesAtendidos = 0
  query2_1TotalReporteros = 0

  query2_1totals : any = {
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
  query2_1CalculateTotals(): void {
    this.query2_1totals = this.DTQuery2_1ByYear.data.reduce((acc, item) => {
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

  DTQuery2_1ByYear = new MatTableDataSource<Query2_1ByYear>()
  columnsQuery2_1ByYear : string[] = ['name','january','february','march','april','may','june','july','august','september','october','november','december','total','%']
  DTQuery2_1ByMonth = new MatTableDataSource<Query2_1ByMonth>()
  columnsQuery2_1ByMonth : string[] = ['requestedName','country','orderDate','shippingDate','procedureType','reportType']

  searchQuery2_1ByYear(){
    this.loading = true
    this.consultaService.GetQuery2_1ByYear(this.query2_1ByYear).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){

          response.data.sort((a, b) => b.total - a.total);
          this.query2_1TotalInformesAtendidos = 0
          this.DTQuery2_1ByYear.data = response.data
          this.DTQuery2_1ByYear.paginator = this.paginator
          this.DTQuery2_1ByYear.sort = this.sort
          this.DTQuery2_1ByYear.data.forEach(element => {
            this.query2_1TotalReporteros++
            this.query2_1TotalInformesAtendidos += element.total
          });
          this.query2_1CalculateTotals()
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
  searchQuery2_1ByMonth(year : number, month : string, asignedTo : string){

    this.loading = true
    this.consultaService.GetQuery2_1ByMonth(asignedTo, year,this.monthToNumber(month)).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.query2_1OR = 0
          this.query2_1RV = 0
          this.query2_1EF = 0

          this.DTQuery2_1ByMonth.data = response.data
          this.DTQuery2_1ByMonth.sort = this.sort

          this.DTQuery2_1ByMonth.data.forEach(element => {
            if(element.reportType === 'OR'){
              this.query2_1OR++
            }else if(element.reportType === 'RV'){
              this.query2_1RV++
            }else if(element.reportType === 'EF'){
              this.query2_1EF++
            }
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
  query2_2AsignedTo = ""

  query2_2ByYear = new Date().getFullYear();
  query2_2ByMonth = 0
  query2_2ByMonthStr = ""
  query2_2TotalInformesAtendidos = 0

  query2_2totals : any = {
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
  query2_2CalculateTotals(): void {
    this.query2_2totals = this.DTQuery2_2ByYear.data.reduce((acc, item) => {
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

  DTQuery2_2ByYear = new MatTableDataSource<Query2_2ByYear>()
  columnsQuery2_2ByYear : string[] = ['country','january','february','march','april','may','june','july','august','september','october','november','december','total','%']
  DTQuery2_2ByMonth = new MatTableDataSource<Query2_2Months>()
  columnsQuery2_2ByMonth : string[] = [
    'country','day1','day2','day3','day4','day5','day6','day7','day8','day9','day10'
    ,'day11','day12','day13','day14','day15','day16','day17','day18','day19','day20'
    ,'day21','day22','day23','day24','day25','day26','day27','day28','day29','day30','day31'
  ]
  searchQuery2_2ByYear(){
    this.loading = true
    this.consultaService.GetQuery2_2ByYear(this.query2_2AsignedTo, this.query2_2ByYear).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){

          response.data.sort((a, b) => b.total - a.total);
          this.query2_2TotalInformesAtendidos = 0
          this.DTQuery2_2ByYear.data = response.data
          this.DTQuery2_2ByYear.paginator = this.paginator
          this.DTQuery2_2ByYear.sort = this.sort
          this.DTQuery2_2ByYear.data.forEach(element => {
            this.query2_2TotalInformesAtendidos += element.total
          });
          this.query2_2CalculateTotals()
          this.DTQuery2_2ByMonth.data = []
          this.query2_2ByMonth = 0
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
  searchQuery2_2ByMonth(month : string){
    const nMonth = this.monthToNumber(month)
    this.query2_2ByMonth = nMonth;
    let queryMonths : Query2_2Months[] = []
    this.DTQuery2_2ByMonth.data = []
    this.DTQuery2_2ByYear.data.forEach(element => {
      if(nMonth === 1){
        queryMonths.push(element.month1)
      }else if(nMonth === 2){
        queryMonths.push(element.month2)
      }else if(nMonth === 3){
        queryMonths.push(element.month3)
      }else if(nMonth === 4){
        queryMonths.push(element.month4)
      }else if(nMonth === 5){
        queryMonths.push(element.month5)
      }else if(nMonth === 6){
        queryMonths.push(element.month6)
      }else if(nMonth === 7){
        queryMonths.push(element.month7)
      }else if(nMonth === 8){
        queryMonths.push(element.month8)
      }else if(nMonth === 9){
        queryMonths.push(element.month9)
      }else if(nMonth === 10){
        queryMonths.push(element.month10)
      }else if(nMonth === 11){
        queryMonths.push(element.month11)
      }else if(nMonth === 12){
        queryMonths.push(element.month12)
      }
    });
    this.DTQuery2_2ByMonth.data = queryMonths

    console.log(this.DTQuery2_2ByMonth.data)
  }
}
