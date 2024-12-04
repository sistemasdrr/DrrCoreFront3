import { Traduction } from "./datos-empresa"

export interface CompanyImages{
  id : number
  idCompany : number
  imgDesc1 : string
  path1 : string
  imgDesc2 : string
  path2 : string
  imgDesc3 : string
  path3 : string
  imgDesc4 : string
  path4 : string
  traductions : Traduction[]
}
export interface CompanyImg{
  id : number
  idCompany : number
  img1 : string
  imgDesc1 : string
  imgDescEng1 : string
  imgPrint1 : boolean
  img2 : string
  imgDesc2 : string
  imgDescEng2 : string
  imgPrint2 : boolean
  img3 : string
  imgDesc3 : string
  imgDescEng3 : string
  imgPrint3 : boolean
  img4 : string
  imgDesc4 : string
  imgDescEng4 : string
  imgPrint4 : boolean
}
