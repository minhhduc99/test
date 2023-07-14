var request = require('request');
var rp = require('request-promise');
const config = require('config');
const isPRD = config.get('env') == 'production';
const isSTG = config.get('env') == 'staging';

const testers = ['duong.ng2', 'cong.cuong', 'phu.hoang', 'hieu.nt4'];

const isTester = (account) => {
  for(let i=0; i<testers.length; i++) {
    if(account == testers[i]) return true;
  }
  return false;
}

const sendsMails = async function(emails) {
  let result = [];
  if(emails && emails.length) {
    try {
      r = await getAccessToken();
      let token = JSON.parse(r)['access_token'];
      //console.log(token);
      for(let i=0; i<emails.length; i++) {
        let email = emails[i];
        try {
          await sendEmail(token, {
            subject: '[Service Ops] FEM Notification',
            content: email.content,
            tos: email.notify_to.split(',').map(x => x + '@samsung.com'),
            ccs: []
          });
          result.push(email);
        } catch (e) {
          console.log('mailer - send_emails - ' + e);
        }
      }
    } catch (e) {
      console.log('mailer - send_emails - ' + e);
    }
  }
  return result;
}

const sendsMailsToTesters = async function(emails) {
  if(emails && emails.length) {
    try {
      r = await getAccessToken();
      let token = JSON.parse(r)['access_token'];
      //console.log(token);
      for(let i=0; i<emails.length; i++) {
        let email = emails[i];
        if(isTester(email.notify_to)) {
          // send email to testers
          try {
            await sendEmail(token, {
              subject: '[Service Ops] FEM Notification',
              content: email.content,
              tos: email.notify_to.split(',').map(x => x + '@samsung.com'),
              ccs: []
            });
          } catch (e) {
            console.log('mailer - send_emails - ' + e);
          }
        }
      }
    } catch (e) {
      console.log('mailer - sendsMailsToTesters - ' + e);
    }
  }
  return emails;
}

const sendsMailWithAttachment = async function(email) {
  if(email) {
    try {
      r = await getAccessToken();
      let token = JSON.parse(r)['access_token'];
      return await sendEmailWithAttachment(token, {
        subject: '[Service Ops][FEM] Firewall Exception Request',
        content: email.content,
        tos: email.notify_to.split(',').map(x => x + '@samsung.com'),
        ccs: []
      }, email.attachment);
    } catch (e) {
      console.log('mailer - sendsMailWithAttachment - ' + e);
    }
  }
  return false;
}

const sendsMailWithAttachments = async function(email) {
  if(email) {
    try {
      r = await getAccessToken();
      let token = JSON.parse(r)['access_token'];
      return await sendEmailWithAttachments(token, {
        subject: '[Service Ops][FEM] Firewall Exception Request',
        content: email.content,
        tos: email.notify_to.split(',').map(x => x + '@samsung.com'),
        ccs: []
      }, email.attachments);
    } catch (e) {
      console.log('mailer - sendsMailWithAttachment - ' + e);
    }
  }
  return false;
}

//
exports.send_emails = async function(emails) {
  //console.log('mailer - send_emails - emails = %s', JSON.stringify(emails));
  if(isPRD) return sendsMails(emails); // only send email on PRD
  if(isSTG) {
    // For testers only
    return sendsMailsToTesters(emails);
  }
  // send nothing in dev env
  return emails;
};

//
exports.send_email_with_attachment = async function(email) {
  //console.log('mailer - send_emails - emails = %s', JSON.stringify(emails));
  if(isPRD) return sendsMailWithAttachment(email); // only send email on PRD
  if(isSTG) {
    // For testers only
    if(email && isTester(email.notify_to))
      return sendsMailWithAttachment(email);
  }
  // send nothing in dev env
  return true;
};


//
exports.send_email_with_attachments = async function(email) {
  //console.log('mailer - send_emails - emails = %s', JSON.stringify(emails));
  if(isPRD) return sendsMailWithAttachments(email); // only send email on PRD
  if(isSTG) {
    // For testers only
    if(email && isTester(email.notify_to))
      return sendsMailWithAttachments(email);
  }
  // send nothing in dev env
  return true;
};

var getAccessToken = function() {
  var url = config.get('send_mail_url') + '/uaaserver/oauth/token';
  var userName = process.env.SEND_EMAIL_USERNAME;
  var password = process.env.SEND_EMAIL_PASSWORD;
  var options = {
    method: 'POST',
    //headers: {'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic d2ViX2FwcDo='},
    headers: {'Authorization': 'Basic d2ViX2FwcDo='},
    url: url,
    form: {
      grant_type: 'password',
      username: userName,
      password: password
    },
    //json: true
  };
  return rp(options);
}


var sendEmail = function(token, email) {
  // var url = config.get('send_mail_url') + '/mmsnotify/api/email/send-esb'; // deplicated api
  var url = config.get('send_mail_url') + '/knoxservice/api/email/send';
  var options = {
    method: 'POST',
    headers: {'content-type': 'application/json', 'Authorization': 'Bearer ' + token},
    url: url,
    body: {
      from: config.get('send_mail_user'),
      subject: email.subject,
      content: email.content,
      ccs: email.ccs,
      //tos: array of emails ["email1", "email2"]
      //to: single email
      tos: email.tos,
      html: true,
      multipart: true,
    },
    json: true
  };
  return rp(options);
}

var sendEmailWithAttachment = function(token, email, attachment) {
  var url = config.get('send_mail_url') + '/knoxservice/api/email/send-mail-with-attachment';
  var options = {
    method: 'POST',
    headers: {'Authorization': 'Bearer ' + token},
    url: url,
    formData: {
        jsonString: JSON.stringify({
          from: config.get('send_mail_user'),
          subject: email.subject,
          content: email.content,
          ccs: email.ccs,
          //tos: array of emails ["email1", "email2"]
          //to: single email
          tos: email.tos,
          html: true,
          multipart: true,
        }),
        attachment: {
            value: attachment.content,
            options: {
                filename: attachment.filename
            }
        }
    }
  };
  return rp(options);
}

var sendEmailWithAttachments = function(token, email, attachments) {
  var url = config.get('send_mail_url') + '/knoxservice/api/email/send-mail-with-attachments';
  let atms = [];
  for(let i=0; i<attachments.length; i++) {
    atms.push({
        value: attachments[i].content,
        options: {
            filename: attachments[i].filename
        }
    });
  }
  var options = {
    method: 'POST',
    headers: {'Authorization': 'Bearer ' + token},
    url: url,
    formData: {
        jsonString: JSON.stringify({
          from: config.get('send_mail_user'),
          subject: email.subject,
          content: email.content,
          ccs: email.ccs,
          //tos: array of emails ["email1", "email2"]
          //to: single email
          tos: email.tos,
          html: true,
          multipart: true,
        }),
        attachments: atms
    }
  };
  return rp(options);
}
