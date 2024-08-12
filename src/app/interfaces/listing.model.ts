import { UserDTO } from './user.model';

export interface ListingDTO {
  _id: string;
  postingUser: string | UserDTO;
  book: BookDTO;
  minBid: number;
  auctionDuration: number;
  currentBid?: number;
  bidingUser?: string | UserDTO;
  bids?: BidDTO[];
  listingDate: Date;
  endDate: Date;
  listingCompleted?: boolean;
  paymentCompleted?: boolean;
  placeBid: (amount: number, bidingUser: string) => boolean;
  isAuctionOver: () => boolean;
  setupDates: (auctionTime: number) => void;
}

export interface BidDTO {
  amount: number;
  biderId: string;
  date: Date;
}

export interface BookDTO {
  title: string;
  author: string;
  cover_img?: string;
  publisher?: string;
  course?: string;
}

export interface ListingRequestFilter {
  title?: string;
  author?: string;
  publisher?: string;
  course?: string;
}

export interface StatisticsDTO {
  activeListings: number;
  bidsNoPaymentListings: number;
  noBidsListings: number;
  successufListings: number;
  totalListings: number;
  totalUsers: number;
  awaitingPayment: number;
}
