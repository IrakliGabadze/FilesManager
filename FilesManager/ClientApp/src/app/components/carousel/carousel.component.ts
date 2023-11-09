import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FolderItem } from '../../models/folder-item-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilesService } from '../../services/files/files.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit, OnDestroy {

  private dialogRefSubscription!: Subscription;
  constructor(
    private _dialogRef: MatDialogRef<CarouselComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { imageItems: FolderItem[], selectedImagePath: string },
    public _filesService: FilesService) {
  }

  currentImageFullUrl!: string;

  currentImageIndex!: number;

  ngOnInit(): void {

    this.getImageFullUrl(this.data.selectedImagePath);

    this.currentImageIndex = this.data.imageItems.findIndex(i => i.path == this.data.selectedImagePath);

    this._dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'ArrowLeft' && this.previousImageIsAvailable()) {
        this.previousImage();
      } else if (event.key === 'ArrowRight' && this.nextImageIsAvailable()) {
        this.nextImage();
      }
    });
  }

  nextImage() {

    this.currentImageIndex++;

    this.getImageFullUrl(this.data.imageItems[this.currentImageIndex].path);
  }

  previousImage() {

    this.currentImageIndex--;

    this.getImageFullUrl(this.data.imageItems[this.currentImageIndex].path);
  }

  getImageFullUrl(imagePartialPath: string) {

    var methodNameWithQueryParams = `${FilesService.downloadFileApiMethodName}?folderItemPartialPath=${imagePartialPath}`

    this.currentImageFullUrl = this._filesService.getFullUrl(methodNameWithQueryParams);
  }

  previousImageIsAvailable(): boolean {
    return this.currentImageIndex > 0
  }

  nextImageIsAvailable(): boolean {
    return this.currentImageIndex < this.data.imageItems.length - 1
  }

  ngOnDestroy(): void {
    if (this.dialogRefSubscription) {
      this.dialogRefSubscription?.unsubscribe();
    }
  }
}
