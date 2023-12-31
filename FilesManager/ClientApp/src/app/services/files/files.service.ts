import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../http-client/http-client.service';
import { FolderItem } from '../../models/folder-item-model';
import { FolderItemActionType } from '../../enums/folder-item-action-type';
import { FolderItemType } from '../../enums/folder-item-type';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  static getFolderItemsApiMethodName = "GetFolderItems";
  static deleteFolderItemApiMethodName = "DeleteFolderItem";
  static copyFolderItemApiMethodName = "CopyFolderItem";
  static cutFolderItemApiMethodName = "CutFolderItem";
  static renameFolderItemApiMethodName = "RenameFolderItem";
  static createFolderApiMethodName = "CreateFolder";
  static downloadFolderApiMethodName = "DownloadFolder";
  static downloadFileApiMethodName = "DownloadFile";
  static previewVideoOrAudioFileApiMethodName = "PreviewVideoOrAudioFile";

  filesApiControllerAddress!: string;

  constructor(private http: HttpClientService) {
    this.filesApiControllerAddress = `${environment.filesApiBaseAddress}files`
  }

  getFolderItems(folderPartialPath?: string | null): Promise<FolderItem[]> {

    let url = this.getFullUrl(`${FilesService.getFolderItemsApiMethodName}${folderPartialPath == null ? `` : `?folderPartialPath=${folderPartialPath}`}`);

    return this.http.get(url);
  }

  async deleteFolderItem(folderItemPartialPath: string) {

    let url = this.getFullUrl(FilesService.deleteFolderItemApiMethodName);

    await this.http.post(url, JSON.stringify({ partialPath: folderItemPartialPath }), false);
  }

  async renameFolderItem(folderItemPartialPath: string, newName: string) {

    let url = this.getFullUrl(FilesService.renameFolderItemApiMethodName);

    let requesData = {
      path: folderItemPartialPath,
      name: newName
    };

    await this.http.post(url, JSON.stringify(requesData), false);
  }

   async createFolder(parentFolderPartialPath: string, name: string) {

    let url = this.getFullUrl(FilesService.createFolderApiMethodName);

    let requesData = {
      parentFolderPartialPath: parentFolderPartialPath,
      name: name
    };

    await this.http.post(url, JSON.stringify(requesData), false);
  }

  async cutOrCopyFolderItem(actionType: FolderItemActionType, cutOrCopiedfolderItemPartialPath: string, targetFolderItemPatialPath?: string) {

    let url = this.getFullUrl(`${actionType == FolderItemActionType.Cut ?
      FilesService.cutFolderItemApiMethodName : FilesService.copyFolderItemApiMethodName}`);

    let requesData = {
      oldPath: cutOrCopiedfolderItemPartialPath,
      targetFolderPath: targetFolderItemPatialPath,
      overwrite: false
    };

    await this.http.post(url, JSON.stringify(requesData), false);
  }

  async downloadFolderItem(folderItem: FolderItem) {

    var apiMethodName = folderItem.type == FolderItemType.Folder ? FilesService.downloadFolderApiMethodName : FilesService.downloadFileApiMethodName

    let url = this.getFullUrl(`${apiMethodName}?folderItemPartialPath=${folderItem.path}`);

    this.clickLinkToStartDownloading(url);
  }

  async uploadFiles(files: File[], mainFolderPartialPath?: string) {
    const formData = new FormData();
   
     files.forEach(file => {
      formData.append('files', file, file.name);
    });

    let url = this.getFullUrl(mainFolderPartialPath == null || mainFolderPartialPath == undefined ?
      "UploadFiles" : `UploadFiles?mainFolderPartialPath=${mainFolderPartialPath}`);

    await this.http.postFiles(url, formData);
  }

  private clickLinkToStartDownloading(url: string) {
    const a = document.createElement('a');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  getFullUrl(methodNameWithQueryParams: string): string {
    return `${this.filesApiControllerAddress}/${methodNameWithQueryParams}`;
  }
}
