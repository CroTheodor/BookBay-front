import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { DialogComponent } from '../dialog/dialog.component';
import {
  ImageCroppedEvent,
  ImageCropperComponent,
  LoadedImage,
} from 'ngx-image-cropper';

@Component({
  selector: 'app-cropper-dialog',
  standalone: true,
  imports: [DialogComponent, ImageCropperComponent],
  templateUrl: './cropper-dialog.component.html',
  styleUrl: './cropper-dialog.component.scss',
})
export class CropperDialogComponent implements OnChanges {
  @ViewChild('cropperDialog')
  cropperDialog!: DialogComponent;

  @ViewChild('imageCropper')
  imageCropper!: ImageCropperComponent;

  @Input()
  fileChangedEvent: Event | null = null;

  @Input()
  base64img!: string;

  @Output()
  onCrop: EventEmitter<string> = new EventEmitter<string>();

  croppedImage!: string;
  width: number | null = null;
  height: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes) {
      this.width = this.height = null;
    }
  }

  open(): void {
    this.cropperDialog.open();
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64!;
    this.width = event.width;
    this.height = event.height;
  }

  cancelCrop(): void {
    this.cropperDialog.close();
  }

  confirm(): void{
    this.onCrop.emit(this.croppedImage);
    this.cropperDialog.close();
  }
}
