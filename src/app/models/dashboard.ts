export interface SeriesDashboard{
  series : SeriesDb[]
  colors : string[]
  categories : string[]
  totalOR:number
  totalRV:number
  totalEF:number
  totalGeneral:number
}

export interface SeriesDb{
  name : string
  data : number[]
}
