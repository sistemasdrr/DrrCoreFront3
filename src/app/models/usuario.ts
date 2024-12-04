import { formatDate } from '@angular/common';

export interface Process{
  id : number
  name : string
  menu : string
  orderItem : number
  enable : boolean
}
export interface User{
  id : number
  idEmployee : number
  userLogin : string
  password : string
  enable : boolean
  emailPassword : string
}
export interface UserPermission{
  gerencia : UserProcess[]
  produccion : UserProcess[]
  administracion : UserProcess[]
  facturacion : UserProcess[]
  consultas : UserProcess[]
  reportes : UserProcess[]
}
export interface UserProcess{
  id : number
  idProcess : number
  idUser : number
  name : string
  path : string
  icon : string
  enable : boolean
  subLevel : UserProcess[]
}
export class Calendar {
  id: string;
  title: string;
  groupId: string;
  startDate: Date;
  endDate: Date;
  details: string;
  className: string;
  constructor(calendar: Calendar) {
    {
      this.id = calendar.id || '';
      this.title = calendar.title || '';
      this.groupId = calendar.groupId || '';
      this.startDate = calendar.startDate || new Date;
      this.endDate = calendar.endDate || new Date;
      this.details = calendar.details || '';
      this.className = calendar.className || '';
    }
  }
}
export interface Calendar1 {
  id: string
  title: string
  groupId: string
  className: string
  start: string
  end: string
  details: string
}
export interface AddCalendar {
  id: string
  title: string
  groupId: string
  className: string
  startDate: string
  endDate: string
  details: string
}
