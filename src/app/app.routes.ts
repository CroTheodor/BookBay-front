import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { BooksComponent } from './pages/books/books.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { HomeComponent } from './pages/home/home.component';
import { UserListingsComponent } from './pages/user-listings/user-listings.component';
import { NewlistingsComponent } from './pages/newlistings/newlistings.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { AuthGuard } from './guards/authguard.guard';
import { ModeratorGuard } from './guards/moderator.guard';
import { ListingUpdateComponent } from './pages/user-listings/listing-update/listing-update.component';
import { CompletePaymentComponent } from './pages/complete-payment/complete-payment.component';
import { ModeratorCaveComponent } from './pages/moderator-cave/moderator-cave.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'change-password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
  },
  { path: 'books', component: BooksComponent },
  { path: 'books/details/:id', component: BookDetailsComponent },
  {
    path: 'books/publish-listing',
    component: NewlistingsComponent,
    canActivate: [AuthGuard],
  },
  { path: 'faq', component: FaqComponent },
  { path: 'user', component: ProfileComponent, canActivate: [AuthGuard] },
  {
    path: 'user/listings',
    component: UserListingsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user/listings/pay/:id',
    component: CompletePaymentComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'listings/edit/:id',
    component: ListingUpdateComponent,
    canActivate: [AuthGuard],
  },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  {
    path: 'management',
    component: ModeratorCaveComponent,
    canActivate: [AuthGuard, ModeratorGuard],
  },
  { path: '**', component: HomeComponent },
];
