import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ListingsService } from '../../services/listings.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ListingDTO, StatisticsDTO } from '../../interfaces/listing.model';
import { HttpErrorResponse} from '@angular/common/http';
import { E_ROLE, UserDTO } from '../../interfaces/user.model';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  PaginatedRequest,
} from '../../interfaces/http.model';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { UserEditFormComponent } from '../../components/user-edit-form/user-edit-form.component';
import { extractRole } from '../../utils/util-funs';
import { AuthService } from '../../services/auth.service';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TableComponent } from '../../components/table/table.component';
import {
  E_TABLE_ICONS,
  E_TABLE_ICONS_COLORS,
  LISTING_TABLE_COLUMN_DEF,
  TableAction,
  TableColumn,
  USER_TABLE_COLUMN_DEF,
} from '../../interfaces/table.interface';

@Component({
  selector: 'app-moderator-cave',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    DialogComponent,
    UserEditFormComponent,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    TableComponent,
  ],
  templateUrl: './moderator-cave.component.html',
  styleUrl: './moderator-cave.component.scss',
})
export class ModeratorCaveComponent implements OnInit, OnDestroy {
  @ViewChild('userPaginator') paginator!: MatPaginator;
  @ViewChild('editDialog') editDialog!: DialogComponent;
  @ViewChild('confirmDeleteUserDialog') confirmUserDeleteDialog!: DialogComponent;
  @ViewChild("confirmDeleteListingDialog") confirmDeleteListingDialog!: DialogComponent;

  public userActions: TableAction[] = [
    {
      icon: E_TABLE_ICONS.edit,
      color: E_TABLE_ICONS_COLORS.black,
      function: (user: UserDTO) => {
        this.editUser(user);
      },
      disabledFunction: (user: UserDTO) => {
        return this.checkIfDisabledEditUser(user);
      },
    },
    {
      icon: E_TABLE_ICONS.delete,
      color: E_TABLE_ICONS_COLORS.red,
      function: (user: UserDTO) => {
        return this.showConfirmDeleteUserDialog(user);
      },
      disabledFunction: (user: UserDTO) => {
        return this.checkIfDisabledEditUser(user);
      },
    },
  ];

  public listingActions: TableAction[] = [
    {
      icon: E_TABLE_ICONS.edit,
      color: E_TABLE_ICONS_COLORS.black,
      function: (listing: ListingDTO)=>{
        this.router.navigate(['/listings/edit/' + listing._id]);
      }
    },
    {
      icon: E_TABLE_ICONS.delete,
      color: E_TABLE_ICONS_COLORS.red,
      function: (listing: ListingDTO)=>{
        this.showConfirmDeleteListingDialog(listing);
      }
    },

  ]
  public userColumns: TableColumn[] = USER_TABLE_COLUMN_DEF;

  public listingColumns: TableColumn[] = LISTING_TABLE_COLUMN_DEF;

  public userDataSource: MatTableDataSource<UserDTO> =
    new MatTableDataSource<UserDTO>();

  public selectedUser: UserDTO | null = null;
  public isAdministrator: boolean = false;

  public selectedTab: number = 0;
  public statistics: StatisticsDTO | null = null;
  public pageIndexUser: number = 0;
  public pageSize: number = 10;
  public length: number = 10;
  public userSearchText: FormControl = new FormControl('', Validators.required);
  public users!: UserDTO[];

  public activeListings: ListingDTO[] = [];
  public pageIndexListings: number = 0;
  public pageSizeListings: number = 10;
  public lengthListings: number = 10;
  public selectedListing: ListingDTO | undefined;

  public pageEvent!: PageEvent;

  public userSearchFilter: FormControl = new FormControl(
    '',
    Validators.required,
  );
  private destroy$: Subject<void> = new Subject();
  private userFilterApplied: boolean = false;

  constructor(
    private listingService: ListingsService,
    private userService: UserService,
    private auth: AuthService,
    private router: Router,
  ) {
    this.isAdministrator = this.auth.isAdministrator();
  }

  ngOnInit(): void {
    this.getStatistics();
    this.getUsers();
    this.getActiveListings();
  }

