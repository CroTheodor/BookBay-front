import { Component, OnDestroy, OnInit } from '@angular/core';
import { ListingsService } from '../../services/listings.service';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ListingDTO } from '../../interfaces/listing.model';
import { ShipmentInfoDTO, UserDTO } from '../../interfaces/user.model';
import { CommonModule } from '@angular/common';
import { ListingCardComponent } from '../../components/listing-card/listing-card.component';
import { DeliveryInfoCardComponent } from '../../components/delivery-info-card/delivery-info-card.component';
import moment from 'moment';

@Component({
  selector: 'app-complete-payment',
  standalone: true,
  imports: [CommonModule, ListingCardComponent, DeliveryInfoCardComponent],
  templateUrl: './complete-payment.component.html',
  styleUrl: './complete-payment.component.scss',
})
export class CompletePaymentComponent implements OnInit, OnDestroy {
  private listingId!: string;

  public listing: ListingDTO | null = null;
  public canCompletePayment: boolean = false;
  public excededDeadline: boolean = false;
  public userInfo: UserDTO;
  public paymentDeadline!: Date;
  public shipmentInfo: ShipmentInfoDTO | null = null;

  private destroy$: Subject<void> = new Subject();

  constructor(
    private listingService: ListingsService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.userInfo = this.authService.getUserInfo()!;
    this.shipmentInfo = this.userInfo.shipmentInfo ?? null;
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.listingId = params['id'];
      });
  }

  ngOnInit() {
    this.getListing();
  }

  public getListing() {
    this.listingService
      .getById(this.listingId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        const userId = this.authService.getUserInfo()?._id;
        const winnerId = (res.response.bidingUser as UserDTO)._id;
        this.canCompletePayment = userId === winnerId;
        if (!this.canCompletePayment && !this.authService.isModerator()) {
          alert('You cannot complete this payment');
          this.router.navigate(['/home']);
        }
        this.listing = res.response;
        this.paymentDeadline = moment(this.listing?.endDate).add(3, "d").toDate();
        const today = new Date();
        if(this.paymentDeadline < today){
          this.excededDeadline = true;
        }
      });
  }

  public handleChange(info: ShipmentInfoDTO){
    this.shipmentInfo = info;
  }

  public confirmPayment(){
    this.listingService.completePayment(this.listingId)
      .subscribe(
        (response: any)=>{
          if(this.listing)
            this.listing.paymentCompleted = true;
        }
      )
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
