import { ElementRef, TemplateRef } from '@angular/core';
import { ListingDTO } from './listing.model';
import { UserDTO } from './user.model';
import { extractRole } from '../utils/util-funs';
import moment from 'moment';

export interface TableColumn {
  label: string;
  fieldName: string;
  forcedValue?: string;
  calculateValue?: (el: any) => string;
}

export interface TableAction {
  icon: E_TABLE_ICONS;
  color: E_TABLE_ICONS_COLORS;
  function: (el: any) => void;
  disabledFunction?: (el: any) => boolean;
}

export enum E_TABLE_ICONS {
  edit = 'edit',
  delete = 'delete',
}

export enum E_TABLE_ICONS_COLORS {
  black = '#333333',
  red = 'darkred',
  blue = 'blue',
}

export const LISTING_TABLE_COLUMN_DEF: TableColumn[] = [
  { label: 'ID', fieldName: '_id' },
  {
    label: 'Posting user',
    fieldName: 'postingUser',
    calculateValue: (listing: ListingDTO) => {
      const postingUser = listing.postingUser as UserDTO;
      return `${postingUser.lastname} ${postingUser.name}`;
    },
  },
  {
    label: 'Book title',
    fieldName: 'bookTitle',
    calculateValue: (listing: ListingDTO) => {
      return listing.book.title;
    },
  },
  {
    label: 'Book author',
    fieldName: 'bookAuthor',
    calculateValue: (listing: ListingDTO) => {
      return listing.book.author;
    },
  },
  {
    label: 'Min bid',
    fieldName: 'minBid',
    calculateValue: (listing: ListingDTO) => {
      return `${listing.minBid} €`;
    },
  },
  {
    label: 'N. of bids',
    fieldName: 'nOfBids',
    calculateValue: (listing: ListingDTO) => {
      return listing.bids ? listing.bids.length.toString() : '0';
    },
  },
  {
    label: 'Current bid',
    fieldName: 'currentBid',
    calculateValue: (listing: ListingDTO) => {
      return listing.currentBid ? `${listing.currentBid.toFixed(2)} €` : '-';
    },
  },
  {
    label: 'Expire on',
    fieldName: "expirationDate",
    calculateValue: (listing: ListingDTO) => {
      return moment(listing.endDate).format("DD-MM-YYYY HH:mm")
    }
  }
];

export const USER_TABLE_COLUMN_DEF: TableColumn[] = [
  { label: 'ID', fieldName: '_id' },
  { label: 'Name', fieldName: 'name' },
  { label: 'Lastname', fieldName: 'lastname' },
  { label: 'Email', fieldName: 'email' },
  {
    label: 'Role',
    fieldName: 'displayedRole',
    calculateValue: (el: UserDTO) => {
      return extractRole(el.roles);
    },
  },
];
