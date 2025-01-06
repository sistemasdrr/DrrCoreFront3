import { Component, OnInit, ViewChild } from '@angular/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Query4_1_1, Query4_1_2, Query4_1_3, Query4_1_4, Query4_2_1, Query4_2_2 } from 'app/models/consulta';
import { ConsultaService } from 'app/services/Consultas/consulta.service';
import * as moment from 'moment';
import { PDFSource, PdfViewerComponent } from 'ng2-pdf-viewer';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-facturacion',
    templateUrl: './facturacion.component.html',
    styleUrls: ['./facturacion.component.scss'],
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
export class FacturacionComponent implements OnInit{
  years : number[] = []

  breadscrums = [
    {
      title: 'Consultas de Facturación',
      items: ['Consultas'],
      active: 'Facturación',
    },
  ];

  subscribers4_1_1 : Query4_1_1[] = []
  dates4_1_2 : Query4_1_2[] = []
  subscribers4_1_3 : Query4_1_3[] = []
  subscribers4_1_4 : Query4_1_4[] = []

  agents4_2_1 :  Query4_2_1[] = []
  agents4_2_2 :  Query4_2_2[] = []

  pdfSrc4_1_1: string | Uint8Array | PDFSource = ""
  pdfSrc4_1_2: string | Uint8Array | PDFSource = ""
  pdfSrc4_1_3: string | Uint8Array | PDFSource = ""
  pdfSrc4_1_4: string | Uint8Array | PDFSource = ""
  pdfSrc4_1_5: string | Uint8Array | PDFSource = ""
  pdfSrc4_2_1: string | Uint8Array | PDFSource = ""
  pdfSrc4_2_2: string | Uint8Array | PDFSource = ""
  pdfBlob4_1_1: Blob;
  pdfBlob4_1_2: Blob;
  pdfBlob4_1_3: Blob;
  pdfBlob4_1_4: Blob;
  pdfBlob4_1_5: Blob;
  pdfBlob4_2_1: Blob;
  pdfBlob4_2_2: Blob;

  loading = false

  idQuery = 1
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  to = "one"
  idSubscriber = 0
  idUser = 0


  constructor(private consultaService : ConsultaService){
    this.pdfBlob4_1_1 = new Blob
    this.pdfBlob4_1_2 = new Blob
    this.pdfBlob4_1_3 = new Blob
    this.pdfBlob4_1_4 = new Blob
    this.pdfBlob4_1_5 = new Blob
    this.pdfBlob4_2_1 = new Blob
    this.pdfBlob4_2_2 = new Blob
    const auth = JSON.parse(localStorage.getItem('authCache')+'')
    if(auth){
      this.idUser = parseInt(auth.idUser)
    }
  }
  ngOnInit(): void {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 15;

    for (let year = currentYear; year >= startYear; year--) {
      this.years.push(year);
    }
    this.loading = true
    this.consultaService.DownloadQuery_Fact_4_1_1("pdf").subscribe(response => {
      this.pdfBlob4_1_1 = response.body as Blob;
      let reader = new FileReader();
      reader.onloadend = () => {
        let dataUrl: string = reader.result as string;
        this.pdfSrc4_1_1 = dataUrl;
      };
      reader.readAsDataURL(this.pdfBlob4_1_1);
    }).add(
      () => {
        this.loading = false
        this.consultaService.GetQuery4_1_1().subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.subscribers4_1_1 = response.data
            }
          }
        )

