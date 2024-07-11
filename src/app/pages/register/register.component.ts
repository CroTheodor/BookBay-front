import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { E_ROLE } from '../../interfaces/user.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import { passwordMissmatch } from '../../utils/password.validator';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of } from 'rxjs';

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

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  errorMsg: string | null = null;
  apiLoading: boolean = false;

  matcher = new MyErrorStateMatcher();

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: [null, Validators.required],
        lastname: [null, Validators.required],
        password: [
          null,
          Validators.compose([Validators.required, Validators.minLength(4)]),
        ],
        confirm: [
          null,
          Validators.compose([Validators.required, Validators.minLength(4)]),
        ],
        email: [
          null,
          Validators.compose([Validators.required, Validators.email]),
        ],
        roles: [[E_ROLE.STUDENT], Validators.compose([Validators.required])],
      },
      { validators: passwordMissmatch('password', 'confirm') },
    );
  }

  print() {
    console.log(this.registerForm);
  }

  public submitRegister() {
    if (this.registerForm.valid) {
      this.apiLoading = true;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      this.authService
        .register(this.registerForm.value)
        .pipe(catchError((err) => of(err)))
        .subscribe((response: any) => {
          if (response.success) {
            this.authService.login(email, password, false).subscribe(() => {
              this.router.navigate(['']);
            });
          } else {
            this.apiLoading = false;
            //TODO handle error
            this.errorMsg = response.message;
          }
        });
    }
  }
}
