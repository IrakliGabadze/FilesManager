import { Component, OnInit, ViewChild } from '@angular/core';
import { FolderItem } from '../../models/folder-item-model';
import { FilesService } from '../../services/files/files.service';
import { FolderItemType } from '../../enums/folder-item-type';
import { FolderItemActionType } from '../../enums/folder-item-action-type';
import { ContextMenuComponent } from '../../components/context-menu/context-menu.component';
import { DialogService } from '../../services/dialog/dialog.service';
import { lastValueFrom } from 'rxjs';
import { ConfirmationDialogComponent } from '../../components/confirmation-dialog/confirmation-dialog.component';
import { RenameFolderItemFormComponent } from '../../components/rename-folder-item-form/rename-folder-item-form.component';
import { SnackBarService } from '../../services/snack-bar/snack-bar.service';
import { SnackBarType } from '../../enums/snack-bar-type';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { AudioPlayerComponent } from '../../components/audio-player/audio-player.component';
import { CarouselComponent } from '../../components/carousel/carousel.component';
import { UploadFilesComponent } from '../../components/upload-files/upload-files.component';
import { CreateFolderFormComponent } from '../../components/create-folder-form/create-folder-form.component';

@Component({
  selector: 'files-page',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.css']
})

export class FilesComponent implements OnInit {

  constructor(
    private _filesService: FilesService,
    private _dialogService: DialogService,
    private _snackBarService: SnackBarService) { }

  FilesComponent = FilesComponent;
  FolderItemActionType = FolderItemActionType;

  static actionNamesWithIcons: [string, string][] = [
    [FolderItemActionType.Download, "download"],
    [FolderItemActionType.Rename, "edit_note"],
    [FolderItemActionType.Copy, "file_copy"],
    [FolderItemActionType.Cut, "content_cut"],
    [FolderItemActionType.Delete, "delete"]
  ];

  folderItems?: FolderItem[];
  currentFolderItemPath?: string;
  cutOrCopiedItemPathWithActionType?: [string, FolderItemActionType];
  cutOrCopiedItemParentPath?: string;

  @ViewChild(ContextMenuComponent) folderItemContextMenuRef?: ContextMenuComponent<FolderItem>;

  async ngOnInit() {
    await this.getFolderItems();
  }

  async getFolderItems(folderPartialPath?: string) {
    this.folderItems = await this._filesService.getFolderItems(folderPartialPath);
  }

  async folderItemClicked(folderItem: FolderItem) {

    switch (folderItem.type) {
      case FolderItemType.Folder:
        this.currentFolderItemPath = folderItem.path;
        await this.getFolderItems(folderItem.path);
        break
      case FolderItemType.HtmlAudio:
        this.previewAudio(folderItem)
        break
      case FolderItemType.HtmlVideo:
        this.previewVideo(folderItem)
        break
      case FolderItemType.HtmlImage:
        this.previewImage(folderItem)
        break
      case FolderItemType.OtherFile:
        this._filesService.downloadFolderItem(folderItem)
        break
    }
  }

  async pathItemClickedInNavigator(path?: string) {

    this.currentFolderItemPath = path;

    await this.getFolderItems(path);
  }

  getActionType(actionTypeName: string): FolderItemActionType {
    return FolderItemActionType[actionTypeName as keyof typeof FolderItemActionType];
  }

  onContextMenu(event: MouseEvent, folderItem: FolderItem) {
    this.folderItemContextMenuRef?.onContextMenu(event, folderItem);
  }

  async onContextMenuItemClicked(actionInfo: [string, FolderItem]) {
    switch (actionInfo[0]) {
      case FolderItemActionType.Delete: await this.deleteFolderItemAfterConfirmation(actionInfo)
        break
      case FolderItemActionType.Rename: await this.renameFolderItem(actionInfo)
        break
      case FolderItemActionType.Cut:
      case FolderItemActionType.Copy:
        this.cutOrCopiedItemParentPath = this.currentFolderItemPath;
        this.cutOrCopiedItemPathWithActionType = [actionInfo[1].path, actionInfo[0]];
        this._snackBarService.openSnackBar(SnackBarType.Info, "Choose folder to paste");
        break
      case FolderItemActionType.Download:
        await this._filesService.downloadFolderItem(actionInfo[1]);
        break
    }
  }