        this.consultaService.DownloadQuery_Fact_4_1_2("pdf").subscribe(response => {
          this.pdfBlob4_1_2 = response.body as Blob;
          let reader = new FileReader();
          reader.onloadend = () => {
            let dataUrl: string = reader.result as string;
            this.pdfSrc4_1_2 = dataUrl;
          };
          reader.readAsDataURL(this.pdfBlob4_1_2);
        })
        this.consultaService.DownloadQuery_Fact_4_2_1("pdf").subscribe(response => {
          this.pdfBlob4_2_1 = response.body as Blob;
          let reader = new FileReader();
          reader.onloadend = () => {
            let dataUrl: string = reader.result as string;
            this.pdfSrc4_2_1 = dataUrl;
          };
          reader.readAsDataURL(this.pdfBlob4_2_1);
        })
        this.consultaService.GetQuery4_1_2().subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.dates4_1_2 = response.data
            }
          }
        )
        this.consultaService.GetQuery4_2_1().subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.agents4_2_1 = response.data
            }
          }
        )
      }
    );


  }
  @ViewChild(PdfViewerComponent)
  private pdfComponent!: PdfViewerComponent;

  //4_1_1
  pdfQuery = ""
  searchQueryChanged(pdfQuery : string) {
    console.log(pdfQuery)
    const type = '';
    this.pdfComponent.eventBus.dispatch('find', {
      type,
      query: pdfQuery,
      highlightAll: true,
      caseSensitive: false,
      phraseSearch: true,
      // findPrevious: undefined,
    });
  }

  SendMail(){
    this.loading = true;
    this.consultaService.SendMailQuery_Fact_ByBill(this.to, this.to === 'one' ? this.idSubscriber : 0, this.idUser).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          Swal.fire({
            title: this.to === 'one' ? 'Se envio el correo al abonado correctamente' : 'Se enviaron los correos a todos los abonados correctamente',
            text: "",
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText : 'No',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí',
            width: '20rem',
            heightAuto : true
          }).then(
            () => {
              this.loading = false
            }
          )
        }
      },(error) => {
        this.loading = false
      }
    )
  }
  date = new Date()
  day = this.date.getDate();
  month = this.date.getMonth() + 1;
  year = this.date.getFullYear();
  //4_1_3
  query4_1_3_startDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;
  query4_1_3_startDateD = new Date()
  query4_1_3_endDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;
  query4_1_3_endDateD = new Date()

  formatDate(date: moment.Moment): string {
    const formattedDate = date.format('DD/MM/YYYY');
    return formattedDate;
  }
  selectStartDate4_1_3(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query4_1_3_startDate = this.formatDate(selectedDate);
    }
  }
  selectEndDate4_1_3(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query4_1_3_endDate = this.formatDate(selectedDate);
    }
  }

  searchQuery4_1_3(){
    console.log(this.query4_1_3_startDate)
    console.log(this.query4_1_3_endDate)
    this.loading = true;
    this.consultaService.GetQuery4_1_3(this.query4_1_3_startDate, this.query4_1_3_endDate).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.subscribers4_1_3 = response.data
        }
      },(error) =>{
        console.log(error)
        this.loading = false
      }
    ).add(
      () => {
        this.consultaService.DownloadQuery_Fact_4_1_3("pdf",this.query4_1_3_startDate, this.query4_1_3_endDate).subscribe(response => {
          this.pdfBlob4_1_3 = response.body as Blob;
          let reader = new FileReader();
          reader.onloadend = () => {
            let dataUrl: string = reader.result as string;
            this.pdfSrc4_1_3 = dataUrl;
          };
          reader.readAsDataURL(this.pdfBlob4_1_3);
        },error => {
          console.log(error)
          this.loading = false
        }).add(
          () => {
            this.loading = false
          }
        )
      }
    )
  }


  //4_1_4
  query4_1_4_month = 1
  query4_1_4_year = this.year



  searchQuery4_1_4(){
    this.loading = true;
    this.consultaService.DownloadQuery_Fact_4_1_4("pdf",this.query4_1_4_month, this.query4_1_4_year).subscribe(response => {
      this.pdfBlob4_1_4 = response.body as Blob;
      let reader = new FileReader();
      reader.onloadend = () => {
        let dataUrl: string = reader.result as string;
        this.pdfSrc4_1_4 = dataUrl;
      };
      reader.readAsDataURL(this.pdfBlob4_1_4);
    },error => {
      console.log(error)
      this.loading = false
    }).add(
      () => {
        this.consultaService.GetQuery4_1_4(this.query4_1_4_month, this.query4_1_4_year).subscribe(
          (response) => {
            if(response.isSuccess === true && response.isWarning === false){
              this.subscribers4_1_4 = response.data
            }
          }
        )
        this.loading = false
      }
    )
  }

  //4_1_5
  query4_1_5_month = 1
  query4_1_5_year = this.year
  query4_1_5_orderBy = "invoiceCode"

  searchQuery4_1_5(){
    this.loading = true;
    this.consultaService.DownloadQuery_Fact_4_1_5("pdf",this.query4_1_5_orderBy,this.query4_1_5_month, this.query4_1_5_year).subscribe(response => {
      this.pdfBlob4_1_5 = response.body as Blob;
      let reader = new FileReader();
      reader.onloadend = () => {
        let dataUrl: string = reader.result as string;
        this.pdfSrc4_1_5 = dataUrl;
      };
      reader.readAsDataURL(this.pdfBlob4_1_5);
    },error => {
      console.log(error)
      this.loading = false
    }).add(
      () => {
        this.loading = false
      }
    )
  }

  //4_2_2
  query4_2_2_startDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;
  query4_2_2_startDateD = new Date()
  query4_2_2_endDate = this.day.toString().padStart(2, '0') + "/" + this.month.toString().padStart(2, '0') + "/" + this.year;
  query4_2_2_endDateD = new Date()

  selectStartDate4_2_2(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query4_2_2_startDate = this.formatDate(selectedDate);
    }
  }
  selectEndDate4_2_2(event: MatDatepickerInputEvent<Date>) {
    const selectedDate = event.value;
    if (moment.isMoment(selectedDate)) {
      this.query4_2_2_endDate = this.formatDate(selectedDate);
    }
  }
  searchQuery4_2_2(){
    console.log(this.query4_2_2_startDate)
    console.log(this.query4_2_2_endDate)
    this.loading = true;
    this.consultaService.GetQuery4_2_2(this.query4_2_2_startDate, this.query4_2_2_endDate).subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          this.agents4_2_2 = response.data
        }
      },(error) =>{
        console.log(error)
        this.loading = false
      }
    ).add(
      () => {
        this.consultaService.DownloadQuery_Fact_4_2_2("pdf",this.query4_2_2_startDate, this.query4_2_2_endDate).subscribe(response => {
          this.pdfBlob4_2_2 = response.body as Blob;
          let reader = new FileReader();
          reader.onloadend = () => {
            let dataUrl: string = reader.result as string;
            this.pdfSrc4_2_2 = dataUrl;
          };
          reader.readAsDataURL(this.pdfBlob4_2_2);
        },error => {
          console.log(error)
          this.loading = false
        }).add(
          () => {
            this.loading = false
          }
        )
      }
    )
  }

}
