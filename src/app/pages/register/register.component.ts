import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { E_ROLE } from '../../interfaces/user.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { passwordMissmatch } from '../../utils/password.validator';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of } from 'rxjs';
import { MatSelectModule } from '@angular/material/select';
import { MyErrorStateMatcher } from '../../utils/util-funs';

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
    MatSelectModule,
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
    this.authService.isModerator();
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
        roles: [E_ROLE.STUDENT, Validators.compose([Validators.required])],
      },
      { validators: passwordMissmatch('password', 'confirm') },
    );
  }

  public get isModerator(){
    return this.authService.isModerator();
  }

  public submitRegister() {
    if (this.registerForm.valid) {
      this.registerForm.patchValue({ roles: [this.registerForm.get('roles')?.value] });
      this.apiLoading = true;
      const email = this.registerForm.get('email')?.value;
      const password = this.registerForm.get('password')?.value;
      this.isModerator
        ? this.registerMod()
        : this.registerUser(email, password);
    }
  }

  private registerUser(email: string, password: string) {
    this.authService
      .register(this.registerForm.value)
      .pipe(catchError((err) => of(err)))
      .subscribe((response: any) => {
        if (response.success) {
          this.authService.login(email, password, false).subscribe(() => {
            this.router.navigate(['']);
          });
        } else {
          this.errorMsg = response.message;
          this.apiLoading = false;
        }
      });
  }

  private registerMod() {
    this.authService
      .registerMod(this.registerForm.value)
      .pipe(catchError((err) => of(err)))
      .subscribe((response: any) => {
        if (!response.success) {
          alert('Something went wrong');
        } else {
          this.registerForm.reset();
        }
        this.apiLoading = false;
      });
  }
}
