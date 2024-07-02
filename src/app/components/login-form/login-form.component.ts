import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatInputModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {

  loginFormGroup: FormGroup;
  remember: boolean = false;

  constructor(
    private fb: FormBuilder
  ) {
    this.loginFormGroup = this.fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      remember: [null]
    })
  }

  public login() {
    if (this.loginFormGroup.valid) {
      const password = this.loginFormGroup.get("password");
      const email = this.loginFormGroup.get("email");
      const remember = this.loginFormGroup.get("remember");
    }
  }

}
