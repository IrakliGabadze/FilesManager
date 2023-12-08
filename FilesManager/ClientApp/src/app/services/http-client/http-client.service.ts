import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { SnackBarService } from '../snack-bar/snack-bar.service';
import { SnackBarType } from '../../enums/snack-bar-type';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient, private _snackBarService: SnackBarService) { }

  static successfullOperationMessage: string = "Operation completed successfully";
  static errorOperationMessage: string = "Error occured";

  get<T>(url: string): Promise<T> {

    try {
      return lastValueFrom(this.http.get<T>(url, { withCredentials: true }));
    }
    catch (e) {

      console.log(e) //TODO handle error

      throw e;
    }
  }

  async post<T>(url: string, data: T, throwException: boolean = true) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    try {
      await lastValueFrom(this.http.post<T>(url, data, { headers, withCredentials: true }));

      this._snackBarService.openSnackBar(SnackBarType.Success, HttpClientService.successfullOperationMessage);
    }
    catch (e) {

      console.log(e) //TODO handle error

      this._snackBarService.openSnackBar(SnackBarType.Error, HttpClientService.errorOperationMessage);

      if (throwException)
        throw e;
    }
  }

  async postFiles<T>(url: string, data: T, throwException: boolean = true) {

    try {
      await lastValueFrom(this.http.post(url, data, { withCredentials: true } ));

      this._snackBarService.openSnackBar(SnackBarType.Success, HttpClientService.successfullOperationMessage);
    }
    catch (e) {

      console.log(e) //TODO handle error

      this._snackBarService.openSnackBar(SnackBarType.Error, HttpClientService.errorOperationMessage);

      if (throwException)
        throw e;
    }
  }
}
