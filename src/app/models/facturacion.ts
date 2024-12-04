export interface InvoiceSubcriberListByBill{
  idTicket : number
  number : string
  requestedName : string
  referenceNumber : string
  dispatchedName : string
  orderDate : string
  expireDate : string
  dispatchDate : string
  procedureType : string
  reportType : string
  idCountry : number
  country : string
  flagCountry : string
  price : number
  idSubscriber : number
  subscriberName : string
  subscriberCode : string
  idInvoiceState : number
}
export interface GetSubscriberPricesDto{
  priceT1 : number
  priceT2 : number
  priceT3 : number
}
export interface InvoiceSubcriberCCListByBill{
  idSubscriber : number
  name : string
  code : string
  country : string
  flagCountry : string
  history : InvoiceSubscriberCCHistory[]
}
export interface InvoiceSubscriberCCHistory{
  id : number
  couponAmount : number
  unitPrice : number
  totalPrice : number
  purchaseDate : string
}
export interface InvoiceSubcriberListToCollect{
  id : number
  invoiceCode : string
  idCurrency : number
  idSubscriber : number
  subscriberName : string
  subscriberCode : string
  invoiceEmitDate : Date | null
  details : InvoiceDetailsSubcriberToCollect[]
}
export interface InvoiceSubcriberCCListToCollect{
  id : number
  invoiceCode : string
  idCurrency : number
  idSubscriber : number
  subscriberName : string
  subscriberCode : string
  invoiceEmitDate : Date | null
  quantity : number
  totalPrice : number
}
export interface InvoiceSubcriberListPaids{
  id : number
  idSubscriber : number
  subscriberName : string
  subscriberCode : string
  details : InvoiceDetailsSubcriberPaids[]
}
export interface InvoiceSubcriberCCListPaids{
  id : number
  invoiceCode : string
  idCurrency : number
  idSubscriber : number
  subscriberName : string
  subscriberCode : string
  invoiceEmitDate : Date | null
  invoiceCancelDate : Date | null
  quantity : number
  totalPrice : number
}
export interface InvoiceDetailsSubcriberToCollect{
  idSubscriberInvoiceDetails : number
  idSubscriberInvoice : number
  idTicket : number
  number : string
  requestedName : string
  orderDate : string
  dispatchDate : string
  referenceNUmber : string
  IdCountry : string
  country : string
  flagCountry : string
  procedureType : string
  reportType : string
  price : number
}
export interface InvoiceDetailsSubcriberPaids{
  idTicket : number
  number : string
  requestedName : string
  orderDate : string
  dispatchDate : string
  referenceNUmber : string
  IdCountry : string
  country : string
  flagCountry : string
  procedureType : string
  reportType : string
  price : number
}


export interface AddInvoiceSubscriber{
  invoiceCode : string
  invoiceDate : Date | null
  language : string
  idCurrency : number
  idCountry : number
  idSubscriber : number
  exchangeRate : number
  subscriberCode : string
  attendedByName : string
  attendedByEmail : string
  taxTypeCode : string
  address : string
  attendedBy : string
  igv : number
  invoiceSubscriberList : InvoiceSubcriberListByBill[]
}
export interface AddInvoiceSubscriberCC{
  invoiceCode : string
  invoiceDate : Date | null
  language : string
  idCurrency : number
  idCountry : number
  idSubscriber : number

  exchangeRate : number
  subscriberCode : string
  attendedByName : string
  attendedByEmail : string
  taxTypeCode : string
  igv : number
  address : string
  attendedBy : string
  quantity : number
  totalPrice : number
  details : InvoiceSubscriberCCHistory[]
}

export interface InvoiceAgentList{
  idTicket : number
  idTicketHistory : number
  number : string
  requestedName : string
  dispatchedName : string
  orderDate : string
  expireDate : string
  shippingDate : string
  procedureType : string
  reportType : string
  idCountry : number
  country : string
  flagCountry : string
  price : number
  idAgent : number
  agentName : string
  agentCode : string
  quality : string
}
export interface NewAgentInvoice{
  idTicketHistory : number
  idAgent : number
  number : string
  asignedTo : string
  requestedName : string
  orderDate : string
  shippingDate : string
  realExpireDate : string
  idCountry : number
  iso : string
  flag : string
  quality : string
  procedureType : string
  price : number
  hasBalance : boolean
  idSpecialAgentBalancePrice : number
  isComplement : boolean
  idTicketComplement : number
}
export interface AddInvoiceAgent{
  invoiceCode : string
  invoiceDate : Date | null
  language : string
  idCurrency : number
  idAgent : number
  agentCode : string
  idCountry : number
  attendedByName : string
  attendedByEmail : string
  invoiceAgentList : NewAgentInvoice[]
}


export interface GetAgentInvoice{
  id : number
  invoiceCode : string
  idAgent : number
  agentCode : string
  agentName : string
  idCurrency : number
  details : AgentInvoiceDetails[]
}

export interface AgentInvoiceDetails{
  id : number
  idAgentInvoice : number
  requestedName : string
  businessName : string
  orderDate : string
  shippingDate : string
  expireDate : string
  idCountry : number
  country : string
  flagCountry : string
  procedureType : string
  quality : string
  price : number
}
export interface GetPersonalToInvoice{
  idUser : number
  idEmployee : number
  type : string
  code : string
  firstName : string
  lastName : string
  idCountry : number
  country : string
  flagCountry : string
}
