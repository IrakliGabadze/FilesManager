import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarType } from '../../enums/snack-bar-type';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  constructor(private _snackBar: MatSnackBar) { }

  openSnackBar(type: SnackBarType, message: string, action?: string, duration: number = 3000) {
    this._snackBar.open(message, action, {
      duration: duration,
      panelClass: `snackbar-${type}-bg`
    });
  }
}
