import { Component, Inject } from '@angular/core';
import { FilesService } from '../../services/files/files.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent {
  selectedFiles: File[] = [];
  constructor(
    private _dialogRef: MatDialogRef<UploadFilesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mainFolderPartialPath: string },
    public _filesService: FilesService) {
  }

  onFileChange(event: any) {

    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
      this.selectedFiles.push(event.target.files[i]);
    }
  }

  onFileRemove(fileIndex: number) {
    this.selectedFiles.splice(fileIndex, 1);
  }

  async uploadFiles() {

    if (!this.canBeUploaded())
      return;

     await this._filesService.uploadFiles(this.data.mainFolderPartialPath, this.selectedFiles);

     this._dialogRef.close();
  }

  canBeUploaded(): boolean {
    return this.selectedFiles.length > 0;
  }
}
