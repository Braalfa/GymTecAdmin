import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { CopyDates } from '../models/CopyDates';
import { ClientService } from '../services/client.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FailDialogComponent } from '../fail-dialog/fail-dialog.component';
import { Clase } from '../models/Clase';
import { CalendarEventActionsComponent } from 'angular-calendar/modules/common/calendar-event-actions.component';
import { CopiarClases } from '../models/CopiarClases';
import { Sucursal } from '../models/Sucursal';


const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-calendario',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./calendario.component.css'],
  templateUrl: './calendario.component.html',
})

export class CalendarioComponent implements OnInit {
  errorMsg: string ='';
  errorMsgHeader: string='';
  @ViewChild(FailDialogComponent) failDialogComponent!: FailDialogComponent;

  @ViewChild('modalContent', { static: true })
  modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: new Date(2021, 6, 7, 17, 23, 42, 11),
      end: new Date(2021, 6, 7, 19, 23, 42, 11),
      title: 'Clase de pilates',
      color: colors.yellow,      
    },
  ];

  activeDayIsOpen: boolean = true;

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  currentCopy: CopyDates = new CopyDates();
  firstDiff: number = 0;
  secondDiff: number = 0;

  sucursales:Sucursal[] = [];
  sucursalPorCopiar:string='';

  constructor(private modal: NgbModal, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter, private client: ClientService) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
  }

  ngOnInit(): void {
    this.update()
  }

  update(): void{
    this.client.getClases2().subscribe(data=>{this.parseClases(data); console.log(this.events)},
                                      e=>this.handleError(e))
    this.client.getSucursales().subscribe(data=> this.sucursales = data, e=>this.handleError(e))
  }

  parseClases(clases: Clase[]){
    this.events = []
    clases.forEach(clase => {
      var inicio = new Date(clase.DatetimeInicio!)
      var final = new Date(clase.DatetimeFinal!)
      this.events.push(
        {start: new Date(inicio.getFullYear(), inicio.getMonth(), inicio.getDate(), inicio.getHours(), inicio.getMinutes(), inicio.getSeconds()),
         end: new Date(final.getFullYear(), final.getMonth(), final.getDate(), final.getHours(), final.getMinutes(), final.getSeconds()),
         title: clase.Tipo! + ' | Sucursal: '+  clase.ImpartidoEnSucursal, 
         color: colors.yellow})
    });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = { event, action };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  copyActivities(){
    if(this.firstDiff === this.secondDiff){
      var copy = new CopiarClases()
      var formatDateInicio = this.currentCopy.FechaInicioCopiar?.getFullYear() +'-'+ this.currentCopy.FechaInicioCopiar?.getMonth() +'-'+ this.currentCopy.FechaInicioCopiar?.getDate()
      var formatDateFinal = this.currentCopy.FechaFinalCopiar?.getFullYear() +'-'+ this.currentCopy.FechaFinalCopiar?.getMonth() +'-'+ this.currentCopy.FechaFinalCopiar?.getDate()
      copy.DatetimeInicio = formatDateInicio
      copy.DatetimeFinal = formatDateFinal
      copy.Diferencia = this.calculateDiff(this.currentCopy.FechaInicioCopiar!, this.currentCopy.FechaInicioPegar!)
      console.log(this.sucursalPorCopiar)
      if (this.sucursalPorCopiar !== "null"){
        copy.Sucursal = this.sucursalPorCopiar
      }
      console.log('lo que recibe el backend es: '+ formatDateInicio + ', '+formatDateFinal+ ', '+copy.Diferencia+ ', '+copy.Sucursal)
      this.client.copiarClases(copy).subscribe(sucess=> console.log('Copiada'), e=>this.handleError(e));
      this.update()
    }else{
      this.errorMsgHeader = 'No se pudo copiar'
      this.errorMsg = 'Los periodos no coinciden'
      this.failDialogComponent.openModal();
    }
    this.currentCopy = new CopyDates()
  }

  cancel(){
    this.currentCopy = new CopyDates()
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  dateToString(date: Date){
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  }

  calculateDiff(from: Date, todate:Date){
    let days = Math.floor((todate.getTime() - from.getTime()) / 1000 / 60 / 60 / 24);
    return days;
  }

  calculateFirstDiff(from: Date, todate:Date){
    let days = Math.floor((todate.getTime() - from.getTime()) / 1000 / 60 / 60 / 24);
    this.firstDiff = days;
    return days;
  }

  calculateSecondDiff(from: Date, todate:Date){
    let days = Math.floor((todate.getTime() - from.getTime()) / 1000 / 60 / 60 / 24);
    this.secondDiff = days;
    return days;
  }

  /**=============   SELECCIONAR FECHAS DE SALIDA  =============*/

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
        if(!this.currentCopy.FechaInicioCopiar && !this.currentCopy.FechaFinalCopiar){
          this.currentCopy.FechaInicioCopiar = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day)
          this.currentCopy.FechaFinalCopiar = new Date(this.toDate.year, this.toDate.month, this.toDate.day)
        }
        else if(this.currentCopy.FechaInicioCopiar && this.currentCopy.FechaFinalCopiar){
          this.currentCopy.FechaInicioPegar = new Date(this.fromDate.year, this.fromDate.month, this.fromDate.day)
          this.currentCopy.FechaFinalPegar = new Date(this.toDate.year, this.toDate.month, this.toDate.day)
        }
        console.log(this.currentCopy)
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }


  handleError(errorResponse: HttpErrorResponse): void {
    console.log(errorResponse);
    switch (errorResponse.status) {
      case 409:
        this.errorMsg = 'Ya se encuentra registrado un tipo de dispositivo con ese nombre';
        break;
      case 500:
        this.errorMsgHeader = 'No se puede eliminar este tipo de dispositivo'
        this.errorMsg = 'Ya existen dispositivos que pertenecen a él';
        break;
      case 0:
        this.errorMsg = 'No se pudo conectar con el Servidor';
        break;
      case 404:
        this.errorMsg = 'No se pudo encontrar lo buscado';
        break;
      default:
        this.errorMsg = errorResponse.error;
        break;
    }
    this.failDialogComponent.openModal();
  }
}

