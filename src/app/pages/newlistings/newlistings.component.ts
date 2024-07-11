import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ImageCropperComponent,
} from 'ngx-image-cropper';
import { CropperDialogComponent } from '../../components/cropper-dialog/cropper-dialog.component';

@Component({
  selector: 'app-newlistings',
  standalone: true,
  imports: [ReactiveFormsModule, ImageCropperComponent, CropperDialogComponent],
  templateUrl: './newlistings.component.html',
  styleUrl: './newlistings.component.scss',
})
export class NewlistingsComponent {
  @ViewChild('cropperDialog')
  cropperDialog!: CropperDialogComponent;

  listingForm: FormGroup;
  imageChangedEvent: Event | null = null;
  croppedImage: string | null = null;

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

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.cropperDialog.open();
  }

  croppingConfirmed(img: string){
    if(img){
      this.croppedImage = img;
      this.listingForm.get("book")?.get("img")?.setValue(img);
    }
  }
}
