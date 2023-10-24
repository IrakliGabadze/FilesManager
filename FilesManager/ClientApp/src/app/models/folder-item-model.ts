import { FolderItemType } from "../enums/folder-item-type";

export class FolderItem {

 constructor(name: string, path: string, type: FolderItemType, fileExt?: string, fileThumbnail?: string) {
    this.name = name;
    this.path = path;
    this.type = type;
    this.fileExt = fileExt;
    this.fileThumbnail = fileThumbnail;
  }

  public name: string;
  public path: string;
  public type: FolderItemType;
  public fileExt?: string;
  public fileThumbnail?: string;
}
