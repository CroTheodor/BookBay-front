import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @ViewChild("dialogWrapper")
  dialog!: ElementRef;

  public close(): void{
    this.dialog.nativeElement.close();
  }

  public open(): void{
    this.dialog.nativeElement.showModal();
  }

}
