import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {

  constructor(private http: HttpClient) { }

  getAll(limit, offset) {
    if(limit && offset != undefined) {
      return this.http.get<any>(`${environment.base_url}/api/organization/` + '?limit=' + limit +'&offset=' + offset);
    } else {
      return this.http.get<any>(`${environment.base_url}/api/organization/`);
    }
  }

  create(item){
    return this.http.post<any>(`${environment.base_url}/api/organization/create`, item);
  }

  update(item){
    return this.http.post<any>(`${environment.base_url}/api/organization/update`, item);
  }


}
