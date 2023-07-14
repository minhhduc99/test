import { Component, OnInit, OnDestroy } from '@angular/core';
import { TeamService, OrganizationService, UserService, AuthenticationService, AppMessageService } from '../../../services';
import { User, Role } from '../../../_models';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  subscriptions: Subscription[] = [];

  user: User;
  organizationId;

  teams = [];
  tableHeaders = [];

  count = 0;
  pageSize = 10; // 0 means no-paging
  numberOfPages = 1;
  currentPage = 0;

  selectedTeam = undefined;
  team = {
    id: '',
    name: '',
    description: '',
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
  usersInSystem = [];
  usersInCurrentTeam = [];
  usersChanged = false;

  constructor(private teamService: TeamService, private organizationService: OrganizationService,
    private userService: UserService, private authenticationService: AuthenticationService,
    private appMessageService: AppMessageService,
    private toastr: ToastrService) {

    this.authenticationService.currentUser.subscribe(x => {
        console.log(x);
        this.user = x;
        if(x) {
          if(this.user.role == Role.SAdmin) {
            this.organizationId = undefined;
          } else {
            this.organizationId = x.owner_id;
          }
          console.log(this.organizationId);
          this.team.owner_id = this.organizationId;
          this.loadData();
        }
    });


    // TODO: get user from current organization only
    this.userService.getAll(null, null, null).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        this.usersInSystem = x.data;
      }
    });
    this.subscriptions.push(
      this.appMessageService.getInAppMessage().subscribe(x => {
        console.log(x);
        if(x && x.type == AppMessageService.TYPE_SADMIN_ORGANIZATION_CHANGED) {
          this.organizationId = x.data == -1?undefined:x.data;
          this.loadData();
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

  loadData() {
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

    this.teamService.getAll(this.pageSize, this.currentPage * this.pageSize, this.organizationId).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        this.count = x.count;
        if(this.pageSize > 0)
          this.numberOfPages = Math.floor(this.count / this.pageSize);
        if(this.count % this.pageSize) {
          this.numberOfPages ++;
        }
        this.teams = x.data;
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

        if(this.team) {
          for(let i=0; i<this.teams.length; i++) {
            if(this.team.name == this.teams[i].name) {
              this.select(this.teams[i]);
            }
          }
        }
      }
    });



  }

  select(o) {

    this.selectedTeam = o;
    this.team.id = o.id;
    this.team.name = o.name;
    this.team.description = o.description;
    this.team.owner = o.owner;
    this.team.owner_id = o.owner_id;
    this.team.status = o.status;
    this.team.updated = o.updated;
    this.team.created = o.created;

    this.usersInCurrentTeam = [];
    this.teamService.getUserByTeam(null, null, o.id).subscribe(x => {
      console.log(x);
      if(x) {
        this.usersInCurrentTeam = x;
      }
    });
    this.usersChanged = false;
  }

  onReset() {
    this.selectedTeam = undefined;
    this.team = {
      id: '',
      name: '',
      description: '',
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
    console.log(this.team);
    if(this.validateData()) {
      if(this.selectedTeam) {
        // update existing teamanization
        this.teamService.update(this.team).subscribe(x => {
          console.log(x);
          this.loadData();
          this.success = 'Team updated';
          this.toastr.success('Team updated', 'Success');
        });
        this.submitUsers();
      } else {
        // create new
        this.teamService.create(this.team).subscribe(x => {
          console.log(x);
          if(x && x.result == 'error') {
            this.error = x.message;
            this.toastr.error(x.message, 'Error');
          } else {
            this.loadData();
            this.success = 'Team created';
            this.toastr.success('Team created', 'Success');
          }
        });
      }


    }

  }

  submitUsers() {
    var list = [];
    for(var i=0; i<this.usersInCurrentTeam.length; i++) {
      list.push({
        team_id: this.selectedTeam.id,
        user_id: this.usersInCurrentTeam[i].id,
        status: 'active'
      })
    }
    var data = {
      list: list,
      team_id: this.selectedTeam.id
    };
    this.teamService.setUsersInTeam(data).subscribe(x => {
      console.log(x);
      this.usersChanged = false;
      this.teamService.getUserByTeam(null, null, this.selectedTeam.id).subscribe(x => {
        console.log(x);
        if(x) {
          this.usersInCurrentTeam = x;
        }
      });
    });
  }

  validateData() {
    if(this.team.name) {
      this.error = '';
      return true;
    }
    this.error = 'Team name is required';
    this.toastr.error('Team name is required', 'Error');
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
      if(this.usersInSystem[i].selected && this.isUserInList(this.usersInSystem[i], this.usersInCurrentTeam) == false) {
        selectedUsers.push(this.usersInSystem[i]);
      }
    }
    this.usersInCurrentTeam = this.usersInCurrentTeam.concat(selectedUsers);
    this.usersChanged = true;
  }

  selectAllTeamUsers(event) {
    for(var i=0; i<this.usersInCurrentTeam.length; i++) {
      this.usersInCurrentTeam[i].selectedForRemoving = event.target.checked;
    }
  }

  selectUserInTeam(r) {
    r.selectedForRemoving = !r.selectedForRemoving;
  }

  onRemoveUsers() {
    for(var i=this.usersInCurrentTeam.length - 1; i>=0; i--) {
      if(this.usersInCurrentTeam[i].selectedForRemoving) {
        this.usersInCurrentTeam.splice(i, 1);
      }
    }
    this.usersChanged = true;
  }

  onSubmitUsers() {
    this.submitUsers();
  }
}
