import { AfterViewInit, Component, Inject, Input, OnInit } from '@angular/core';
import { FolderItem } from '../../models/folder-item-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FilesService } from '../../services/files/files.service';

@Component({
  selector: 'carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { imageItems: FolderItem[], selectedImagePath: string },
    public _filesService: FilesService) {
  }

  currentImageFullUrl!: string;

  currentImageIndex!: number;

  ngOnInit(): void {

    this.getImageFullUrl(this.data.selectedImagePath);

    this.currentImageIndex = this.data.imageItems.findIndex(i => i.path == this.data.selectedImagePath);
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
}
