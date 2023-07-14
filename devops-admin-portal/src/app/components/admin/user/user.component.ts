import { Component, OnInit } from '@angular/core';
import { TeamService, OrganizationService, UserService, AuthenticationService, AppMessageService } from '../../../services';
import { User, Role } from '../../../_models';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"],
})
export class UserComponent implements OnInit {
  subscriptions: Subscription[] = [];

  currentUser: User;
  organizationId;

  allUsers = [];
  users = [];
  tableHeaders = [];

  count = 0;
  pageSize = 0; // 0 means no-paging
  numberOfPages = 1;
  currentPage = 0;

  selectedUser = undefined;
  user = {
    id: "",
    name: "",
    account: "",
    password: "",
    repeat_password: "",
    owner: "",
    owner_id: 1,
    role: "user",
    status: "active",
    description: "",
    created: "",
    updated: "",
  };

  organizations = [
    {
      name: "Service Operation",
      id: 1,
    },
  ];

  roles = [
    {
      role: "admin",
      display: "Administrator",
    },
    {
      role: "user",
      display: "User",
    },

    {
      role: "project_leader",
      display: "Project Leader",
    },
    {
      role: "team_leader",
      display: "Team Leader",
    },
  ];

  excludedHeaders = ["password", "salt", "owner_id", "created", "updated"];

  error = "";
  success = "";

  filters = {};

  constructor(
    private userService: UserService,
    private organizationService: OrganizationService,
    private authenticationService: AuthenticationService,
    private appMessageService: AppMessageService,
    private toastr: ToastrService
  ) {
    this.authenticationService.currentUser.subscribe((x) => {
      console.log(x);
      this.currentUser = x;
      if (x) {
        if (this.currentUser.role == Role.SAdmin) {
          this.organizationId = undefined;
        } else {
          this.organizationId = x.owner_id;
        }
        console.log(this.organizationId);
        this.user.owner_id = this.organizationId;
        this.loadData();
      }
    });

    this.subscriptions.push(
      this.appMessageService.getInAppMessage().subscribe((x) => {
        console.log(x);
        if (x && x.type == AppMessageService.TYPE_SADMIN_ORGANIZATION_CHANGED) {
          this.organizationId = x.data == -1 ? undefined : x.data;
          this.loadData();
        }
      })
    );
  }

  isAdmins() {
    return this.currentUser.role != Role.User;
  }

  ngOnInit() {}

  ngOnDestroy() {
    console.log(this.subscriptions);
    this.subscriptions.forEach((s) => {
      s.unsubscribe();
    });
  }

  applyFilters() {
    this.users = [];
    for (let i = 0; i < this.allUsers.length; i++) {
      let u = this.allUsers[i];
      let matched = true;
      for (let j in this.filters) {
        if (
          this.filters[j] &&
          u[j].toString().match(new RegExp(this.filters[j], "i")) == null
        ) {
          matched = false;
          break;
        }
      }
      if (matched) {
        this.users.push(u);
      }
    }
  }

  loadData() {
    this.userService
      .getAll(
        this.pageSize,
        this.currentPage * this.pageSize,
        this.organizationId
      )
      .subscribe((x) => {
        console.log(x);
        if (x && x.data) {
          this.count = x.count;
          if (this.pageSize > 0)
            this.numberOfPages = Math.floor(this.count / this.pageSize);
          if (this.count % this.pageSize) {
            this.numberOfPages++;
          }
          this.allUsers = x.data;
          this.applyFilters();
          if (x.data.length > 0) {
            this.tableHeaders = Object.keys(x.data[0]);
            for (var i = this.tableHeaders.length - 1; i >= 0; i--) {
              for (var h = 0; h < this.excludedHeaders.length; h++) {
                if (this.excludedHeaders[h] == this.tableHeaders[i]) {
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

    this.organizationService.getAll(null, null).subscribe((x) => {
      console.log(x);
      if (x && x.data) {
        if (this.organizationId) {
          this.organizations = [];
          for (let i = 0; i < x.data.length; i++) {
            if (x.data[i].id == this.organizationId) {
              this.organizations.push(x.data[i]);
              break;
            }
          }
        } else {
          this.organizations = x.data;
        }

        if (this.organizations && this.organizations.length) {
          this.user.owner_id = this.organizations[0].id;
        }
      }
    });
  }

  select(o) {
    this.selectedUser = o;
    this.user.id = o.id;
    this.user.name = o.name;
    this.user.account = o.account;
    this.user.description = o.description;
    this.user.owner_id = o.owner_id;
    this.user.owner = o.owner;
    this.user.role = o.role;
    this.user.status = o.status;
    this.user.updated = o.updated;
    this.user.created = o.created;
    this.user.password = "";
    this.user.repeat_password = "";
    this.success = "";
    this.error = "";
  }

  onReset() {
    console.log("onReset");
    this.selectedUser = undefined;

    this.user = {
      account: "",
      id: "",
      name: "",
      description: "",
      password: "",
      repeat_password: "",
      owner: "",
      owner_id: 1,
      role: "user",
      status: "active",
      updated: "",
      created: "",
    };

    if (this.organizations && this.organizations.length) {
      this.user.owner_id = this.organizations[0].id;
    }

    this.error = "";
    this.success = "";
    return true;
  }

  onSubmit() {
    this.success = "";
    this.error = "";
    console.log(this.user);
    var data = {
      user_id: this.user.id,
    };
    if (this.validateData()) {
      if (this.selectedUser) {
        // update existing useranization
        if (this.user.password) {
          if (!this.validatePassword()) {
            return;
          }
        }
        console.log("updating user");
        this.userService.update(this.user).subscribe((x) => {
          console.log(x);
        });
      } else {
        // create new
        // verify password
        if (this.validatePassword()) {
          console.log("creating new user");
          this.userService.create(this.user).subscribe((x) => {
            console.log(x);
            if (x && x.result == "error") {
              this.error = x.message;
              this.toastr.error(x.message, "Error");
            }
          });
        }
      }
    }
  }

  getById(id, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        return list[i];
      }
    }
    return null;
  }

  isInList(id, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id == id) {
        return true;
      }
    }
    return false;
  }

  validatePassword() {
    if (
      !this.user.password ||
      this.user.password !== this.user.repeat_password
    ) {
      this.error = "Please check password";
      this.toastr.error("Please check password", "Error");
      return false;
    }
    return true;
  }

  validateData() {
    if (!this.user.account) {
      this.error = "SingleId is required";
      this.toastr.error("SingleId is required", "Error");
      return false;
    }
    if (!this.user.owner_id) {
      this.error = "Please check owner";
      this.toastr.error("Please check owner", "Error");
      return false;
    }
    this.error = "";
    return true;
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

  onFilterChanged(value) {
    this.applyFilters();
  }

  onClearFilters() {
    this.filters = {};
    this.applyFilters();
  }
}
