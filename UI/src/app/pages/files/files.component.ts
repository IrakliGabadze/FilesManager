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

  async ngOnInit() {
    await this.getFolderItems(undefined);
  }

  async getFolderItems(folderPartialPath?: string) {
    this.folderItems = await this.filesService.getFolderItems(folderPartialPath);
  }

  async folderItemClicked(type: FolderItemType, folderItemPath?: string) {

    if (type == FolderItemType.Folder) {
      this.currentFolderItemPath = folderItemPath;
      await this.getFolderItems(folderItemPath);
    }
  }

  async pathItemClickedInNavigator(path?: string) {
    await this.folderItemClicked(FolderItemType.Folder, path);
  }
}
