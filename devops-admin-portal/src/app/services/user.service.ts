import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { User } from '../_models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll(limit, offset, organization) {
        var url = `${environment.base_url}/api/user/`;
        if(limit && offset != undefined) {
          url += `?limit=${limit}&offset=${offset}&`;
        } else {
          url += `?`;
        }
        if(organization) {
          url += `organization=${organization}`;
        }
        console.log(url);
        return this.http.get<any>(url);
    }

    getById(id: number) {
        return this.http.get<User>(`${environment.base_url}/api/user/${id}`);
    }

    create(user){
      return this.http.post<any>(`${environment.base_url}/api/user/create`, user);
    }

    update(user){
      return this.http.post<any>(`${environment.base_url}/api/user/update`, user);
    }

    updateSelf(user){
      return this.http.post<any>(`${environment.base_url}/api/user/update-self`, user);
    }

    registerWithCIPAccount(user) {
      return this.http.post<any>(`${environment.base_url}/api/user/registerWithCIPAccount`, user);
    }

    registerWithSSOAccount(user) {
      return this.http.post<any>(`${environment.base_url}/api/user/registerWithSSOAccount`, user);
    }

}
