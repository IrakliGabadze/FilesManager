import { FolderItemType } from "../enums/folderItemType";

export class FolderItem {

 constructor(name: string, path: string, type: FolderItemType, fileMediaType?: string, fileExt?: string, fileThumbnail?: string) {
    this.name = name;
    this.path = path;
    this.type = type;
    this.fileMediaType = fileMediaType;
    this.fileExt = fileExt;
    this.fileThumbnail = fileThumbnail;
  }

  public name: string;
  public path: string;
  public type: FolderItemType;
  public fileMediaType?: string;
  public fileExt?: string;
  public fileThumbnail?: string;
}
