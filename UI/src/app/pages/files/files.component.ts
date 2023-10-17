import { Component, OnInit, ViewChild } from '@angular/core';
import { FolderItem } from '../../models/folderItemModel';
import { FilesService } from '../../services/files/files.service';
import { FolderItemType } from '../../enums/folderItemType';
import { FolderItemActionType } from '../../enums/folderItemActionType';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { DialogService } from '../../services/dialog/dialog.service';
import { lastValueFrom } from 'rxjs';
import { DialogComponent } from '../../components/dialog/dialog.component';

@Component({
  selector: 'files-page',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})

export class FilesComponent implements OnInit {

  constructor(private filesService: FilesService, private dialogService: DialogService) { }

  FilesComponent = FilesComponent;

  static actionNamesWithIcons: [string, string][] = [
    [FolderItemActionType.Download, "download"],
    [FolderItemActionType.Rename, "edit_note"],
    [FolderItemActionType.Copy, "file_copy"],
    [FolderItemActionType.Cut, "content_cut"],
    [FolderItemActionType.Delete, "delete"]
  ];

  folderItems?: FolderItem[];
  currentFolderItemPath?: string;

  @ViewChild(ContextMenuComponent) folderItemContextMenuRef?: ContextMenuComponent<FolderItem>;

  async ngOnInit() {
    await this.getFolderItems();
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

  getActionType(actionTypeName: string): FolderItemActionType {
    return FolderItemActionType[actionTypeName as keyof typeof FolderItemActionType];
  }

  onFolderItemContextMenu(event: MouseEvent, folderItem: FolderItem) {
    this.folderItemContextMenuRef?.onContextMenu(event, folderItem);
  }

  async onFolderItemContextMenuItemClicked(actionInfo: [string, FolderItem]) {
    switch (actionInfo[0]) {
      case FolderItemActionType.Delete: await this.deleteFolderItemAfterConfirmation(actionInfo)
    }

  }

  async deleteFolderItemAfterConfirmation(actionInfo: [string, FolderItem]) {

    let dialogRef = this.dialogService.openWithResult<DialogComponent, boolean>(DialogComponent, {
      data: {
        folderItemName: actionInfo[1].name
      }
    });

    var result = await lastValueFrom(dialogRef.afterClosed());

    if (result)
      await this.filesService.deleteFolderItem(actionInfo[1].path);

    await this.getFolderItems(this.currentFolderItemPath);
  }
}
