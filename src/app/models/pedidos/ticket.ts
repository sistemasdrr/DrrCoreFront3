export interface CurrentTicket{
  intValue : number
  strValue : string
}
export interface Ticket{
  id : number
  number : number
  idSubscriber : number
  revealName : boolean
  nameRevealed : string
  referenceNumber : string
  language : string
  queryCredit : string
  timeLimit : string
  subscriberIndications : string
  aditionalData : string
  about : string
  orderDate : Date
  expireDate : Date
  realExpireDate : Date
  idContinent : number
  idCountry : number
  reportType : string
  procedureType : string
  idCompany : number
  idPerson : number
  busineesName : string
  comercialName : string
  taxType : string
  taxCode : string
  email : string
  address : string
  city : string
  telephone : string
  creditrisk : number
  enable : boolean
  requestedName : string
  price : number
  userFrom : string
  commentary : string
  webPage : string

}
export interface SearchSituation{
  idCompany : number
  idPerson : number
  oldCode : string
  name : string
  taxName : string
  taxCode : string
  telephone : string
  idCountry : number
  country : string
  flagCountry : string
}
export interface TicketsByCompanyOrPerson{
  id :number
  ticket : string
  idStatusTicket : string
  status : string
  color : string
  requestedName : string
  subscriberCode : string
  procedureType : string
  reportType : string
  language : string
  orderDate : string
  endDate : string
  dispatchDate : string
}
export interface TimeLineTicket{
  id : number
  assignedTo : string
  assignedToName : string
  date : string
  time : string
  status : string
  color : string
  flag : boolean
}
export interface TicketObservations{
  reportName : string
  subscriberCode : string
  supervisor : string
  nameSupervisor : string
}
export interface ReportType{
  typeReport : string
  lastSearchedDate : string
  listSameSearched : HistorialPedido[]
}
export interface HistorialPedido{
  isPending : boolean
  dispatchtDate : string
  typeReport : string
  ticketNumber : string
  requestedName : string
  dispatch : string
  subscriber : string
  procedure : string
  status : string
}

export interface ListTicket{
  id : number
  idTicket : number
  number : string
  idSubscriber : number
  language : string
  about : string
  idContinent : number
  idCountry : number
  idCompany : number
  idPerson : number
  creditrisk : number
  enable : boolean
  subscriberCode : string
  subscriberName : string
  subscriberCountry : string
  subscriberFlag : string
  queryCredit : string
  timeLimit : string
  asignedTo : string
  asignedFrom : string
  revealName : boolean
  nameRevealed : string
  referenceNumber : string
  aditionalData : string
  subscriberIndications : string
  busineesName : string
  comercialName : string
  requestedName : string
  taxType : string
  taxCode : string
  investigatedContinent : string
  investigatedCountry : string
  investigatedFlag : string
  city : string
  email : string
  address : string
  telephone : string
  webPage : string
  reportType : string
  procedureType : string
  price : number
  orderDate : string
  expireDate : string
  realExpireDate : string
  dispatchDate : string
  quality : string
  qualityTypist : string
  qualityTranslator : string
  isComplement : boolean
  complementQuality : string
  complementQualityTypist : string
  complementQualityTranslator : string
  qualityReport : string
  status : string
  statusColor : string
  statusFinalOwner : string
  origen : string
  observations : string
  startDate : string
  endDate : string
  numberAssign : number
  references : number
}
export interface Asignacion{
  userFrom : string
  userTo : string
  assignedToCode : string
  assignedToName : string
  startDateD : Date|null
  endDateD :Date|null
  startDate : string
  endDate : string
  balance : boolean
  traduccion : boolean
  references : boolean
  forceSupervisor:boolean
  observations : string
  idTicket:number,
  type : string
  internal : boolean,
  numberAssign:number,
  assignedFromCode:string
  quality:string | null
  qualityTypist : string | null
  qualityTranslator : string | null
  hasBalance : boolean | null
  sendZip : boolean
  attachmentRefCom : boolean
  procedureTypeAgent:string
  specialPriceBalance: number
}

