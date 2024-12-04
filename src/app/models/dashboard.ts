export interface SeriesDashboard{
  series : SeriesDb[]
  colors : string[]
  categories : string[]
}

export interface SeriesDb{
  name : string
  data : number[]
}
