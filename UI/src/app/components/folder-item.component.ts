import { Component, Input, OnInit } from '@angular/core';
import { FolderItemModel } from '../models/folderItemModel';
import { FolderItemType } from '../enums/folderItemType';

@Component({
  selector: 'folder-item',
  templateUrl: './folder-item.component.html',
  styleUrls: ['./folder-item.component.css']
})

export class FolderItemComponent implements OnInit{

 @Input() folderItem!: FolderItemModel;

  static folderIconPath:string = "assets/folderIcon.png";
  static fileIconPath = "assets/fileIcon.png";

  iconPath!:string;

  ngOnInit(){
    this.iconPath = this.folderItem.type == FolderItemType.Folder ? FolderItemComponent.folderIconPath : FolderItemComponent.fileIconPath;
  }
}