  async deleteFolderItemAfterConfirmation(actionInfo: [string, FolderItem]) {

    let dialogRef = this._dialogService.openWithResult<ConfirmationDialogComponent, boolean>(ConfirmationDialogComponent, {
      data: {
        folderItemName: actionInfo[1].name
      }
    });

    var result = await lastValueFrom(dialogRef.afterClosed());

    if (!result)
      return;

    await this._filesService.deleteFolderItem(actionInfo[1].path);

    await this.getFolderItems(this.currentFolderItemPath);
  }

  async renameFolderItem(actionInfo: [string, FolderItem]) {

    let dialogRef = this._dialogService.openWithResult<RenameFolderItemFormComponent, string>(RenameFolderItemFormComponent, {
      data: {
        folderItemName: actionInfo[1].name
      }
    });

    var result = await lastValueFrom(dialogRef.afterClosed()) as string;

    if (!result)
      return;

    await this._filesService.renameFolderItem(actionInfo[1].path, result);

    await this.getFolderItems(this.currentFolderItemPath);
  }

  async cutOrCopyFolderItem() {

    if (this.cutOrCopiedItemPathWithActionType == undefined)
      return;

    await this._filesService.cutOrCopyFolderItem(this.cutOrCopiedItemPathWithActionType[1], this.cutOrCopiedItemPathWithActionType[0], this.currentFolderItemPath);

    this.cancelCutOrCopyFolderItem(false);

    await this.getFolderItems(this.currentFolderItemPath);

    this.cancelCutOrCopyFolderItem(false);
  }

  cancelCutOrCopyFolderItem(showSnackBar: boolean) {
    this.cutOrCopiedItemPathWithActionType = undefined;
    this.cutOrCopiedItemParentPath = undefined;

    if (showSnackBar)
      this._snackBarService.openSnackBar(SnackBarType.Info, "Operation canceled");
  }

  previewVideo(folderItem: FolderItem) {

    this._dialogService.open<VideoPlayerComponent>(VideoPlayerComponent, {
      data: {
        folderItem: folderItem,
        headerText: folderItem.name
      }
    });
  }

  previewAudio(folderItem: FolderItem) {

    this._dialogService.open<AudioPlayerComponent>(AudioPlayerComponent, {
      data: {
        folderItem: folderItem,
        headerText: folderItem.name
      }
    });
  }

  previewImage(folderItem: FolderItem) {

    let imageItems = this.folderItems?.filter(fi => fi.type == FolderItemType.HtmlImage);

    this._dialogService.open<CarouselComponent>(CarouselComponent, {
      data: {
        imageItems: imageItems,
        selectedImagePath: folderItem.path
      }
    });
  }

  async showFilesUploadForm() {

    this.cancelCutOrCopyFolderItem(false);

    const dialogRef = this._dialogService.open<UploadFilesComponent>(UploadFilesComponent, {
      data: {
        mainFolderPartialPath: this.currentFolderItemPath,
      }
    });

    dialogRef.afterClosed().subscribe(async _ => {
      await this.getFolderItems(this.currentFolderItemPath);
    });
  }

  async showCreateFolderForm() {

    this.cancelCutOrCopyFolderItem(false);

    const dialogRef = this._dialogService.open<CreateFolderFormComponent>(CreateFolderFormComponent);

    var result = await lastValueFrom(dialogRef.afterClosed()) as string;

    if (!result)
      return;
      
    await this._filesService.createFolder(this.currentFolderItemPath!, result);

    await this.getFolderItems(this.currentFolderItemPath);
  }
}
