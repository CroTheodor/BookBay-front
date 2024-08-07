import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ListingsService } from '../../../services/listings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { ListingDTO } from '../../../interfaces/listing.model';
import { AuthService } from '../../../services/auth.service';
import { UserDTO } from '../../../interfaces/user.model';
import { ListingCardComponent } from '../../../components/listing-card/listing-card.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { CropperDialogComponent } from '../../../components/cropper-dialog/cropper-dialog.component';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';

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
  selector: 'app-listing-update',
  standalone: true,
  imports: [
    ListingCardComponent,
    ReactiveFormsModule,
    ImageCropperComponent,
    CropperDialogComponent,
    MatInputModule,
  ],
  templateUrl: './listing-update.component.html',
  styleUrl: './listing-update.component.scss',
})
export class ListingUpdateComponent implements OnInit, OnDestroy {
  @ViewChild('cropperDialog')
  cropperDialog!: CropperDialogComponent;

  imageChangedEvent: Event | null = null;
  croppedImage: string | null = null;

  matcher = new MyErrorStateMatcher();
  public listingId!: string;
  public listing: ListingDTO | null = null;

  private destroy$ = new Subject();

  public listingForm: FormGroup;

  public disableAuctionValues: boolean = false;

  constructor(
    private listingService: ListingsService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.listingId = params['id'];
    });

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

  ngOnInit(): void {
    this.getListing();
  }

  private getListing() {
    this.listingService
      .getById(this.listingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((listing: any) => {
        const tmp = listing.response as ListingDTO;
        const postingUser = tmp.postingUser as UserDTO;
        if (
          !this.authService.isUsersId(postingUser._id) &&
          !this.authService.isModerator()
        ) {
          alert('You have no rights to edit this listing');
          this.router.navigate(['/home']);
        }
        this.listing = tmp;
        this.loadFormData();
      });
  }

  private loadFormData() {
    const bids = this.listing?.bids;
    let hasBids = false;
    if (bids) {
      hasBids = bids.length > 0;
    }

    this.disableAuctionValues = hasBids && !this.authService.isModerator();

    this.listingForm = this.fb.group({
      book: new FormGroup({
        author: new FormControl(this.listing?.book.author, [
          Validators.required,
        ]),
        title: new FormControl(this.listing?.book.title, Validators.required),
        publisher: new FormControl(this.listing?.book.publisher ?? ''),
        course: new FormControl(this.listing?.book.course ?? ''),
        cover_img: new FormControl(''),
      }),
      auctionDuration: new FormControl(
        { value: this.listing?.auctionDuration, disabled: this.disableAuctionValues },
        Validators.compose([Validators.required, Validators.min(1)]),
      ),
      minBid: new FormControl(
        { value: this.listing?.minBid, disabled: this.disableAuctionValues },
        Validators.compose([Validators.required, Validators.min(0)]),
      ),
    });

    if(this.listing?.book.cover_img){
      this.croppedImage = this.listing?.book.cover_img;
    }

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
    let updatedListing = this.listingForm.value;
    if(this.disableAuctionValues){
      delete updatedListing.minBid;
      delete updatedListing.auctionDuration;
    }
    this.listingService.updateListing(this.listingId, this.listingForm.value)
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
          this.listingForm.markAsPristine();
        }
      })
  }

  public goToDetails(){
    this.router.navigate([`books/details/${this.listingId}`])
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
