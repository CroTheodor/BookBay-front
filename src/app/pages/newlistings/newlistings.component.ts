import { Component } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-newlistings',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './newlistings.component.html',
  styleUrl: './newlistings.component.scss',
})
export class NewlistingsComponent {
  listingForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.listingForm = this.fb.group({
      book: new FormGroup({
        author: new FormControl('', [Validators.required]),
        title: new FormControl('', Validators.required),
        publisher: new FormControl(''),
        course: new FormControl(''),
        img: new FormControl(''),
      }),
      auctionDuration: new FormControl(0, [
        Validators.required,
        Validators.min(1),
      ]),
      minBid: new FormControl(0, [Validators.required, Validators.min(0)]),
    });
  }
}
