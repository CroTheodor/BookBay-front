import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { passwordMissmatch } from '../../utils/password.validator';
import { MyErrorStateMatcher } from '../../utils/util-funs';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  public changeForm;

  public matcher = new MyErrorStateMatcher();

  public apiLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.authService.initPasswordChangeProcedure();
    this.changeForm = this.formBuilder.group(
      {
        password: [
          null,
          Validators.compose([Validators.required, Validators.minLength(4)]),
        ],
        confirm: [
          null,
          Validators.compose([Validators.required, Validators.minLength(4)]),
        ],
      },
      { validators: passwordMissmatch('password', 'confirm') },
    );
  }

  public sumbitPasswordChange() {
    this.authService.finalizePasswordChangeProcedure(this.changeForm.get("password")?.value!)?.subscribe(
        (res)=>{
          this.router.navigate(['home']);
        }
      )
  }
}
