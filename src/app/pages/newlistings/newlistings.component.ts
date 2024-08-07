import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { CropperDialogComponent } from '../../components/cropper-dialog/cropper-dialog.component';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher } from '@angular/material/core';
import { ListingsService } from '../../services/listings.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
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
  selector: 'app-newlistings',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ImageCropperComponent,
    CropperDialogComponent,
    MatInputModule,
  ],
  templateUrl: './newlistings.component.html',
  styleUrl: './newlistings.component.scss',
})
export class NewlistingsComponent {
  @ViewChild('cropperDialog')
  cropperDialog!: CropperDialogComponent;

  listingForm: FormGroup;
  imageChangedEvent: Event | null = null;
  croppedImage: string | null = null;

  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    private listingService: ListingsService,
    private authService: AuthService,
    private router: Router,
  ) {
    this.listingForm = this.fb.group({
      book: new FormGroup({
        author: new FormControl('', [Validators.required]),
        title: new FormControl('', Validators.required),
        publisher: new FormControl(''),
        course: new FormControl(''),
        cover_img: new FormControl(''),
      }),
      auctionDuration: new FormControl(1, [
        Validators.required,
        Validators.min(1),
      ]),
      minBid: new FormControl(0, [Validators.required, Validators.min(0)]),
    });
  }

  fileChangeEvent(event: any): void {
    if (event.target.files.length === 0) return;
    this.imageChangedEvent = event;
    this.cropperDialog.open();
  }

  croppingConfirmed(img: string) {
    if (img) {
      this.croppedImage = img;
    }
  }

  clearImg(): void {
    this.croppedImage = null;
  }

  preparePayload(): void {
    this.listingForm.get('book')?.get('cover_img')?.setValue(this.croppedImage);
    this.listingService.createListing(this.listingForm.value)
      .pipe(
        catchError(err=>of(err))
      )
      .subscribe(
    (response)=>{
        if(response instanceof HttpErrorResponse){
          if(response.status === 401){
            this.authService.logOut();
            this.router.navigate(['login']);
          }
          else {
            alert("somethingWentWrong")
          }
        } else {
            console.log(response);
            this.router.navigate([`books/details/${response.response._id}`]);
          }
      })
  }
}
