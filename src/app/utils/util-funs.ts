import { HttpParams } from "@angular/common/http";

export function generateParams(obj: any): HttpParams{
  if(!obj){
    return new HttpParams();
  }
  let res = new HttpParams();
  Object.keys(obj).forEach((key)=>{
    res = res.set(key, obj[key]);
  })
  return res;
}
