import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom} from 'rxjs';

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
}