  public getStatistics() {
    this.listingService
      .getStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: any) => {
        this.statistics = res.response;
      });
  }

  handlePageEventListing(event: PageEvent) {
    this.pageEvent = event;
    this.lengthListings = event.length;
    this.pageSizeListings = event.pageSize;
    this.pageIndexListings = event.pageIndex;

    this.getActiveListings();
  }

  public handlePageUsers(event: PageEvent) {
    this.pageEvent = event;
    this.length = event.length;
    this.pageSize = event.pageSize;
    this.pageIndexUser = event.pageIndex;

    this.getUsers();
  }

  public getUsers(filter?: any) {
    const paginator: PaginatedRequest = {
      page: this.pageIndexUser,
      limit: this.pageSize,
    };

    this.userService.getUsers(paginator, filter).subscribe((res: any) => {
      this.userDataSource = new MatTableDataSource<UserDTO>(
        res.response.content,
      );
      this.userDataSource.paginator = this.paginator;
      this.users = res.response.content;
    });
  }

  public userSearchFilterChange(filter: string) {
    if (filter === '-' && this.userFilterApplied) {
      this.userFilterApplied = false;
      this.getUsers();
    }
    this.userSearchText.setValue('');
  }

  public applyUserFilter() {
    this.userFilterApplied = true;
    this.resetUserPaginator();
    const filterType = this.userSearchFilter.value;
    switch (filterType) {
      case 'id':
        const filterId = {
          id: this.userSearchText.value,
        };
        this.getUsers(filterId);
        break;
      case 'email':
        const filterEmail = {
          email: this.userSearchText.value,
        };
        this.getUsers(filterEmail);
        break;
      case 'name':
        const filterName = {
          name: this.userSearchText.value,
        };
        this.getUsers(filterName);
        break;
      case 'lastname':
        const filterLastname = {
          lastname: this.userSearchText.value,
        };
        this.getUsers(filterLastname);
        break;
      case 'role':
        const searchVal: string = this.userSearchText.value;
        let roleSearchVal = '';
        if (searchVal.toLowerCase() === 'student') {
          roleSearchVal = E_ROLE.STUDENT;
        }
        if (searchVal.toLowerCase() === 'moderator') {
          roleSearchVal = E_ROLE.MODRATOR;
        }
        if (
          searchVal.toLowerCase() === 'administrator' ||
          searchVal.toLowerCase() === 'admin'
        ) {
          roleSearchVal = E_ROLE.ADMINISTRATOR;
        }
        const filterRole = {
          role: roleSearchVal,
        };
        this.getUsers(filterRole);
        break;
      default:
        this.getUsers();
        break;
    }
  }

  public getActiveListings() {
    const paginator: PaginatedRequest = {
      page: this.pageIndexListings,
      limit: this.pageSizeListings,
    };

    this.listingService
      .getActive(paginator)
      .pipe(catchError((err) => of(err)))
      .subscribe((response: any) => {
        this.lengthListings = response.response.totalItems;
        this.activeListings = response.response.content;
      });
  }

  public switchTab(tab: number) {
    this.selectedTab = tab;
  }

  public editUser(user: UserDTO) {
    this.selectedUser = user;
    this.editDialog.open();
  }

  public getRole(roles: E_ROLE[]) {
    return extractRole(roles);
  }

  public closeEditDialog() {
    this.editDialog.close();
  }

  public checkIfDisabledEditUser(user: UserDTO) {
    if (user.roles.includes(E_ROLE.ADMINISTRATOR)) {
      return true;
    }
    if (user.roles.includes(E_ROLE.MODRATOR)) {
      return !this.isAdministrator;
    }
    return false;
  }

  public editSuccess(user: UserDTO) {
    if (this.selectedUser) {
      this.selectedUser.email = user.email;
      this.selectedUser.name = user.name;
      this.selectedUser.lastname = user.lastname;
    }
    this.closeEditDialog();
  }

  public showConfirmDeleteUserDialog(user: UserDTO) {
    this.selectedUser = user;
    this.confirmUserDeleteDialog.open();
  }

  public showConfirmDeleteListingDialog(listing: ListingDTO){
    this.selectedListing = listing;
    this.confirmDeleteListingDialog.open();
  }

  public closeConfirmDialog() {
    this.confirmUserDeleteDialog.close();
  }

  public deleteUser() {
    this.userService
      .deleteUser(this.selectedUser!._id)
      .pipe(catchError((err) => of(err)))
      .subscribe((el) => {
        if (el instanceof HttpErrorResponse) {
          alert('Something went wrong');
        } else {
          this.getActiveListings();
          this.confirmUserDeleteDialog.close();
        }
      });
  }

  public createUser() {
    this.router.navigate(['/register']);
  }

  public closeConfirmDialogListing() {
    this.selectedListing = undefined;
    this.confirmDeleteListingDialog.close();
  }

  public deleteListing() {
    if(!this.selectedListing){
      return;
    }

    this.listingService.delete(this.selectedListing._id)
      .pipe(catchError((err) => of(err)))
      .subscribe((el) => {
        if (el instanceof HttpErrorResponse) {
          alert('Something went wrong');
        } else {
          this.getUsers();
          this.confirmUserDeleteDialog.close();
        }
      });
  }

  private resetUserPaginator() {
    this.pageSize = 10;
    this.pageIndexUser = 0;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
