import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FolderItem } from '../models/folderItemModel';
import { FolderItemType } from '../enums/folderItemType';

@Component({
  selector: 'folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.css']
})

export class FolderItemComponent implements OnInit {

  @Input() folderItem!: FolderItem;

  @Output() folderItemClick = new EventEmitter<FolderItem>();

  static folderIconPath = "assets/folderIcon.png";
  static fileIconPath = "assets/fileIcon.png";

  iconPath!: string;

  ngOnInit() {
    this.iconPath = this.folderItem.type == FolderItemType.Folder ? FolderItemComponent.folderIconPath : FolderItemComponent.fileIconPath;
  }

  onFolderItemClicked() {
      this.folderItemClick.emit(this.folderItem);
  }
}
