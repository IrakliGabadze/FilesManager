import { Component, Inject, OnInit } from '@angular/core';
import { FilesService } from '../../services/files/files.service';
import { FolderItem } from '../../models/folder-item-model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {

  fileFullPath!:string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: {folderItem: FolderItem}, private _dialogRef: MatDialogRef<VideoPlayerComponent>, private _filesService: FilesService) { }

  ngOnInit(): void {

    var methodNameWithQueryParams = `${FilesService.previewVideoOrAudioFileApiMethodName}?partialPath=${this.data.folderItem.path}`

    this.fileFullPath = this._filesService.getFullUrl(methodNameWithQueryParams);
  }
}
