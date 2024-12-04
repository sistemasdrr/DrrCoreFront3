import { Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import { Calendar } from 'app/models/usuario';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarioService } from 'app/services/calendario.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import esLocale from '@fullcalendar/core/locales/es';
import { DetalleCalendarioComponent } from './detalle-calendario/detalle-calendario.component';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.scss']
})
export class CalendarioComponent implements OnInit {
  breadscrums = [
    {
      title: 'Fechas Importantes',
      subtitle: '',
      items: ['Administración','Mantenimiento'],
      active: 'Fechas Importantes',
    },
  ];

  loading : boolean = false

  events : EventInput[] = []


  calendar: Calendar | null;
  public addCusForm: UntypedFormGroup;
  dialogTitle: string;
  filterOptions = 'All';
  calendarData!: Calendar;

  calendarEvents?: EventInput[];
  tempEvents?: EventInput[];

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek',
    },
    locales: [esLocale],
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this),
  }
  handleDateSelect(selectInfo: DateSelectArg) {
    console.log(selectInfo)
    this.addNewEvent(selectInfo.start,selectInfo.end);
  }
  addNewEvent(start : Date, end : Date) {
    const dialogRef = this.dialog.open(DetalleCalendarioComponent, {
      data: {
        action: 'add',
        startDate: start,
        endDate: end,
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.ngOnInit()
      }
    )
  }
  handleEventClick(clickInfo: EventClickArg) {
    this.eventClick(clickInfo);
  }
  eventClick(row: EventClickArg) {
    console.log(row.event)
    const dialogRef = this.dialog.open(DetalleCalendarioComponent, {
      data: {
        id: row.event.id,
        title: row.event.title,
        groupId: row.event.groupId,
        startDate: row.event.start,
        endDate: row.event.end,
        className: row.event._def.ui.classNames[0],
        details: row.event.extendedProps['details'],
        action: 'edit',
      },
    });
    dialogRef.afterClosed().subscribe(
      () => {
        this.ngOnInit()
      }
    )
  }
  handleEvents(events: EventApi[]) {
    // this.currentEvents = events;
  }

  constructor( private fb: UntypedFormBuilder,
    private dialog: MatDialog,private calendarioService : CalendarioService){
    this.dialogTitle = 'Add New Event';
    const blankObject = {} as Calendar;
    this.calendar = new Calendar(blankObject);
    this.addCusForm = this.createCalendarForm(this.calendar);

  }
  ngOnInit(): void {
    this.calendarioService.GetCalendarAniversary().subscribe(
      (response) => {
        if(response.isSuccess === true && response.isWarning === false){
          console.log(response.data)
          this.events = []

          response.data.forEach(element => {
            // Verificar si element.start y element.end son cadenas válidas
              this.events.push({
                id: element.id.toString(),
                title: element.title,
                start: new Date(element.start),
                end: new Date(element.end),
                allDay: false,
                className: element.className,
                groupId: element.groupId,
                details: element.details === null ? '' : element.details,
                editable : false,

              });
          });
        }
      }
    ).add(
      () => {

        this.calendarEvents = this.events;
        this.tempEvents = this.calendarEvents;
        this.calendarOptions.events = this.calendarEvents
        console.log(this.calendarOptions.events)
      }
    )

  }
  createCalendarForm(calendar: Calendar): UntypedFormGroup {
    return this.fb.group({
      id: [calendar.id],
      title: [calendar.title,],
      groupId: [calendar.groupId],
      className: [calendar.className],
      startDate: [calendar.startDate],
      endDate: [calendar.endDate],
      details: [calendar.details],
    });
  }
}
