import { Component, OnInit } from '@angular/core';
import { FolderItemModel } from '../../models/folderItemModel';

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
      new FolderItemModel("First folder", "FirstFolderPath", true, undefined),
      new FolderItemModel("Second folder", "SecondFolderPath", true, undefined),
      new FolderItemModel("1.png", "1", false, ".png"),
      new FolderItemModel("2.jpeg", "2", false, ".jpeg"),
      new FolderItemModel("3.zip", "3", false, ".zip"),
      new FolderItemModel("4.rar", "4", false, ".rar"),
    ];
  }
}
