import { Component, OnInit } from '@angular/core';
import { FolderItem } from '../../models/folderItemModel';
import { FilesService } from '../../services/files/files.service';
import { FolderItemType } from '../../enums/folderItemType';

@Component({
  selector: 'files-page',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})

export class FilesComponent implements OnInit {

  constructor(private filesService: FilesService) { }

  folderItems?: FolderItem[];
  currentFolderItemPath?: string;

  ngOnInit() {
    this.getFolderItems(undefined);
  }

  getFolderItems(folderPartialPath?: string) {

    var pathWithouArgs = "https://localhost:7142/files";

    let url = folderPartialPath == undefined ? pathWithouArgs : `${pathWithouArgs}?folderPartialPath=${folderPartialPath}`;

    this.filesService.getFolderItems(url).subscribe({
      next: res => this.folderItems = res,
      error: (err: any) => console.log(err) //TODO handle error
      //complete: () => console.log(`API call for url: ${url} completed`)
    });
  }

  folderItemClicked(type: FolderItemType, folderItemPath?: string) {

    if (type == FolderItemType.Folder) {
      this.currentFolderItemPath = folderItemPath;
      this.getFolderItems(folderItemPath);
    }
  }

  pathItemClickedInNavigator(path?: string) {
    this.folderItemClicked(FolderItemType.Folder, path);
  }
}
