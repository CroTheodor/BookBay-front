import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthService } from '../../services/auth.service';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  loginFormGroup: FormGroup;
  displayWrongPasswordError: boolean = false;
  displayGenericError: boolean = false;

  @Output()
  loginSuccessfull: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginFormGroup = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      remember: [null]
    })
  }

  public login() {
    this.displayGenericError = this.displayWrongPasswordError = false;
    if (this.loginFormGroup.valid) {
      const password = this.loginFormGroup.get("password")?.value;
      const email = this.loginFormGroup.get("email")?.value;
      const remember = this.loginFormGroup.get("remember")?.value;
      this.authService.login(email, password, remember)
        .pipe(
          catchError(
            (error: any)=>{
              console.log(error);
              return of(error);
            })
        ).subscribe(
          (response)=>{
            if(response instanceof HttpErrorResponse){
              if(response.status === 401){
                this.displayWrongPasswordError = true;
              }else{
                this.displayGenericError = true;
              }
            } else{
              this.loginSuccessfull.emit();
            }
          }
        )
    }
  }

}
