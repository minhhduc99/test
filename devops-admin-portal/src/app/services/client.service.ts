import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(private http: HttpClient) { }

  getAll(limit, offset) {
    var url = `${environment.base_url}/api/client/`;
    if(limit && offset != undefined) {
      url += `?limit=${limit}&offset=${offset}&`;
    } else {
      url += `?`;
    }
    console.log(url);
    return this.http.get<any>(url);

  }

  create(item){
    return this.http.post<any>(`${environment.base_url}/api/client/create`, item);
  }

  update(item){
    return this.http.post<any>(`${environment.base_url}/api/client/update`, item);
  }

}
