import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwordMissmatch(password: string, confirm: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fg = control as FormGroup;
    const pw = fg.get(password);
    const cf = fg.get(confirm);
    if(pw && cf && pw.value !== cf.value){
      return {passwordMissmatch: true};
    }
    return null;
  };
}
