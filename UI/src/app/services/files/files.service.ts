import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClientService } from '../http-client/http-client.service';
import { FolderItem } from '../../models/folderItemModel';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  static getFolderItemsApiMethodName = "GetFolderItems";

  filesApiControllerAddress!:string;

  constructor(private http: HttpClientService) {
    this.filesApiControllerAddress = `${environment.filesApiBaseAddress}files`
  }

   getFolderItems(folderPartialPath?: string) : Promise<FolderItem[]> {

    let url = this.getFullUrl(`${FilesService.getFolderItemsApiMethodName}${folderPartialPath == undefined ? `` : `?folderPartialPath=${folderPartialPath}`}`);

    return this.http.get(url);
  }

  getFullUrl(methodNameWithQueryParams: string): string {
    return `${this.filesApiControllerAddress}/${methodNameWithQueryParams}`;
  }
}
