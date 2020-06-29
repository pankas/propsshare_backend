const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
      },
    lastName: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    dateOfBirth: {
        type: String,
        required: true
      },
    date: {
      type: Date,
      default: Date.now
    }
  });
//Setting Model
var User = mongoose.model("users", UserSchema)
// Register User
exports.register = (req,res)=>{

    User.findOne({ email: req.body.data.email }).then(user => {
        if (user) {
          return res.json({ error: "Email already exists" });
        } else {
          const newUser = new User({
            firstName: req.body.data.firstname,
            lastName: req.body.data.lastname,
            email: req.body.data.email,
            gender:req.body.data.gender,
            dateOfBirth:req.body.data.dateOfBirth,
            password: req.body.data.password1
          });
  console.log("rreq bodt",req.body)

    const ecrypt = cryptr.encrypt(newUser.password);
    newUser.password =  ecrypt;
    newUser
    .save()
    .then(user =>{ 
      console.log("user",user)
        res.json(user)})
    .catch(err => console.log(err));
        }
      });
}
// User Login
exports.login = (req,res)=>{
    const email = req.body.data.email;
    const password = req.body.data.password;
    User.findOne({ email }).then(user => {
      if (!user) {
        return res.json({ error: "Email not found" });
      }
  const dcrptPassword = cryptr.decrypt(user.password);
        if (password === dcrptPassword) {
          const payload = {
            id: user.id,
            name: user.name
          };
          jwt.sign(
            payload,
            keys.secretOrKey,
            {
              expiresIn: 31556926 // 1 year in seconds
            },
            (err, token) => {
              res.json({
                success: true,
                token: token,
                firstname:user.firstName,
                lastname:user.lastName,
                email: user.email,
                gender:user.gender,
                dob:user.dateOfBirth
                // type:user.uType
              });
            }
          );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
    });
}
exports.getUsers = (req,res)=>{
  const header = req.headers['authorization'];
  if(header !== undefined){
    jwt.verify(header,'propshare', function(err, decoded) {
      if(err){
          console.log(err)
      }else{
        User.find()
        .then(response=>{    
          return res
          .json({response});
          })
          .catch(err=>{
              console.log("error",err)
          })
      }
     })
  }else{
    res.sendStatus(403);
  }
}
exports.userDetails = (req,res)=>{
  const header = req.headers['authorization'];
  if(header !== undefined){
    jwt.verify(header,'propshare', function(err, decoded) {
      if(err){
      }else{
        const email = req.body.data.email;
        User.findOne({ email }).then(user => {
          if (!user) {
            return res.json({ error: "Email not found" });
          }
          res.json({
            success: true,
            token: token,
            firstname:user.firstName,
            lastname:user.lastName,
            email: user.email,
            type:user.uType
          });
        });
      }
     })
  }else{
    res.sendStatus(403);
  }
}
exports.update = (req,res)=>{
    let fname = req.body.data.fname
    let lname = req.body.data.lname
    let email = req.body.data.email
    let gender = req.body.data.gender
    newData = {
        firstName: fname,
        lastName: lname,
        gender: gender
    }
    const header = req.headers['authorization'];
    if(header !== undefined){
      jwt.verify(header,'propshare', function(err, decoded) {
        if(err){
            console.log(err)
        }else{
          const email = req.body.data.email;
          User.updateOne({'email':email}, {$set: newData}, {upsert: true})
          .then(r=>{
            User.findOne({ email }).then(user => {
              res.json({
                success: true,
                firstname:user.firstName,
                lastname:user.lastName,
                email: user.email,
                gender:user.gender
              });
            });
          })
          .catch(err=>{
              console.log("error",err)
          })
        }
       })
    }else{
      res.sendStatus(403);
    } 
}