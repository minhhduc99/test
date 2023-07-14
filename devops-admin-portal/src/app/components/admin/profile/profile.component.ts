import { Component, OnInit } from "@angular/core";
import {
  UserService,
  AuthenticationService,
  OrganizationService,
} from "../../../services";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"],
})
export class ProfileComponent implements OnInit {
  user: any;
  isAdmin = false;

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

  organizations = [
    {
      name: "Service Operation",
      id: 1,
    },
  ];

  error = "";
  success = "";

  constructor(
    private toastr: ToastrService,
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private organizationService: OrganizationService
  ) {}

  ngOnInit() {
    this.authenticationService.currentUser.subscribe((x) => {
      console.log(x);
      this.user = x;
      if (x) {
        this.isAdmin = this.user.role == "admin";
      }
    });
    this.organizationService.getAll(null, null).subscribe((x) => {
      console.log(x);
      if (x && x.data) {
        this.organizations = x.data;
      }
    });
  }

  onReset() {
    this.authenticationService.currentUser.subscribe((x) => {
      console.log(x);
      this.user = x;
      this.user.password = "";
      this.user.repeat_password = "";
      this.success = "";
      this.error = "";
    });
  }

  onSubmit() {
    this.success = "";
    this.error = "";
    console.log(this.user);
    var data = {
      user_id: this.user.id,
    };
    if (this.validateData()) {
      // update existing useranization
      if (this.user.password) {
        if (!this.validatePassword()) {
          return;
        }
      }
      console.log("updating user");
    }
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
}
