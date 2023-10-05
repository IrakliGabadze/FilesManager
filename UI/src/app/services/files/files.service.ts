import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FolderItem } from '../../models/folderItemModel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) {
  }

  getFolderItems (url: string) : Observable<FolderItem[]>{
    return this.http.get<FolderItem[]>(url);
  }
}
