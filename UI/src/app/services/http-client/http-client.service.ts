import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private http: HttpClient) { }

  get<T>(url: string): Promise<T> {

    try {
      return lastValueFrom(this.http.get<T>(url));
    }
    catch (e) {
      console.log(e) //TODO handle error
      throw e;
    }
  }

  post<T>(url: string, data: T) {

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    try {
      return lastValueFrom(this.http.post<T>(url, data, { headers }));
    }
    catch (e) {
      console.log(e) //TODO handle error
      throw e;
    }
  }
}
