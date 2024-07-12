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

export const routes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'books', component: BooksComponent },
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'books/publish-listing', component: NewlistingsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'user', component: ProfileComponent },
  { path: 'user/listings', component: UserListingsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'statistics', component: StatisticsComponent },
  { path: '**', component: HomeComponent },
];
