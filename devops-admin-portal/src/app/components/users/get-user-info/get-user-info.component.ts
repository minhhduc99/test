import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-get-user-info',
  templateUrl: './get-user-info.component.html',
  styleUrls: ['./get-user-info.component.css']
})
export class GetUserInfoComponent implements OnInit {

  name: any;
  error: any;
  usersList;

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  parseUser(user) {
    let u = {
      name: user.sn,
      gen: user.employeeNumber,
      singleId: user.mySingleId,
      title: user.title,
      department: user.departmentNumber,
    }
    return u;
  }

  exportCSV(users) {
    if (users.length > 0) {
      const replacer = (key, value) => value === null ? '' : value;
      const header = ['name', 'gen', 'singleId', 'title', 'department'];
      let csv = users.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',').replace(/['"]+/g, ''));
      //csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');
      /*
      var blob = new Blob([csvArray], {type: 'text/csv'});
      saveAs(blob, "firewall.csv");
      */
      var a = document.createElement('a');
      var blob = new Blob([csvArray], { type: 'text/csv' });
      let url = window.URL.createObjectURL(blob);

      a.href = url;
      a.download = "list.csv";
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }

  }

  load(event: any) {
    var file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async () => {
      this.error = '';

      let content = reader.result.toString().replace("\r", '');
      let userIds =  content.split("\n");
      console.log(userIds);
      let results = [];
      for(let i=0; i<userIds.length; i++) {
        if(userIds[i]) {
          let res = await this.http.get<any>("http://107.113.53.44:9906/mmssearch/api/_search/employeesV2?query=" + userIds[i]).toPromise();
          if(res.code == 1 && res.value.length > 0) {
            results.push(this.parseUser(res.value[0]));
          }

        }
      }
      console.log(results);
      this.exportCSV(results);

    }
  }

  async submit() {
    console.log(this.usersList);
    this.error = '';
    let content = this.usersList.replace("\r", '').replace(",", '').replace(" ", '');
    let userIds =  content.split("\n");
    console.log(userIds);
    let results = [];
    for(let i=0; i<userIds.length; i++) {
      if(userIds[i]) {
        let res = await this.http.get<any>("http://107.113.53.44:9906/mmssearch/api/_search/employeesV2?query=" + userIds[i]).toPromise();
        if(res.code == 1 && res.value.length > 0) {
          results.push(this.parseUser(res.value[0]));
        }

      }
    }
    console.log(results);
    this.exportCSV(results);
  }

}
