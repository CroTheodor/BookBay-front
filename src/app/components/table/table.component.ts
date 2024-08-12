import { AfterViewInit, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { TableAction, TableColumn } from '../../interfaces/table.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnChanges, AfterViewInit {
  @Input()
  data: any[] | undefined;

  @Input()
  actions: TableAction[] | undefined;

  @Input()
  columns: TableColumn[] | null | undefined = null;

  @Input()
  showPaginator: boolean = true;

  @Output()
  paginatorEvent: EventEmitter<PageEvent> = new EventEmitter<PageEvent>();

  @ViewChild("tablePaginator")
  paginator!: MatPaginator;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public displayedColumns: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if(changes["data"]){
      this.dataSource = new MatTableDataSource(this.data);
      this.displayedColumns = this.columns?.map((column)=>column.label.toLowerCase())!;
      if(this.actions){
        this.displayedColumns.push("action");
      }
    }
    if(changes["actions"]){
      if(this.actions!.at(0)?.icon && !this.displayedColumns.includes("action")){
        this.displayedColumns.push("action");
        this.dataSource = new MatTableDataSource(this.data);
      }
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  public handlePageChange(pageEvent: PageEvent){
    this.paginatorEvent.emit(pageEvent);
  }

}
