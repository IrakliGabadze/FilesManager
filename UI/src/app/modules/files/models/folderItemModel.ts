
export class FolderItemModel {

 constructor(name: string, path: string, isFolder: boolean, fileExt?: string) {
    this.name = name;
    this.path = path;
    this.isFolder = isFolder;
    this.fileExt = fileExt;
  }

  public path: string;
  public name: string;
  public isFolder: boolean;
  public fileExt?: string;
}
