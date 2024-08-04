import { Routes } from '@angular/router';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { BooksComponent } from './pages/books/books.component';
import { FaqComponent } from './pages/faq/faq.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { HomeComponent } from './pages/home/home.component';
import { StatisticsComponent } from './pages/statistics/statistics.component';
import { UserListingsComponent } from './pages/user-listings/user-listings.component';
import { NewlistingsComponent } from './pages/newlistings/newlistings.component';
import { BookDetailsComponent } from './pages/book-details/book-details.component';
import { AuthGuard } from './guards/authguard.guard';
import { ModeratorGuard } from './guards/moderator.guard';

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BooksComponent },
  { path: 'books/details/:id', component: BookDetailsComponent },
  { path: 'books/publish-listing', component: NewlistingsComponent, canActivate:[ AuthGuard ] },
  { path: 'faq', component: FaqComponent },
  { path: 'user', component: ProfileComponent, canActivate:[ AuthGuard ] },
  { path: 'user/listings', component: UserListingsComponent, canActivate:[ AuthGuard ] },
  { path: 'messages', component: MessagesComponent, canActivate:[ AuthGuard ] },
  { path: 'statistics', component: StatisticsComponent, canActivate:[ AuthGuard, ModeratorGuard ] },
  { path: '**', component: HomeComponent },
];
