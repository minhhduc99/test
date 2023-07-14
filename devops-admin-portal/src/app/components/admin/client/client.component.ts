import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClientService, OrganizationService, UserService, AuthenticationService, AppMessageService } from '../../../services';
import { User, Role } from '../../../_models';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as crypto from 'crypto-js';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {

  subscriptions: Subscription[] = [];

  user: User;
  organizationId;

  clients = [];
  tableHeaders = [];

  count = 0;
  pageSize = 50; // 0 means no-paging
  numberOfPages = 1;
  currentPage = 0;

  selectedClient = undefined;
  client = {
    id: '',
    name: '',
    key: '',
    description: '',
    owner: '',
    owner_id: 1,
    expire_date: '',
    status: 'active',
    updated: '',
    created: ''
  };

  excludedHeaders = ['owner_id'];

  usersInSystem = [];

  error = '';
  success = '';

  constructor(private clientService: ClientService, private organizationService: OrganizationService,
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
          if(!this.isAdmins()) return;

          this.client.owner_id = x.id;
          this.client.owner = x.name;
          this.loadData();
        }
    });


    // TODO: get user from current organization only
    this.userService.getAll(null, null, null).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        this.usersInSystem = [{name: 'System Administrator', id: 2}].concat(x.data);
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

    this.clientService.getAll(this.pageSize, this.currentPage * this.pageSize).subscribe(x => {
      console.log(x);
      if(x && x.data) {
        this.count = x.count;
        if(this.pageSize > 0)
          this.numberOfPages = Math.floor(this.count / this.pageSize);
        if(this.count % this.pageSize) {
          this.numberOfPages ++;
        }
        this.clients = x.data;
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

        if(this.client) {
          for(let i=0; i<this.clients.length; i++) {
            if(this.client.name == this.clients[i].name) {
              this.select(this.clients[i]);
            }
          }
        }
      }
    });

  }

  select(o) {

    this.selectedClient = o;
    this.client.id = o.id;
    this.client.name = o.name;
    this.client.key = o.key;
    this.client.expire_date = o.expire_date;
    this.client.description = o.description;
    this.client.owner = o.owner;
    this.client.owner_id = o.owner_id;
    this.client.status = o.status;
    this.client.updated = o.updated;
    this.client.created = o.created;

  }

  onReset() {
    this.selectedClient = undefined;
    this.client = {
      id: '',
      name: '',
      key: '',
      expire_date: '',
      description: '',
      owner: '',
      owner_id: this.user.id,
      status: 'active',
      updated: '',
      created: ''
    };
    this.error = '';
  }

  onSubmit() {
    this.error = '';
    this.success = '';
    console.log(this.client);
    if(this.validateData()) {
      if(this.selectedClient) {
        // update existing clientanization
        this.clientService.update(this.client).subscribe(x => {
          console.log(x);
          this.loadData();
          this.success = 'Client updated';
          this.toastr.success('Client updated', 'Success');
        });
      } else {
        // create new
        this.clientService.create(this.client).subscribe(x => {
          console.log(x);
          if(x && x.result == 'error') {
            this.error = x.message;
            this.toastr.error(x.message, 'Error');
          } else {
            this.loadData();
            this.success = 'Client created';
            this.toastr.success('Client created', 'Success');
          }
        });
      }


    }

  }


  validateData() {
    if(this.client.name) {
      this.error = '';
      return true;
    }
    this.error = 'Client name is required';
    this.toastr.error('Client name is required', 'Error');
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

  generateKey() {
    this.error = '';
    if(!this.client.name) {
      this.error = 'Client name is required';
    } else {
      const password = this.client.name;
      const salt = crypto.lib.WordArray.random(16);
      const key = crypto.enc.Hex.stringify(crypto.PBKDF2(password, salt, { keySize: 256/32, iterations: 1000, hasher: crypto.algo.SHA256}));
      this.client.key = key;

      // this is for testing
      /*
      let encrypted = crypto.AES.encrypt("Message", key);
      console.log(encrypted);
      this.client.key = crypto.enc.Hex.stringify(encrypted.key);
      */

    }
  }

}
