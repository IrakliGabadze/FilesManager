import { Component, Inject, OnInit } from '@angular/core';
import { FilesService } from '../../services/files/files.service';
import { FolderItem } from '../../models/folder-item-model';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {

  fileFullPath!: string;

  constructor(@Inject(MAT_DIALOG_DATA) private data: { folderItem: FolderItem }, private _filesService: FilesService) { }

  ngOnInit(): void {

    var methodNameWithQueryParams = `${FilesService.previewVideoOrAudioFileApiMethodName}?partialPath=${this.data.folderItem.path}`

    this.fileFullPath = this._filesService.getFullUrl(methodNameWithQueryParams);
  }
}
