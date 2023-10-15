import { Component, Input, Output, EventEmitter, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { FolderItem } from '../../models/folderItemModel';
import { FolderItemType } from '../../enums/folderItemType';
import { FolderItemActionType } from '../../enums/folderItemActionType';
import { MatMenuTrigger } from '@angular/material/menu';

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

  static folderItemActionTypes = Object.values(FolderItemActionType).filter(value => typeof value === 'string') as string[];
  static folderDefaultIconPath = "assets/folderIcon.png";
  static fileDefaultIconPath = "assets/fileIcon.png";

  FolderItemComponent = FolderItemComponent;

  iconPath!: string;

  @ViewChild(MatMenuTrigger)
  contextMenu!: MatMenuTrigger;

  contextMenuPosition = { x: '0px', y: '0px' };

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

  onFolderItemActionIconClicked(actionTypeName: string) {
    this.folderItemActionIconClick.emit(this.getActionIconType(actionTypeName));
  }

  stringIsNullOrWhitespace(input: string | null | undefined): boolean {
    return !input || !input.trim();
  }

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    //this.contextMenu.menuData = { 'item': this.folderItem };
    this.contextMenu.openMenu();
  }

  onMenuMouseLeave() {
    this.contextMenu.closeMenu();
  }

  getActionIconImgPath(actionTypeName: string): string {

    switch (this.getActionIconType(actionTypeName)) {
      case FolderItemActionType.Download:
        return "download";
      case FolderItemActionType.Rename:
        return "edit_note";
      case FolderItemActionType.Copy:
        return this.folderItem.type == FolderItemType.Folder ? "folder_copy" : "file_copy";
      case FolderItemActionType.Cut:
        return "content_cut";
      case FolderItemActionType.Delete:
        return "delete";
      default:
        throw new Error(`${actionTypeName} icon is not defined`);
    }
  }

  getActionIconType(actionTypeName: string): FolderItemActionType {
    return FolderItemActionType[actionTypeName as keyof typeof FolderItemActionType];
  }
}
