import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  getAppInfo() {
    return this.http.get<any>(`${environment.base_url}/api/app/`);
  }

  parseEML(data) {
    return this.http.post<any>(`${environment.base_url}/api/app/parseEML/`,{eml:data});
  }
}
