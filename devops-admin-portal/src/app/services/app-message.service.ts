import { Injectable } from '@angular/core';
import { Observable,Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppMessageService {
  static TYPE_NEW_ADD_SOURCE_IP_ADDRESSES = 0;
  static TYPE_NEW_ADD_DESTINATION_IP_ADDRESSES = 1;
  static TYPE_NEW_UPDATE_SOURCE_IP_ADDRESSES = 10;
  static TYPE_NEW_UPDATE_DESTINATION_IP_ADDRESSES = 11;
  static TYPE_NEW_REMOVE_SOURCE_IP_ADDRESSES = 20;
  static TYPE_NEW_REMOVE_DESTINATION_IP_ADDRESSES = 21;
  
  static TYPE_SADMIN_ORGANIZATION_CHANGED = 100;

  // subject to send in app messages among components
  private subject = new Subject<any>();

  constructor() { }

  //--------------------- In App Message Service ----------------
  sendInAppMessage(message: string) {
      this.subject.next({ type: message });
  }

  sendInAppMessageWithData(type, data) {
      this.subject.next({ type: type, data: data });
  }

  clearInAppMessage() {
      this.subject.next();
  }

  getInAppMessage(): Observable<any> {
      return this.subject.asObservable();
  }

}
