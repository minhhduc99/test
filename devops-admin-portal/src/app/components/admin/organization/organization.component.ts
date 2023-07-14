import { Component, OnInit } from '@angular/core';
import { OrganizationService, AuthenticationService } from '../../../services';
import { User, Role } from '../../../_models';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  user: User;

  organizations = [];
  tableHeaders = [];

  count = 0;
  pageSize = 0; // 0 means no-paging
  numberOfPages = 1;
  currentPage = 0;

  selectedOrganization = undefined;
  org = {
    id: '',
    name: '',
    description: '',
    owner: '',
    owner_id: '',
    status: 'active',
    updated: '',
    created: ''
  };

  excludedHeaders = ['owner_id'];

  error = '';

  constructor(private organizationService: OrganizationService, private authenticationService: AuthenticationService, private toastr: ToastrService) {
    this.authenticationService.currentUser.subscribe(x => {
        console.log(x);
        this.user = x;
    });
  }

  isSAdmin() {
    if(this.user) {
      return this.user.role == Role.SAdmin;
    } else {
      return false;
    }
  }

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.organizationService.getAll(this.pageSize, this.currentPage * this.pageSize).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        this.count = x.count;
        if(this.pageSize > 0)
          this.numberOfPages = Math.floor(this.count / this.pageSize);
        if(this.count % this.pageSize) {
          this.numberOfPages ++;
        }
        this.organizations = x.data;
        if(x.data.length > 0) {
          this.tableHeaders = Object.keys(x.data[0]);
          for(var i=this.tableHeaders.length - 1; i>=0; i--) {
            for(var h=0; h<this.excludedHeaders.length; h++) {
              if(this.excludedHeaders[h] == this.tableHeaders[i]) {
                  this.tableHeaders.splice(i, 1);
              }
            }
          }
        } else {
          this.tableHeaders = [];
        }
        console.log(this.tableHeaders);
      }
    });
  }

  select(o) {

    this.selectedOrganization = o;
    this.org.id = o.id;
    this.org.name = o.name;
    this.org.description = o.description;
    this.org.owner = o.owner;
    this.org.owner_id = o.owner_id;
    this.org.status = o.status;
    this.org.updated = o.updated;
    this.org.created = o.created;
  }

  onReset() {
    this.selectedOrganization = undefined;
    this.org = {
      id: '',
      name: '',
      description: '',
      owner: '',
      owner_id: '',
      status: 'active',
      updated: '',
      created: ''
    };
    this.error = '';
  }

  onSubmit() {
    console.log(this.org);
    if(this.validateData()) {
      if(this.selectedOrganization) {
        // update existing organization
        this.organizationService.update(this.org).subscribe(x => {
          console.log(x);
          this.loadData();
        });
      } else {
        // create new
        this.organizationService.create(this.org).subscribe(x => {
          console.log(x);
          if(x && x.result == 'error') {
            this.error = x.message;
            this.toastr.error(x.message, 'Error');
          } else {
            this.loadData();
            this.onReset();
          }
        });
      }
    }
  }

  validateData() {
    if(this.org.name) {
      this.error = '';
      return true;
    }
    this.error = 'Organization name is required';
    this.toastr.error('Organization name is required', 'Error');
    return false;
  }

  nextPage() {
    this.currentPage++;
    this.loadData();
  }

  prevPage() {
    this.currentPage--;
    this.loadData();
  }

  selectPage(index) {
    this.currentPage = index;
    this.loadData();
  }
}
