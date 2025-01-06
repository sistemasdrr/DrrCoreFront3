import { Component, OnInit, ViewChild } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Query3_1ByMonth, Query3_1ByYear } from 'app/models/consulta';
import { ConsultaService } from 'app/services/Consultas/consulta.service';

@Component({
    selector: 'app-agentes',
    templateUrl: './agentes.component.html',
    styleUrls: ['./agentes.component.scss'],
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
export class AgentesComponent implements OnInit{
  years : number[] = []

  breadscrums = [
    {
      title: 'Consultas de Agentes',
      items: ['Consultas'],
      active: 'Agentes',
    },
  ];

  loading = false

  idQuery = 1
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private consultaService : ConsultaService){

  }
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 15;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
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
  //3_1
  query3_1AsignedTo = ""
  query3_1_year = new Date().getFullYear();
  query3_1_month = ""

  query3_1TotalAgents = 0
  query3_1TotalReports = 0
  query3_1TotalPrice = 0

  query3_1TotalOR = 0
  query3_1TotalRV = 0
  query3_1TotalEF = 0

  query3_1totals : any = {
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
  query3_1CalculateTotals(): void {
    this.query3_1totals = this.DTQuery3_1ByYear.data.reduce((acc, item) => {
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
  DTQuery3_1ByYear = new MatTableDataSource<Query3_1ByYear>()
  columnsQuery3_1ByYear : string[] = ['name','january','february','march','april','may','june','july','august','september','october','november','december','total','%']
  DTQuery3_1ByMonth = new MatTableDataSource<Query3_1ByMonth>()
  columnsQuery3_1ByMonth : string[] = ['requestedName','country','emitInvoiceDate','orderDate','dispatchDate','expireDate','procedureType','reportType','price']

  searchQuery3_1ByYear(){
    this.loading = true;
    this.consultaService.GetQuery3_1ByYear(this.query3_1_year).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.DTQuery3_1ByYear.data = response.data
          this.DTQuery3_1ByYear.sort = this.sort
          this.DTQuery3_1ByYear.data.forEach(element => {
            this.query3_1TotalAgents++;
            this.query3_1TotalReports += element.total
          });
        }
      },(error) => {
        this.loading = false;
      }
    ).add(
      () => {
        this.loading = false;
      }
    )
  }
  searchQuery3_1ByMonth(asignedTo : string, year : number, month : string){
    this.consultaService.GetQuery3_1ByMonth(asignedTo, year,this.monthToNumber(month)).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.DTQuery3_1ByMonth.data = response.data
          this.DTQuery3_1ByMonth.sort = this.sort
          this.query3_1TotalOR = 0;
          this.query3_1TotalRV = 0;
          this.query3_1TotalEF = 0;
          this.query3_1TotalPrice = 0;

          this.DTQuery3_1ByMonth.data.forEach(element => {
            this.query3_1TotalPrice += element.price
            if(element.reportType === "OR"){
              this.query3_1TotalOR++;
            }else if(element.reportType === "RV"){
              this.query3_1TotalRV++;
            }else if(element.reportType === "EF"){
              this.query3_1TotalEF++;
            }
          });
        }
      }
    )
  }
}
