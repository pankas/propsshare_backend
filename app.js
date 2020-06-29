var express = require('express');
var routes = require('./routes/index');
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;// Configuration of mongoose Db
// Mongodb Connection
mongoose
  .connect(
    db,
    { useNewUrlParser: true,useUnifiedTopology: true }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
let app = express();
// Setting Data limit
app.use(bodyParser.urlencoded({limit: '50mb',extended:true}))
app.use(bodyParser.json({limit: '50mb'}));
let api = express();
let port = process.env.PORT || 5000;
app.listen(port,'0.0.0.0',()=>{
    console.log("server is running at"+port)
})
// API Base Url
app.use('/api', api);
// Handling CORS
api.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
  });
// API End Point
api.post('/register',routes.users.register);
api.post('/login',routes.users.login);
api.post('/update',routes.users.update);
api.get('/users/',routes.users.getUsers);
// api.post('/send-mail/',routes.users.sendMail);


