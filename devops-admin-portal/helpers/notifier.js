const RequestReview = require('../models/request_review');
const RequestFE = require('../models/request_fe');
const User = require('../models/user');
const Notification = require('../models/notification');
const Mailer = require('../helpers/mailer')
const CronJobs = require('../helpers/cronJobs');

const NOTIFICATION_TYPE_REQUEST_REVIEW = 'review_request';
const NOTIFICATION_TYPE_REQUEST_REVIEW_DONE = 'review_request_done';


const validateAccountForSendingEmail = (account) => {
  return account != 'admin' && account != 'sadmin';
}

// Notify reviewers
exports.notify_to_reviewers = async (requestId) => {
  try {
    let reviews = await RequestReview.getWaitingReviewersListByRequest({request_id: requestId});
    for(let i=0; i<reviews.length; i++) {
      let review = reviews[i];
      let reviewer = await User.getWithId(review.reviewer_id);
      if(validateAccountForSendingEmail(reviewer.account)) {
        Notification.create({
          type: NOTIFICATION_TYPE_REQUEST_REVIEW,
          notify_to: reviewer.account,
          content: 'Please review FEM Request ' + review.request_id,
          ref_id: review.id,
          status: 'waiting',
          sent: null
        });
      }
    }
    CronJobs.send_notifications();
  } catch (err) {
    console.log(err);
  }

};

exports.notify_to_requester = async (request, result) => {
  try {
    let requestOwner = await User.getWithId(request.owner_id);
    if(validateAccountForSendingEmail(requestOwner.account)) {
      Notification.create({
        type: NOTIFICATION_TYPE_REQUEST_REVIEW_DONE,
        notify_to: requestOwner.account,
        content: 'FEM Request ' + request.id + ' was ' + result,
        ref_id: request.id,
        status: 'waiting',
        sent: null
      });
      CronJobs.send_notifications();
    }
  } catch (err) {
    console.log(err);
  }

};

const feHeaders = ['src_ip', 'des_ip', 'port', 'category', 'purpose'];
const approverHeaders = ['type', 'account', 'name'];

const exportCSV = (items, headers, html = false) => {
  if(items && items.length > 0) {
    const replacer = (key, value) => value === null ? '' : value;
    let csv = items.map(row => headers.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(',').replace(/['"]+/g, ''));
    //csv.unshift(header.join(','));
    let csvArray = html ? csv.join('<br>') : csv.join('\r\n');
    return csvArray;
  }
  return "";
}

const getRequestContent = (request) => {
  return '<br>□ Purpose<br>-' +
    request.purpose +
    '<br>□ User<br>-' +
    request.user +
    '<br>□ Explanation of related systems<br>-' +
    request.explanation +
    '<br>□ Etc.(Detail explanation)<br>-' +
    '[rId:'+ request.id + '] ' +
    request.etc + '<br>';
}

exports.raise_it4u_approval = async (request) => {
  let requestOwner = await User.getWithId(request.owner_id);
  if(validateAccountForSendingEmail(requestOwner.account) || process.env.EMAIL_TO_RPA) {
    try {
      // let firewallExceptions = FirewallException.getFeById()
      let firewallExceptions = await RequestFE.getByRequest({request_id: request.id});
      let attachmentContent = exportCSV(firewallExceptions, feHeaders);
      if(attachmentContent == null) return false;
      let approvers = await RequestReview.getApproversListByRequest({request_id: request.id});
      let content = `<!DOCTYPE html><html><body>` +
        `<h1>Request content</h1>` +
        '<p>' + getRequestContent(request) + '</p>' +
        `<h1>Approvers</h1>` +
        '<p>' + exportCSV(approvers, approverHeaders, true) + '</p>' +
        `</body></html>`;
      let email = {
        notify_to: process.env.EMAIL_TO_RPA || requestOwner.account,
        content: content,
        /*
        attachment: {
          content: attachmentContent,
          filename: 'rId' + request.id + '.csv'
        }
        */
        attachments: [
          {
            content: attachmentContent,
            filename: 'rId' + request.id + '.csv'
          },
          {
            content: JSON.stringify({
              content: getRequestContent(request),
              approvers: exportCSV(approvers, approverHeaders).split('\r\n')
            }),
            filename: 'rId' + request.id + '_request_content.json'
          }
        ]
      };
      return await Mailer.send_email_with_attachments(email);
    } catch (err) {
      console.log(err);
    }
  }
  return false;

};
