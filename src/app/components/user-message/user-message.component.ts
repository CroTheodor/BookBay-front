import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-message',
  standalone: true,
  imports: [],
  templateUrl: './user-message.component.html',
  styleUrl: './user-message.component.scss'
})
export class UserMessageComponent {

  @Input()
  message!: string;

  @Input()
  name!: string;

  @Input()
  lastname!: string;

  @Input()
  time!: string | null;

  @Input()
  alignLeft: boolean = true;

}
