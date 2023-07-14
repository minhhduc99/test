import { Component, OnInit } from '@angular/core';
import { ProjectService, OrganizationService, UserService, AuthenticationService, AppMessageService } from '../../../services';
import { User, Role } from '../../../_models';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  subscriptions: Subscription[] = [];

  user: User;
  organizationId;

  projects = [];
  tableHeaders = [];

  count = 0;
  pageSize = 10; // 0 means no-paging
  numberOfPages = 1;
  currentPage = 0;

  selectedProject = undefined;
  project = {
    id: '',
    name: '',
    description: '',
    aws_access_key: '',
    aws_secret_key: '',
    jumphost_id: '',
    environments: 'DEV, STG, PRD',
    owner: '',
    owner_id: 1,
    status: 'active',
    updated: '',
    created: ''
  };

  organizations = [{
    name: 'Service Operation',
    id: 1
  }];

  excludedHeaders = ['owner_id'];

  error = '';
  success = '';

  userHeaders = ['name', 'account', 'owner', 'status'];
  allUsersInSystem = [];
  usersInSystem = [];
  usersInCurrentProject = [];
  usersChanged = false;

  serverHeaders = ['name', 'owner', 'status', 'environment'];
  allServersInSystem = [];
  serversInSystem = [];
  serversInCurrentProject = [];
  serversInCurrentEnv = [];
  serversChanged = false;
  environments = ['All'];
  env = '';

  userFilters = {};
  serverFilters = {};

  constructor(
    private toastr: ToastrService,
    private projectService: ProjectService,
    private organizationService: OrganizationService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private appMessageService: AppMessageService
  ) {

    this.authenticationService.currentUser.subscribe(x => {
        console.log(x);
        this.user = x;
        if(x) {
          if(this.user.role == Role.SAdmin) {
            this.organizationId = undefined;
          } else {
            this.organizationId = x.owner_id;
          }
          this.project.owner_id = this.organizationId;
          this.loadByOrganization();
          this.loadData();
        }
    });

    this.subscriptions.push(
      this.appMessageService.getInAppMessage().subscribe(x => {
        if(x && x.type == AppMessageService.TYPE_SADMIN_ORGANIZATION_CHANGED) {
          this.organizationId = x.data == -1?undefined:x.data;
          this.loadByOrganization();
          this.loadData();
          this.onReset();
        }
      })
    );

  }

  isAdmins() {
    return this.user.role != Role.User;
  }

  ngOnInit() {

  }

  ngOnDestroy() {
    console.log(this.subscriptions);
    this.subscriptions.forEach(s => {
      s.unsubscribe();
    });
  }

  loadByOrganization() {
    this.organizationService.getAll(null, null).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        if(this.organizationId) {
            this.organizations = [];
            for(let i=0; i<x.data.length; i++) {
              if(x.data[i].id == this.organizationId) {
                this.organizations.push(x.data[i]);
                break;
              }
            }
        } else {
          this.organizations = x.data;
        }
      }
    });
    this.userService.getAll(null, null, this.organizationId).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        this.allUsersInSystem = x.data;
        this.applyUserFilters();
      }
    });
  }

  loadData() {
    this.projectService.getAll(this.pageSize, this.currentPage * this.pageSize, this.organizationId).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        this.count = x.count;
        if(this.pageSize > 0)
          this.numberOfPages = Math.floor(this.count / this.pageSize);
        if(this.count % this.pageSize) {
          this.numberOfPages ++;
        }
        this.projects = x.data;
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

        if(this.project) {
          for(let i=0; i<this.projects.length; i++) {
            if(this.project.name == this.projects[i].name) {
              this.select(this.projects[i]);
            }
          }
        }
      }
    });



  }

  select(o) {

    this.selectedProject = o;
    this.project.id = o.id;
    this.project.name = o.name;
    this.project.description = o.description;
    this.project.aws_access_key = o.aws_access_key;
    this.project.aws_secret_key = o.aws_secret_key;
    this.project.jumphost_id = o.jumphost_id;
    this.project.environments = o.environments;
    this.project.owner = o.owner;
    this.project.owner_id = o.owner_id;
    this.project.status = o.status;
    this.project.updated = o.updated;
    this.project.created = o.created;

    this.usersInCurrentProject = [];
    this.projectService.getUsersByProject(o.id).subscribe(x => {
      console.log(x);
      if(x) {
        this.usersInCurrentProject = x;
      }
    });
    this.usersChanged = false;
    if(o.environments && o.environments.split(',').length) {
      this.environments = ['All'].concat(o.environments.split(','));
      this.env = this.environments[0];
    }
  }

  onReset() {
    this.selectedProject = undefined;
    this.project = {
      id: '',
      name: '',
      description: '',
      aws_access_key: '',
      aws_secret_key: '',
      jumphost_id: '',
      environments: 'DEV, STG, PRD',
      owner: '',
      owner_id: 1,
      status: 'active',
      updated: '',
      created: ''
    };
    this.error = '';
  }

  onSubmit() {
    this.error = '';
    this.success = '';
    if(this.validateData()) {
      if(this.selectedProject) {
        // update existing projectanization
        this.projectService.update(this.project).subscribe(x => {
          console.log(x);
          this.loadData();
          this.success = 'Project updated';
          this.toastr.success('Project updated', 'Success');
        });
        this.submitUsers();

      } else {
        // create new
        this.projectService.create(this.project).subscribe(x => {
          console.log(x);
          if(x && x.result == 'error') {
            this.error = x.message;
            this.toastr.error(x.message, 'Error');
          } else {
            this.loadData();
            this.success = 'Project created';
            this.toastr.success('Project created', 'Success');
          }
        });
      }


    }

  }

  validateData() {
    if(this.project.name) {
      this.error = '';
      return true;
    }
    this.error = 'Project name is required';
    this.toastr.error('Project name is required', 'Error');
    return false;
  }

  submitUsers() {
    var list = [];
    for(var i=0; i<this.usersInCurrentProject.length; i++) {
      list.push({
        project_id: this.selectedProject.id,
        user_id: this.usersInCurrentProject[i].id,
        status: 'active'
      })
    }
    var data = {
      list: list,
      project_id: this.selectedProject.id
    };
    this.projectService.setUsersInProject(data).subscribe(x => {
      console.log(x);
      this.usersChanged = false;
      this.projectService.getUsersByProject(this.selectedProject.id).subscribe(x => {
        console.log(x);
        if(x) {
          this.usersInCurrentProject = x;
        }
      });
    });
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

  // ----------- user tab methods -------------

  selectAllUsers(event) {
    console.log(event.target.checked);
    for(var i=0; i<this.usersInSystem.length; i++) {
      this.usersInSystem[i].selected = event.target.checked;
    }
  }

  selectUserInSystem(r) {
    r.selected = !r.selected;
  }

  isUserInList(user, list) {
    for(var i=0; i<list.length; i++) {
      if(user.id == list[i].id) return true;
    }
    return false;
  }

  onAddUser() {
    var selectedUsers = [];
    for(var i=0; i<this.usersInSystem.length; i++) {
      if(this.usersInSystem[i].selected && this.isUserInList(this.usersInSystem[i], this.usersInCurrentProject) == false) {
        selectedUsers.push(this.usersInSystem[i]);
      }
    }
    this.usersInCurrentProject = this.usersInCurrentProject.concat(selectedUsers);
    this.usersChanged = true;
  }

  selectAllProjectUsers(event) {
    for(var i=0; i<this.usersInCurrentProject.length; i++) {
      this.usersInCurrentProject[i].selectedForRemoving = event.target.checked;
    }
  }

  selectUserInProject(r) {
    r.selectedForRemoving = !r.selectedForRemoving;
  }

  onRemoveUsers() {
    for(var i=this.usersInCurrentProject.length - 1; i>=0; i--) {
      if(this.usersInCurrentProject[i].selectedForRemoving) {
        this.usersInCurrentProject.splice(i, 1);
      }
    }
    this.usersChanged = true;
  }

  onSubmitUsers() {
    this.submitUsers();
  }

  applyUserFilters() {
    this.usersInSystem = [];
    for(let i=0; i<this.allUsersInSystem.length; i++) {
      let u = this.allUsersInSystem[i];
      let matched = true;
      for(let j in this.userFilters) {
        if(this.userFilters[j] && u[j].toString().match(new RegExp(this.userFilters[j], 'i')) == null) {
          matched = false;
          break;
        }
      }
      if(matched) {
        this.usersInSystem.push(u);
      }
    }

  }

  onUserFilterChanged(value) {
    this.applyUserFilters();
  }

  onClearUserFilters() {
    this.userFilters = {};
    this.applyUserFilters();
  }
}
