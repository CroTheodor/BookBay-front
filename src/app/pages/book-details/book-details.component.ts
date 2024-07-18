import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { ListingsService } from '../../services/listings.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ListingDTO } from '../../interfaces/listing.model';
import { UserDTO } from '../../interfaces/user.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { Subscription, catchError, of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import moment from 'moment';
import { SocketService } from '../../services/socket.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [MatInputModule, CommonModule, FormsModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss',
})
export class BookDetailsComponent {
  @ViewChild('bidCell')
  bidCell!: ElementRef;

  private listingId!: string;
  public listingInfo!: ListingDTO;
  public publisherInfo!: UserDTO;
  public amount = '';
  public timeLeft = '';

  public auctionFinished = false;

  private subscriptions: Subscription[] = [];

  private timeoutHandler!: ReturnType<typeof setTimeout>;

  constructor(
    private listingService: ListingsService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private socket: SocketService,
    private renderer: Renderer2,
    private router: Router,
  ) {
    this.listingId = this.route.snapshot.paramMap.get('id')!;
    this.retrieveInfo();
    this.listenToBidUpdate();
  }

  retrieveInfo() {
    this.listingService.getById(this.listingId).subscribe((res: any) => {
      this.listingInfo = res.response;
      this.publisherInfo = res.response.postingUser as UserDTO;
      this.calculateTime();
    });
  }

  amountValid(): boolean {
    let inferiourAmount = false;
    const currentBid = this.listingInfo.currentBid;

    if (currentBid) {
      // Makign sure the amount cannot be greater than 0.000001 or something similar
      inferiourAmount =
        parseFloat(currentBid.toFixed(1)) >=
        parseFloat(parseFloat(this.amount).toFixed(1));
    }

    if (!this.amount || this.amount.length === 0 || inferiourAmount) {
      return false;
    }
    return true;
  }

  isUsersBook(): boolean {
    return this.authService.isUsersId(
      (this.listingInfo.postingUser as UserDTO)._id,
    );
  }

  placeBid() {
    const amount = parseFloat(parseFloat(this.amount).toFixed(2));
    this.listingService
      .placeBid(this.listingId, amount)
      .pipe(catchError((err) => of(err)))
      .subscribe((res) => {
        if (res instanceof HttpErrorResponse) {
          alert('SOMETHING WENT WRONG');
          if (res.status === 401) {
            this.authService.logOut();
            this.router.navigate(['login']);
          }
        }
        this.amount = '';
      });
  }

  //SETS UP THE TIMER IF THERE'S LESS THAN 24h
  private calculateTime() {
    const now = moment(new Date());
    const endDate = moment(this.listingInfo.endDate);
    const timeDiff = moment.duration(endDate.diff(now));

    if (timeDiff.asDays() >= 1) {
      this.timeLeft = `${parseInt(timeDiff.asDays().toString())} days`;
    } else {
      const hours = timeDiff.hours() >= 0 ? timeDiff.hours() : 0;
      const minutes = timeDiff.minutes() >= 0 ? timeDiff.minutes() : 0;
      const seconds = timeDiff.seconds() >= 0 ? timeDiff.seconds() : 0;
      this.timeLeft = `${hours >= 10 ? hours : '0' + hours}:${minutes >= 10 ? minutes : '0' + minutes}:${seconds >= 10 ? seconds : '0' + seconds}`;
      if (hours <= 0 && minutes <= 0 && seconds <= 0) {
        clearTimeout(this.timeoutHandler);
        this.auctionFinished = true;
        return;
      }
      this.timeoutHandler = setTimeout(() => this.calculateTime(), 1000);
    }
  }

  private listenToBidUpdate() {
    const socket = this.socket.getSocket();
    socket.on('bid', (newBid) => {
      this.listingInfo.currentBid = newBid.currentBid;
      this.listingInfo.bids = newBid.bids;
      this.higlightBid();
    });
  }

  private higlightBid() {
    this.renderer.addClass(this.bidCell.nativeElement, 'bid-updated');
    setTimeout(
      () =>
        this.renderer.removeClass(this.bidCell.nativeElement, 'bid-updated'),
      2000,
    );
  }

  ngOnDestory() {
    clearTimeout(this.timeoutHandler);
  }
}