export interface ListTicket2{
  id : number
  idTicket : number
  number : string
  idSubscriber : number
  language : string
  about : string
  idContinent : number
  idCountry : number
  idCompany : number
  idPerson : number
  creditrisk : number
  enable : boolean
  subscriberCode : string
  subscriberName : string
  subscriberCountry : string
  subscriberFlag : string
  queryCredit : string
  timeLimit : string
  asignedTo : string
  otherUserCode : OtherUserCode[]
  asignedFrom : string
  revealName : boolean
  nameRevealed : string
  referenceNumber : string
  aditionalData : string
  subscriberIndications : string
  busineesName : string
  comercialName : string
  requestedName : string
  taxType : string
  taxCode : string
  investigatedContinent : string
  investigatedIsoCountry : string
  investigatedCountry : string
  investigatedFlag : string
  city : string
  email : string
  address : string
  telephone : string
  reportType : string
  procedureType : string
  price : number
  orderDate : string
  expireDate : string
  realExpireDate : string
  dispatchDate : string
  quality : string
  qualityTypist : string
  qualityTranslator : string
  qualityReport : string
  status : string
  statusColor : string
  statusFinalOwner : string
  origen : string
  observations : string
  startDate : string
  endDate : string
  numberAssign : number
  references : number
  webPage : string
  hasBalance : boolean
  isComplement : boolean
  complementQuality : string
  complementQualityTranslator : string
  complementQualityTypist : string
  specialPriceBalance:number
  lastReporterAgent:string
}
export interface OtherUserCode{
  code : string
  type : string
  active : boolean
}
export interface TicketListPending{
  id : number
  number : string
  name : string
  reportType : string
  procedureType : string
  orderDate : string
  realExpireDate : string
  expireDate : string
  receptor : number
  receptor2 : number
  commentary : string
  hasFiles : boolean
  files : any[]
}
export interface TicketQuery{
  idTicket: number,
  queryDate: Date,
  idSubscriber: number,
  subscriberName: string,
  language: string,
  email: string,
  message: string,
  status: number,
  report: string,
  response: string
}
export interface SendQuery{
    idTicket: number,
    queryDate: Date,
    idSubscriber: number,
    language: string,
    email: string,
    message: string,
    response:string,
    user:string
}

export interface SaveTicketAssignation{
  id : number
  idEmisor : number
  idReceptor : number
  commentary : string
}
export interface PersonalAssignation{
  porcentaje : number
  id : number
  idEmployee : number
  idUserLogin : number
  fullname : string
  type : string
  code : string
  internal : boolean
}
export interface ProviderByTicket{
  id : number
  idCompany : number
  idPerson : number
  name : string
  telephone : string
  country : string
  flagCountry : string
}
export interface TicketFile{
  id : number
  name : string
  path : string
  extension : string
  flag : boolean
  uploadDate:string
}
export interface TicketHistorySubscriber{
  id : number
  idCompany : number
  ticket : string
  name : string
  idCountry : number
  country : string
  flagCountry : string
  dispatchDate : string
}

export interface NewAsignacion{
  idTicketHistory : number
  asignedTo : string
  asignacion : Asignacion[]
  otherUserCode : OtherUserCode[]

}
export interface AddTicketObservations{
  id : number
  idTicket : number
  about : string
  idCompany : number
  idPerson : number
  idSubscriber : number
  idReason : number
  message : string
  conclusion : string
  idStatusTicketObservation : number
  cc : string
  observationDate : Date
  asignedDate : Date
  endDate : Date
  solutionDate : Date | null
  employeesObservated : EmployeesAssignated[]
}
export interface GetTicketObservations{
  id : number
  about : string
  idCompany : number
  idPerson : number
  idSubscriber : number
  idReason : number
  message : string
  conclusion : string
  idStatusTicketObservation : number
  cc : string
  observationDate : Date
  asignedDate : Date
  endDate : Date
  solutionDate : Date
  employeesObservated : EmployeesAssignated[]
}
export interface EmployeesAssignated{
  id : number
  userTo : string
  code : string
  name : string
}

export interface TicketHistoryCount{
  id : number
  idTicket : number
  userFrom : string
  userTo : string
  creationDate : Date
  updateDate : Date
  deleteDate : Date
  enable : boolean
  idStatusTicket : number
  asignedTo : string
  flag : boolean
  numberAssign : number
  balance : boolean
  references : boolean
  observations : string
  startDate : Date
  endDate : Date
}

export interface PendingTask{
  asignedTo : string
  count : number
}
export interface ObservedTickets{
  asignedTo : string
  idTicket : number
  ticket : string
}
export interface PendingTaskSupervisor{
  name: string;
  code: string;
  details : PendingTaskByUser[];
}
export interface PendingTaskByUser{
  asignedTo: string;
  type: string;
  name: string;
  country: string;
  flagCountry: string;
  details : PendingTaskByUserDetails[];
}
export interface PendingTaskByUserDetails{
  id: number;
  number: string;
  requestedName: string;
  country: string;
  flagCountry: string;
  orderDate: string;
  expireDate: string;
  flag: number;
}


export interface GetTicketUserResponseDto{
  code : string
  type : string
  flag : boolean
  procedureType:string
}
