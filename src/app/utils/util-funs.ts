import { HttpParams } from "@angular/common/http";
import { E_ROLE } from "../interfaces/user.model";
import { ErrorStateMatcher } from "@angular/material/core";
import { FormControl, FormGroupDirective, NgForm } from "@angular/forms";

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

export function extractRole(roles: E_ROLE[]): string{
  if(roles.includes(E_ROLE.ADMINISTRATOR)){
    return "Administrator";
  }
  if(roles.includes(E_ROLE.MODRATOR)){
    return "Moderator";
  }
  return "Student";
}
/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null,
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}
