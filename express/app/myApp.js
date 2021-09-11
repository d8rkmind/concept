const express = require('express');
const app = express();

let helmet = require('helmet');
const nocache = require("nocache");
app.use(nocache());

const permissionsPolicy = require("permissions-policy");


var ninetyDaysInSeconds = 90*24*60*60;
app.use(
  helmet.hidePoweredBy(),
  helmet.frameguard({action:'DENY'}),
  helmet.noSniff(),
  helmet.dnsPrefetchControl(),
  helmet.ieNoOpen(),
  helmet.hsts({ maxAge: ninetyDaysInSeconds, force: true }),
  helmet.referrerPolicy(),
  helmet.xssFilter(),
  permissionsPolicy({
    features: {
      fullscreen: ["self"],
      syncXhr: []
    },
  })
 );

module.exports = app;
const api = require('./server.js');
app.use(express.static('public'));
app.disable('strict-transport-security');
app.use('/_api', api);
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}`);
});
