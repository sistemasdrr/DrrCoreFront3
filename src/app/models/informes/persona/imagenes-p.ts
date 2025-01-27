import { Traduction } from "../empresa/datos-empresa"

export interface PersonImages{
  id : number
  idPerson : number
  imgDesc1 : string
  path1 : string
  imgDesc2 : string
  path2 : string
  imgDesc3 : string
  path3 : string
  traductions : Traduction[]
}
export interface PersonPhoto{
  id : number
  idPerson : number
  numImg : number
  base64 : string
  description : string
  descriptionEng : string
  printImg : boolean

}
export interface PersonImg{
  id1 : number
  id2 : number
  id3 : number
  id4 : number
  idPerson : number
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
