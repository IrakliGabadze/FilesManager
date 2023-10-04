import { FolderItemType } from "../enums/folderItemType";

export class FolderItemModel {

 constructor(name: string, path: string, type: FolderItemType, fileMediaType?: string, fileExt?: string) {
    this.name = name;
    this.path = path;
    this.type = type;
    this.fileMediaType = fileMediaType;
    this.fileExt = fileExt;
  }

  public name: string;
  public path: string;
  public type: FolderItemType;
  public fileMediaType?: string;
  public fileExt?: string;
}
