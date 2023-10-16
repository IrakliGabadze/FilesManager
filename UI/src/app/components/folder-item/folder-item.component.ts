import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation } from '@angular/core';
import { FolderItem } from '../../models/folderItemModel';
import { FolderItemType } from '../../enums/folderItemType';
import { FolderItemActionType } from '../../enums/folderItemActionType';

@Component({
  selector: 'folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class FolderItemComponent implements OnInit {

  @Input() folderItem!: FolderItem;

  @Output() folderItemClick = new EventEmitter<FolderItem>();
  @Output() folderItemActionIconClick = new EventEmitter<FolderItemActionType>();

  static folderDefaultIconPath = "assets/folderIcon.png";
  static fileDefaultIconPath = "assets/fileIcon.png";

  iconPath!: string;

  ngOnInit() {
    if (this.folderItem.type == FolderItemType.Folder) {
      this.iconPath = FolderItemComponent.folderDefaultIconPath;
    }
    else if (!this.stringIsNullOrWhitespace(this.folderItem.fileThumbnail)) {
      this.iconPath = this.folderItem.fileThumbnail!;
    }
    else {
      this.iconPath = FolderItemComponent.fileDefaultIconPath;
    }
  }

  onFolderItemClicked() {
    this.folderItemClick.emit(this.folderItem);
  }

  stringIsNullOrWhitespace(input: string | null | undefined): boolean {
    return !input || !input.trim();
  }
}
