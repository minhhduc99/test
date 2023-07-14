import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private http: HttpClient) { }

  getAll(limit, offset, organization) {
    var url = `${environment.base_url}/api/team/`;
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
    return this.http.post<any>(`${environment.base_url}/api/team/create`, item);
  }

  update(item){
    return this.http.post<any>(`${environment.base_url}/api/team/update`, item);
  }

  /* ------------- team user --------------- */
  getUserByTeam(limit, offset, teamId){

    if(teamId != undefined) {
      if(limit && offset != undefined) {
        return this.http.get<any>(`${environment.base_url}/api/teamUser/listByTeam` + '?limit=' + limit +'&offset=' + offset + '&teamId=' + teamId);
      } else {
        return this.http.get<any>(`${environment.base_url}/api/teamUser/listByTeam` + '?teamId=' + teamId);
      }
    }
    return null;
  }

  setUsersInTeam(list){
    return this.http.post<any>(`${environment.base_url}/api/teamUser/createOrUpdateList`, list);
  }

}
