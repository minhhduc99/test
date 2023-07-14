import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../services';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  appInfo: any;  

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.appService.getAppInfo().subscribe(x => {
      console.log(x);
      if(x) {
        this.appInfo = x;
      }
    });
  }

}
