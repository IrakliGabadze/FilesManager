import { Component, OnInit } from '@angular/core';
import { FolderItemModel } from '../../models/folderItemModel';
import { FolderItemType } from '../../enums/folderItemType';

@Component({
  selector: 'files-page',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})

export class FilesComponent implements OnInit {

  _folderItems?: FolderItemModel[];

  ngOnInit() {
    //TODO Call files API here
    this._folderItems = [
      new FolderItemModel("First folder", "FirstFolderPath", FolderItemType.Folder, undefined , undefined),
      new FolderItemModel("Second folder", "SecondFolderPath", FolderItemType.Folder, undefined , undefined),
      new FolderItemModel("1.png", "1", FolderItemType.Image, undefined, ".png"),
      new FolderItemModel("2.jpeg", "2", FolderItemType.Image, undefined, ".jpeg"),
      new FolderItemModel("3.zip", "3", FolderItemType.OtherFile, undefined, ".zip"),
      new FolderItemModel("4.rar", "4", FolderItemType.OtherFile, undefined, ".rar"),
    ];
  }
}
