import { Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'dialogs-base',
  templateUrl: './dialogs-base.component.html',
  styleUrls: ['./dialogs-base.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DialogsBaseComponent implements OnInit, OnDestroy {

  @Input() headerText?: string;

  private dialogRefSubscription!: Subscription;
  constructor(private _dialogRef: MatDialogRef<DialogsBaseComponent>, @Inject(MAT_DIALOG_DATA) public data: { headerText: string }) { }

  ngOnInit(): void {
    this._dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') {
        this.close();
      }
    });
  }

  close() {
    this._dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.dialogRefSubscription) {
      this.dialogRefSubscription?.unsubscribe();
    }
  }
}
