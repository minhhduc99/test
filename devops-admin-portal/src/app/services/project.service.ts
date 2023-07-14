import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  getAll(limit, offset, organization) {
    var url = `${environment.base_url}/api/project/`;
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

  create(item){
    return this.http.post<any>(`${environment.base_url}/api/project/create`, item);
  }

  update(item){
    return this.http.post<any>(`${environment.base_url}/api/project/update`, item);
  }

  /* ------------- project user --------------- */
  getUsersByProject(projectId){
    if(projectId != undefined) {
      return this.http.get<any>(`${environment.base_url}/api/projectUser/listByProject` + '?projectId=' + projectId);
    }
    return null;
  }

  setUsersInProject(list){
    return this.http.post<any>(`${environment.base_url}/api/projectUser/createOrUpdateList`, list);
  }

}
