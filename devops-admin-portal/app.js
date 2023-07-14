var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/user');
var appRouter = require('./routes/app');
var orgRouter = require('./routes/organization');
var teamRouter = require('./routes/team');
var teamUserRouter = require('./routes/team_user');
var projectRouter = require('./routes/project');
var projectUserRouter = require('./routes/project_user');
var clientRouter = require('./routes/client');
// apis for clients
var clientUser = require('./routes/client_user');

const Config = require('config');
const AppDAO = require('./models/dao');
const User = require('./models/user')
const Org = require('./models/organization')
const Team = require('./models/team')
const TeamUser = require('./models/team_user')
const Project = require('./models/project')
const ProjectUser = require('./models/project_user')
const Notification = require('./models/notification')
const Client = require('./models/client')

var cors = require('cors');
var CronJob = require('cron').CronJob;
var CronJobs = require('./helpers/cronJobs');


var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// const rawBodyExtractor = (req, res, buf, encoding) =>{
//   //console.log(buf.toString(encoding || 'utf8'));
//   if (buf && buf.length) {
//     req.rawBody = buf.toString(encoding || 'utf8');
//   }
// }

app.use(logger('dev'));
app.use(express.raw({/*verify: rawBodyExtractor,*/ limit: '10mb', extended: true, type: ["text/plain", 'message/rfc822']}));
app.use(express.json({limit: '10mb', extended: true}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist/dap')));

app.use('/api/app', appRouter);
app.use('/api/user', usersRouter);
app.use('/api/organization', orgRouter);
app.use('/api/team', teamRouter);
app.use('/api/teamUser', teamUserRouter);
app.use('/api/project', projectRouter);
app.use('/api/projectUser', projectUserRouter);
app.use('/api/client', clientRouter);
app.use('/client-api/user', clientUser);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const dbFile = Config.get('database_config').filePath;
dao = new AppDAO(dbFile);

User.createTable();
Org.createTable();
Team.createTable();
TeamUser.createTable();
Project.createTable();
ProjectUser.createTable();
Notification.createTable();
Client.createTable();

/*
new CronJob({
  // every hour
  cronTime: '0 0 * * * *',
  onTick: function() {
      CronJobs.send_notifications();
    },
  onComplete: null,
  start: true,
  timezone: null,
  context: null,
  runOnInit: true
});
*/

module.exports = app;
