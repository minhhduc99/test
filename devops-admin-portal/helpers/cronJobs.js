const User = require('../models/user');
const Notification = require('../models/notification');
const Mailer = require('./mailer')


exports.send_notifications = function(req) {
  sendNotifications().then(re => {
    console.log(re);
  }, e => console.log(e))

};


var sendNotifications = async function() {
  try {
    console.log("cronjob - send_notifications");
    let r = await Notification.getByStatus({status: 'waiting'});
    let notified = 0;
    let sentResult = await Mailer.send_emails(r);
    //console.log(sentResult);
    for(let i=0; i<sentResult.length; i++) {
      try {
        await Notification.updateSent({id: sentResult[i].id});
        notified ++;
      } catch(e){
        console.log(e);
      }
    }
    return 'sendNotifications - sent ' + notified;
  } catch (e) {
    return e;
  }
}
