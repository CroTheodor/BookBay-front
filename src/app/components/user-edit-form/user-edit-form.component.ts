import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { UserDTO } from '../../interfaces/user.model';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MyErrorStateMatcher } from '../../utils/util-funs';

@Component({
  selector: 'app-user-edit-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
  ],
  templateUrl: './user-edit-form.component.html',
  styleUrl: './user-edit-form.component.scss',
})
export class UserEditFormComponent implements OnChanges {
  @Input()
  user: UserDTO | null = null;

  @Output()
  success: EventEmitter<UserDTO> = new EventEmitter<UserDTO>();

  @Output()
  error: EventEmitter<void> = new EventEmitter();

  public editForm!: FormGroup;
  public matcher = new MyErrorStateMatcher();
  errorMsg: string | null = null;
  apiLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']) {
      this.editForm = this.formBuilder.group({
        name: [this.user?.name, Validators.required],
        lastname: [this.user?.lastname, Validators.required],
        email: [
          this.user?.email,
          Validators.compose([Validators.required, Validators.email]),
        ],
      });
    }
  }

  public submitEdit() {
    this.userService
      .updateUser(this.user?._id!, this.editForm.value)
      .subscribe((res: any) => {
        if (res instanceof HttpErrorResponse) {
          this.error.emit();
        } else {
          const user = this.user!;
          user.name = this.editForm.get('name')!.value;
          user.lastname = this.editForm.get('lastname')!.value;
          user.email = this.editForm.get('email')!.value;
          this.success.emit(user);
        }
      });
  }
}
